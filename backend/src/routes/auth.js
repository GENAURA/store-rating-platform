import express from "express";

import { pool } from "../db/pool.js";

import {
    hashPassword,
    comparePassword,
    generateToken
} from "../utils/auth.js";

import {
    registerSchema,
    loginSchema,
    changePasswordSchema
} from "../validators.js";

import { authenticate } from "../middleware/auth.js";


const router = express.Router();


/* REGISTER */

router.post("/register", async (req, res, next) => {

    try {

        const data =
            registerSchema.parse(req.body);

        const existing =
            await pool.query(
                "SELECT id FROM users WHERE email=$1",
                [data.email]
            );

        if (existing.rows.length > 0) {

            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });

        }


        const passwordHash =
            await hashPassword(data.password);


        const result =
            await pool.query(
                `INSERT INTO users
                (name,email,password_hash,address,role)
                VALUES ($1,$2,$3,$4,'USER')
                RETURNING id,name,email,address,role`,
                [
                    data.name,
                    data.email,
                    passwordHash,
                    data.address
                ]
            );


        const user = result.rows[0];

        const token =
            generateToken(user);


        res.status(201).json({
            success: true,
            token,
            user
        });


    } catch (error) {

        if (error.name === "ZodError") {

            return res.status(400).json({
                success: false,
                message: error.issues[0].message
            });

        }

        next(error);

    }

});


/* LOGIN */

router.post("/login", async (req, res, next) => {

    try {

        const data =
            loginSchema.parse(req.body);


        const result =
            await pool.query(
                `SELECT
                    id,
                    name,
                    email,
                    password_hash,
                    address,
                    role
                 FROM users
                 WHERE email=$1`,
                [data.email]
            );


        const user = result.rows[0];


        if (
            !user ||
            !(await comparePassword(
                data.password,
                user.password_hash
            ))
        ) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });

        }


        delete user.password_hash;


        const token =
            generateToken(user);


        res.json({
            success: true,
            token,
            user
        });


    } catch (error) {

        if (error.name === "ZodError") {

            return res.status(400).json({
                success: false,
                message: error.issues[0].message
            });

        }

        next(error);

    }

});


/* CURRENT USER */

router.get(
    "/me",
    authenticate,
    async (req, res, next) => {

        try {

            const result =
                await pool.query(
                    `SELECT
                        id,
                        name,
                        email,
                        address,
                        role
                     FROM users
                     WHERE id=$1`,
                    [req.user.userId]
                );


            if (!result.rows[0]) {

                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });

            }


            res.json({
                success: true,
                user: result.rows[0]
            });


        } catch (error) {

            next(error);

        }

    }
);


/* CHANGE PASSWORD */

router.put(
    "/password",
    authenticate,
    async (req, res, next) => {

        try {

            const data =
                changePasswordSchema.parse(
                    req.body
                );


            const result =
                await pool.query(
                    `SELECT password_hash
                     FROM users
                     WHERE id=$1`,
                    [req.user.userId]
                );


            const valid =
                await comparePassword(
                    data.currentPassword,
                    result.rows[0].password_hash
                );


            if (!valid) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Current password is incorrect"
                });

            }


            const newHash =
                await hashPassword(
                    data.newPassword
                );


            await pool.query(
                `UPDATE users
                 SET password_hash=$1,
                     updated_at=NOW()
                 WHERE id=$2`,
                [
                    newHash,
                    req.user.userId
                ]
            );


            res.json({
                success: true,
                message:
                    "Password updated successfully"
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