"use server";
import {prisma} from "@/lib/prisma";
import { SubscriptionCreatedData } from "@/types/paystack";

export const syncCreatedSubscription = async (data: SubscriptionCreatedData): Promise<any> => {
    // TODO: Check this later (webhooks)
    try {
        console.log("syncCreatedSubscription", data.plan)
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
                    data: {
                        subscriptionCode: data.subscription_code,
                        nextBillingDate: new Date(data.next_payment_date.replace(" ", "T")),
                    }
                })
                return true
            }
        }
        return false
    } catch (error) {
        console.error("Error syncing subscription", error);
        return false
    }
};
