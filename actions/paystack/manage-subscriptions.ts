"use server";
import PaystackService from "@/lib/services/paystack.service";
import { checkAuth } from "../auth/check-auth";
import { prisma } from "@/lib/prisma";

export const getManageLink = async (): Promise<string | null> => {
    try {
        const { user } = await checkAuth()
        if (!user || !user.subscription) throw new Error("Couldn't find user subscription")
        let subscriptionCode = user.subscription.subscriptionCode
        const planApiId = user.subscription.plan.apiId as string
        const customerId = user.subscription.customerId
        if (!subscriptionCode) {

            const fetchedSubs = await PaystackService.fetchSubscriptionByPlanCodeNCustomer(planApiId, Number(customerId))
            const sub = fetchedSubs.data?.[0]
            if (sub?.id) {
                await prisma.subscription.update({
                    where: { id: user.subscription.id },
                    data: {
                        subscriptionCode: sub.subscription_code,
                        emailToken: sub.email_token,
                        nextBillingDate: new Date(sub.next_payment_date.replace(" ", "T")),
                    }
                })
                subscriptionCode = sub.subscription_code
            } else {
                throw new Error("Couldn't get link")
            }
        }
        const result = await PaystackService.generateManageLink(subscriptionCode)
        return result.data.link
    } catch (error) {
        console.error("Error Getting manage subscription link", error);
        return null
    }
};
