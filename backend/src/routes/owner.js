import express from "express";

import { pool } from "../db/pool.js";

import {
    authenticate,
    authorize
} from "../middleware/auth.js";


const router = express.Router();


router.use(
    authenticate,
    authorize("STORE_OWNER")
);


router.get(
    "/dashboard",
    async (req, res, next) => {

        try {

            const storeResult =
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
                        ) AS "averageRating",

                        COUNT(r.id)::int
                        AS "totalRatings"

                    FROM stores s

                    LEFT JOIN ratings r
                        ON r.store_id=s.id

                    WHERE
                        s.owner_id=$1

                    GROUP BY s.id`,
                    [req.user.userId]
                );


            if (!storeResult.rows[0]) {

                return res.status(404).json({
                    success: false,
                    message:
                        "No store assigned to this owner"
                });

            }


            const store =
                storeResult.rows[0];


            const ratings =
                await pool.query(
                    `SELECT

                        u.id,
                        u.name,
                        u.email,
                        u.address,
                        r.rating,
                        r.updated_at

                    FROM ratings r

                    JOIN users u
                        ON u.id=r.user_id

                    WHERE
                        r.store_id=$1

                    ORDER BY
                        r.updated_at DESC`,
                    [store.id]
                );


            res.json({

                success: true,

                data: {

                    store,

                    ratings:
                        ratings.rows

                }

            });


        } catch (error) {

            next(error);

        }

    }
);


export default router;