import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

let _prisma: PrismaClient;

declare global {
    var _prisma: PrismaClient | undefined;
}

if (process.env.NODE_ENV === "production") {
    _prisma = new PrismaClient();
} else {
    if (!global._prisma) {
        global._prisma = new PrismaClient();
    }
    _prisma = global._prisma;
}

export const isPrismaError = (
    error: any
): error is PrismaClientKnownRequestError =>
    error instanceof PrismaClientKnownRequestError;

export { _prisma as prisma };
