import express from "express";

import { pool } from "../db/pool.js";

import {
    authenticate,
    authorize
} from "../middleware/auth.js";

import {
    createUserSchema,
    createStoreSchema
} from "../validators.js";

import { hashPassword } from "../utils/auth.js";


const router = express.Router();


router.use(
    authenticate,
    authorize("ADMIN")
);


/* DASHBOARD */

router.get(
    "/dashboard",
    async (req, res, next) => {

        try {

            const result =
                await pool.query(`
                    SELECT

                    (SELECT COUNT(*)
                     FROM users)::int
                     AS "totalUsers",

                    (SELECT COUNT(*)
                     FROM stores)::int
                     AS "totalStores",

                    (SELECT COUNT(*)
                     FROM ratings)::int
                     AS "totalRatings"
                `);


            res.json({
                success: true,
                data: result.rows[0]
            });


        } catch (error) {

            next(error);

        }

    }
);


/* CREATE USER */

router.post(
    "/users",
    async (req, res, next) => {

        try {

            const data =
                createUserSchema.parse(
                    req.body
                );


            const passwordHash =
                await hashPassword(
                    data.password
                );


            const result =
                await pool.query(
                    `INSERT INTO users
                    (
                        name,
                        email,
                        password_hash,
                        address,
                        role
                    )
                    VALUES ($1,$2,$3,$4,$5)
                    RETURNING
                        id,
                        name,
                        email,
                        address,
                        role`,
                    [
                        data.name,
                        data.email,
                        passwordHash,
                        data.address,
                        data.role
                    ]
                );


            res.status(201).json({
                success: true,
                data: result.rows[0]
            });


        } catch (error) {

            if (error.name === "ZodError") {

                return res.status(400).json({
                    success: false,
                    message:
                        error.issues[0].message
                });

            }

            next(error);

        }

    }
);


/* LIST USERS */

router.get(
    "/users",
    async (req, res, next) => {

        try {

            const {
                name = "",
                email = "",
                address = "",
                role = "",
                sortBy = "name",
                sortOrder = "asc"
            } = req.query;


            const sortFields = {

                name: "u.name",

                email: "u.email",

                address: "u.address",

                role: "u.role"

            };


            const sortColumn =
                sortFields[sortBy]
                || "u.name";


            const order =
                sortOrder === "desc"
                ? "DESC"
                : "ASC";


            const result =
                await pool.query(
                    `SELECT
                        u.id,
                        u.name,
                        u.email,
                        u.address,
                        u.role,

                        CASE
                            WHEN u.role='STORE_OWNER'
                            THEN COALESCE(
                                ROUND(
                                    AVG(r.rating)::numeric,
                                    2
                                ),
                                0
                            )
                        END AS rating

                    FROM users u

                    LEFT JOIN stores s
                        ON s.owner_id=u.id

                    LEFT JOIN ratings r
                        ON r.store_id=s.id

                    WHERE
                        u.name ILIKE $1
                    AND
                        u.email ILIKE $2
                    AND
                        u.address ILIKE $3
                    AND
                        ($4='' OR u.role=$4)

                    GROUP BY u.id

                    ORDER BY
                        ${sortColumn}
                        ${order}`,
                    [
                        `%${name}%`,
                        `%${email}%`,
                        `%${address}%`,
                        role
                    ]
                );


            res.json({
                success: true,
                data: result.rows
            });


        } catch (error) {

            next(error);

        }

    }
);


/* USER DETAILS */

router.get(
    "/users/:id",
    async (req, res, next) => {

        try {

            const result =
                await pool.query(
                    `SELECT
                        u.id,
                        u.name,
                        u.email,
                        u.address,
                        u.role,

                        CASE
                            WHEN u.role='STORE_OWNER'
                            THEN COALESCE(
                                ROUND(
                                    AVG(r.rating)::numeric,
                                    2
                                ),
                                0
                            )
                        END AS rating

                    FROM users u

                    LEFT JOIN stores s
                        ON s.owner_id=u.id

                    LEFT JOIN ratings r
                        ON r.store_id=s.id

                    WHERE u.id=$1

                    GROUP BY u.id`,
                    [req.params.id]
                );


            if (!result.rows[0]) {

                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });

            }


            res.json({
                success: true,
                data: result.rows[0]
            });


        } catch (error) {

            next(error);

        }

    }
);


/* CREATE STORE */

router.post(
    "/stores",
    async (req, res, next) => {

        try {

            const data =
                createStoreSchema.parse(
                    req.body
                );


            if (data.ownerId) {

                const owner =
                    await pool.query(
                        `SELECT id,role
                         FROM users
                         WHERE id=$1`,
                        [data.ownerId]
                    );


                if (
                    !owner.rows[0] ||
                    owner.rows[0].role !==
                    "STORE_OWNER"
                ) {

                    return res.status(400).json({
                        success: false,
                        message:
                            "Selected user is not a store owner"
                    });

                }

            }


            const result =
                await pool.query(
                    `INSERT INTO stores
                    (
                        name,
                        email,
                        address,
                        owner_id
                    )
                    VALUES ($1,$2,$3,$4)

                    RETURNING
                        id,
                        name,
                        email,
                        address,
                        owner_id`,
                    [
                        data.name,
                        data.email,
                        data.address,
                        data.ownerId ?? null
                    ]
                );


            res.status(201).json({
                success: true,
                data: result.rows[0]
            });


        } catch (error) {

            if (error.name === "ZodError") {

                return res.status(400).json({
                    success: false,
                    message:
                        error.issues[0].message
                });

            }

            next(error);

        }

    }
);


/* LIST STORES */

router.get(
    "/stores",
    async (req, res, next) => {

        try {

            const {
                name = "",
                email = "",
                address = "",
                sortBy = "name",
                sortOrder = "asc"
            } = req.query;


            const sortFields = {

                name: "s.name",

                email: "s.email",

                address: "s.address",

                rating: "average_rating"

            };


            const sortColumn =
                sortFields[sortBy]
                || "s.name";


            const order =
                sortOrder === "desc"
                ? "DESC"
                : "ASC";


            const result =
                await pool.query(
                    `SELECT

                        s.id,
                        s.name,
                        s.email,
                        s.address,

                        COALESCE(
                            ROUND(
                                AVG(r.rating)::numeric,
                                2
                            ),
                            0
                        ) AS rating

                    FROM stores s

                    LEFT JOIN ratings r
                        ON r.store_id=s.id

                    WHERE
                        s.name ILIKE $1

                    AND
                        s.email ILIKE $2

                    AND
                        s.address ILIKE $3

                    GROUP BY s.id

                    ORDER BY
                        ${sortColumn}
                        ${order}`,
                    [
                        `%${name}%`,
                        `%${email}%`,
                        `%${address}%`
                    ]
                );


            res.json({
                success: true,
                data: result.rows
            });


        } catch (error) {

            next(error);

        }

    }
);


export default router;