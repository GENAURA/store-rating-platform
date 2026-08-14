import express from "express";

import { pool } from "../db/pool.js";

import {
    authenticate,
    authorize
} from "../middleware/auth.js";

import { ratingSchema } from "../validators.js";


const router = express.Router();


/* GET STORES */

router.get(
    "/",
    authenticate,
    authorize("USER"),

    async (req, res, next) => {

        try {

            const {
                name = "",
                address = "",
                sortBy = "name",
                sortOrder = "asc"
            } = req.query;


            const sortFields = {

                name: "s.name",

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
                        ) AS "overallRating",

                        ur.rating AS "userRating"

                    FROM stores s

                    LEFT JOIN ratings r
                        ON r.store_id=s.id

                    LEFT JOIN ratings ur
                        ON
                            ur.store_id=s.id
                        AND
                            ur.user_id=$1

                    WHERE
                        s.name ILIKE $2

                    AND
                        s.address ILIKE $3

                    GROUP BY
                        s.id,
                        ur.rating

                    ORDER BY
                        ${sortColumn}
                        ${order}`,
                    [
                        req.user.userId,
                        `%${name}%`,
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


/* SUBMIT OR UPDATE RATING */

router.post(
    "/:storeId/rating",

    authenticate,
    authorize("USER"),

    async (req, res, next) => {

        try {

            const {
                rating
            } =
                ratingSchema.parse(
                    req.body
                );


            const store =
                await pool.query(
                    "SELECT id FROM stores WHERE id=$1",
                    [req.params.storeId]
                );


            if (!store.rows[0]) {

                return res.status(404).json({
                    success: false,
                    message: "Store not found"
                });

            }


            const result =
                await pool.query(
                    `INSERT INTO ratings
                    (
                        user_id,
                        store_id,
                        rating
                    )

                    VALUES ($1,$2,$3)

                    ON CONFLICT
                    (
                        user_id,
                        store_id
                    )

                    DO UPDATE SET
                        rating=EXCLUDED.rating,
                        updated_at=NOW()

                    RETURNING
                        id,
                        user_id,
                        store_id,
                        rating`,
                    [
                        req.user.userId,
                        req.params.storeId,
                        rating
                    ]
                );


            res.status(201).json({
                success: true,
                message: "Rating saved successfully",
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


export default router;