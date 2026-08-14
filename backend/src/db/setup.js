import fs from "fs";
import path from "path";

import {
    fileURLToPath
} from "url";

import bcrypt from "bcryptjs";

import { pool } from "./pool.js";


const __filename =
    fileURLToPath(import.meta.url);

const __dirname =
    path.dirname(__filename);


async function setup() {

    try {

        const schema =
            fs.readFileSync(
                path.join(
                    __dirname,
                    "schema.sql"
                ),
                "utf8"
            );


        await pool.query(schema);


        const adminPassword =
            await bcrypt.hash(
                "Admin@123",
                10
            );


        const userPassword =
            await bcrypt.hash(
                "User@123",
                10
            );


        const ownerPassword =
            await bcrypt.hash(
                "Owner@123",
                10
            );


        await pool.query(
            `INSERT INTO users
            (
                name,
                email,
                password_hash,
                address,
                role
            )

            VALUES
            (
                $1,$2,$3,$4,'ADMIN'
            )

            ON CONFLICT(email)
            DO NOTHING`,
            [
                "System Administrator Account",
                "admin@example.com",
                adminPassword,
                "Admin Office, Ranchi"
            ]
        );


        await pool.query(
            `INSERT INTO users
            (
                name,
                email,
                password_hash,
                address,
                role
            )

            VALUES
            (
                $1,$2,$3,$4,'USER'
            )

            ON CONFLICT(email)
            DO NOTHING`,
            [
                "Normal User Demo Account",
                "user@example.com",
                userPassword,
                "Main Road, Ranchi"
            ]
        );


        await pool.query(
            `INSERT INTO users
            (
                name,
                email,
                password_hash,
                address,
                role
            )

            VALUES
            (
                $1,$2,$3,$4,'STORE_OWNER'
            )

            ON CONFLICT(email)
            DO NOTHING`,
            [
                "Store Owner Demo Account",
                "owner@example.com",
                ownerPassword,
                "Lalpur, Ranchi"
            ]
        );


        const owner =
            await pool.query(
                `SELECT id
                 FROM users
                 WHERE email='owner@example.com'`
            );


        if (owner.rows[0]) {

            await pool.query(
                `INSERT INTO stores
                (
                    name,
                    email,
                    address,
                    owner_id
                )

                VALUES
                (
                    $1,$2,$3,$4
                )

                ON CONFLICT(owner_id)
                DO NOTHING`,
                [
                    "Ranchi Central Store",
                    "store@example.com",
                    "Main Road, Ranchi",
                    owner.rows[0].id
                ]
            );

        }


        const stores = [

            [
                "City Mart",
                "city@example.com",
                "Kanke Road, Ranchi"
            ],

            [
                "Fresh Basket",
                "fresh@example.com",
                "Lalpur, Ranchi"
            ],

            [
                "Smart Bazaar",
                "smart@example.com",
                "Harmu, Ranchi"
            ]

        ];


        for (
            const store of stores
        ) {

            await pool.query(
                `INSERT INTO stores
                (
                    name,
                    email,
                    address
                )

                VALUES
                ($1,$2,$3)`,
                store
            );

        }


        console.log(
            "Database setup completed successfully."
        );


    } catch (error) {

        console.error(error);

    } finally {

        await pool.end();

    }

}


setup();