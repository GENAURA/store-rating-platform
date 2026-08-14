import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

export async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}

export function generateToken(user) {
    return jwt.sign(
        {
            userId: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
}