// import "server-only";
import bcrypt from "bcrypt"

export const isPasswordCorrect = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
}

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
}