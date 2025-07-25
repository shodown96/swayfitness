"use server";
import { prisma } from "@/lib/prisma";
import { SubscriptionDisabledEventData } from "@/types/paystack";
import { SubscriptionStatus } from "@prisma/client";

export const disableSubscription = async (data: SubscriptionDisabledEventData): Promise<any> => {
    try {
        console.log("disableSubscription", data.amount)
        const user = await prisma.account.findUnique({
            where: { email: data.customer.email },
            include: { subscription: true }
        })
        if (user) {
            const sub = await prisma.subscription.findUnique({
                where: { id: user.subscription?.id }
            })
            if (sub) {
                await prisma.subscription.update({
                    where: { id: user.subscription?.id },
                    data: { status: SubscriptionStatus.cancelled }
                })
                return true
            }
        }
        return false
    } catch (error) {
        console.error("Error disabling subscription", error);
        return false
    }
};
