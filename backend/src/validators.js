import { z } from "zod";


const passwordSchema =
    z.string()
        .min(8, "Password must contain at least 8 characters")
        .max(16, "Password must not exceed 16 characters")
        .regex(
            /[A-Z]/,
            "Password must contain at least one uppercase letter"
        )
        .regex(
            /[^A-Za-z0-9]/,
            "Password must contain at least one special character"
        );


export const registerSchema = z.object({

    name:
        z.string()
        .trim()
        .min(20, "Name must contain at least 20 characters")
        .max(60, "Name cannot exceed 60 characters"),

    email:
        z.string()
        .email("Invalid email address"),

    address:
        z.string()
        .trim()
        .min(1)
        .max(400),

    password:
        passwordSchema
});


export const loginSchema = z.object({

    email:
        z.string()
        .email(),

    password:
        z.string()
        .min(1)
});


export const createUserSchema =
    registerSchema.extend({

        role:
            z.enum([
                "ADMIN",
                "USER",
                "STORE_OWNER"
            ])

    });


export const createStoreSchema =
    z.object({

        name:
            z.string()
            .min(1)
            .max(255),

        email:
            z.string()
            .email(),

        address:
            z.string()
            .max(400),

        ownerId:
            z.number()
            .int()
            .positive()
            .nullable()
            .optional()

    });


export const ratingSchema =
    z.object({

        rating:
            z.number()
            .int()
            .min(1)
            .max(5)

    });


export const changePasswordSchema =
    z.object({

        currentPassword:
            z.string()
            .min(1),

        newPassword:
            passwordSchema

    });