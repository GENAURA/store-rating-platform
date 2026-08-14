import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import storeRoutes from "./routes/stores.js";
import ownerRoutes from "./routes/owner.js";

import {
    errorHandler
} from "./middleware/error.js";


dotenv.config();


const app = express();


app.use(
    cors({
        origin:
            process.env.CLIENT_URL
            || "http://localhost:5173"
    })
);


app.use(
    express.json()
);


/* HEALTH */

app.get(
    "/api/health",
    (req, res) => {

        res.json({

            success: true,

            message:
                "Store Rating API is running"

        });

    }
);


/* ROUTES */

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);

app.use(
    "/api/stores",
    storeRoutes
);

app.use(
    "/api/owner",
    ownerRoutes
);


/* ERROR */

app.use(
    errorHandler
);


const PORT =
    process.env.PORT || 5000;


app.listen(
    PORT,
    () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

    }
);