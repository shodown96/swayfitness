"use server";

import { prisma } from "@/lib/prisma";
import { CheckAuthResponse } from "@/types/auth";
import { checkTokens } from "@/actions/auth/check-tokens";
import { AccountRole } from "@prisma/client";

export const checkAuth = async (admin = false): Promise<CheckAuthResponse> => {
    // try {
    const decodedToken = await checkTokens()
    if (!decodedToken?.accountId) throw new Error("Couldn't verify token");

    const user = await prisma.account.findUnique({
        where: {
            id: decodedToken.accountId,
            role: admin ? { not: AccountRole.member } : AccountRole.member
        },
        include: { subscription: { include: { plan: true } } },
    });

    if (!user) throw new Error("User not found");

    return { isAuthenticated: true, user: { ...user, password: String(!!user.password) } };
    // } catch (error) {
    //     // console.error("Could not check auth", error);
    //     return { isAuthenticated: false };
    // }
};
