import { prisma } from "@/lib/prisma";
import { Account } from "@prisma/client";
interface SyncLastLoginRequest {
    accountId: string
    lastLogin: Account['lastLogin']
}
export const syncLastLogin = async ({ accountId, lastLogin }: SyncLastLoginRequest) => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    if (!lastLogin || lastLogin < todayStart) {
        await prisma.account.update({
            where: { id: accountId },
            data: { lastLogin: now }
        })
    }
}