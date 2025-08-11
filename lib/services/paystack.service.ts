import {
    ChargedAuthorizationResponse,
    CreatedPaystackPlanSuccessResponse,
    CreatedPaystackSubscription,
    CreateRefundResponse,
    GetRefundResponse,
    GetSubscriptionResponse,
    PaystackCustomer,
    PaystackPlan,
    PaystackSubscription,
    PaystackTransaction,
    PaystackVerifiedTransaction,
    PaystackWebhookEvent,
    PlanDeletedResponse,
    SubscriptionLinkResponse,
    SubscriptionsResponse,
    UpdatedPlanResponse,
    UpdatedSubscriptionResponse
} from '@/types/paystack';
import { PlanInterval, Subscription } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';
import { addMonths, addYears, parseISO } from "date-fns";
import { ERROR_MESSAGES } from '../constants/messages';

export class PaystackService {
    static axiosInstance = axios.create({
        baseURL: 'https://api.paystack.co',
        headers: {
            'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
    });
    static publicKey = "config.publicKey;;"

    // ============================================================================
    // CUSTOMER MANAGEMENT
    // ============================================================================

    static async createCustomer(customerData: PaystackCustomer): Promise<any> {
        try {
            const response: AxiosResponse = await this.axiosInstance.post('/customer', customerData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getCustomer(customerCode: string): Promise<any> {
        try {
            const response: AxiosResponse = await this.axiosInstance.get(`/customer/${customerCode}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async updateCustomer(customerCode: string, updateData: Partial<PaystackCustomer>): Promise<any> {
        try {
            const response: AxiosResponse = await this.axiosInstance.put(`/customer/${customerCode}`, updateData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }


    static async chargeAuthorization({ email, amount, authorizationCode }: { email: string, amount: number, authorizationCode: string }): Promise<ChargedAuthorizationResponse> {
        try {
            const response: AxiosResponse = await this.axiosInstance.post(`/transaction/charge_authorization`, {
                email,
                amount,
                authorization_code: authorizationCode
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // ============================================================================
    // PLAN MANAGEMENT
    // ============================================================================

    static async createPlan(planData: PaystackPlan): Promise<CreatedPaystackPlanSuccessResponse> {
        try {
            const response: AxiosResponse = await this.axiosInstance.post('/plan', {
                ...planData,
                amount: planData.amount * 100, // Convert to kobo
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getPlan(planCode: string): Promise<any> {
        try {
            const response: AxiosResponse = await this.axiosInstance.get(`/plan/${planCode}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async updatePlan(idOrCode: string, updateData: Partial<PaystackPlan>): Promise<UpdatedPlanResponse> {
        try {
            const updatePayload = { ...updateData };
            if (updatePayload.amount) {
                updatePayload.amount = updatePayload.amount * 100; // Convert to kobo
            }

            const response: AxiosResponse = await this.axiosInstance.put(`/plan/${idOrCode}`, updatePayload);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async listPlans(params?: { page?: number; perPage?: number }): Promise<any> {
        try {
            const response: AxiosResponse = await this.axiosInstance.get('/plan', { params });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async deletePlan(planId: string): Promise<PlanDeletedResponse> {
        try {
            const response = await this.axiosInstance.delete(`/plan/${planId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || "Failed to delete plan");
        }
    }

    // ============================================================================
    // TRANSACTION MANAGEMENT
    // ============================================================================

    static async initializeTransaction(transactionData: PaystackTransaction): Promise<any> {
        try {
            const response: AxiosResponse = await this.axiosInstance.post('/transaction/initialize', {
                ...transactionData,
                amount: transactionData.amount * 100, // Convert to kobo
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async verifyTransaction(reference: string): Promise<PaystackVerifiedTransaction> {
        try {
            const response: AxiosResponse = await this.axiosInstance.get(`/transaction/verify/${reference}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getTransaction(transactionId: string): Promise<any> {
        try {
            const response: AxiosResponse = await this.axiosInstance.get(`/transaction/${transactionId}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async listTransactions(params?: {
        page?: number;
        perPage?: number;
        customer?: string;
        status?: string;
        from?: string;
        to?: string;
        amount?: number;
    }): Promise<any> {
        try {
            const response: AxiosResponse = await this.axiosInstance.get('/transaction', { params });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // ============================================================================
    // SUBSCRIPTION MANAGEMENT
    // ============================================================================

    static async createSubscription(subscriptionData: PaystackSubscription): Promise<CreatedPaystackSubscription> {
        try {
            const response: AxiosResponse = await this.axiosInstance.post('/subscription', subscriptionData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getSubscription(subscriptionCode: string): Promise<GetSubscriptionResponse> {
        try {
            const response: AxiosResponse = await this.axiosInstance.get(`/subscription/${subscriptionCode}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async disableSubscription(subscriptionCode: string, emailToken: string): Promise<UpdatedSubscriptionResponse> {
        try {
            const response: AxiosResponse = await this.axiosInstance.post('/subscription/disable', {
                code: subscriptionCode,
                token: emailToken,
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async enableSubscription(subscriptionCode: string, emailToken: string): Promise<UpdatedSubscriptionResponse> {
        try {
            const response: AxiosResponse = await this.axiosInstance.post('/subscription/enable', {
                code: subscriptionCode,
                token: emailToken,
            });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async updateSubscription(subscription: Subscription, planCode: string): Promise<CreatedPaystackSubscription|null> {
        try {
            if (subscription.subscriptionCode) {
                const sub = await this.getSubscription(subscription.subscriptionCode)
                if (sub.status) {
                    const result = await this.disableSubscription(subscription.subscriptionCode, sub.data.email_token)
                    if (result.status) {
                        const res = await this.createSubscription({
                            customer: sub.data.customer.customer_code,
                            plan: planCode,
                            authorization: sub.data.authorization.authorization_code,
                            start_date: sub.data.next_payment_date,
                        })
                        return res
                    }
                }
            }
            return null
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async generateManageLink(subscriptionCode: string): Promise<SubscriptionLinkResponse> {
        try {
            const response = await this.axiosInstance.get(`/subscription/${subscriptionCode}/manage/link`);
            return response.data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || "Error generating subscription link");
        }
    }

    static async fetchSubscriptionByPlanCodeNCustomer(planApiId: string, customer: string | number): Promise<SubscriptionsResponse> {
        try {
            const response = await this.axiosInstance.get(`/subscription?customer=${Number(customer)}&plan=${2630204}`);

            console.log(`/subscription?customer=${Number(customer)}&plan=${planApiId}`, response.data)
            return response.data;
        } catch (error: any) {
            console.log(error.response.request.path)
            console.log(error.response.data)
            throw new Error(error?.response?.data?.message || "Error fetching subscription");
        }
    }


    // ============================================================================
    // REFUND MANAGEMENT
    // ============================================================================

    static async createRefund(transactionReference: string, amount?: number, merchantNote?: string): Promise<CreateRefundResponse> {
        try {
            const refundData: any = {
                transaction: transactionReference,
            };

            if (amount) {
                refundData.amount = amount * 100; // Convert to kobo
            }

            if (merchantNote) {
                refundData.merchant_note = merchantNote;
            }

            const response: AxiosResponse = await this.axiosInstance.post('/refund', refundData);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    static async getRefund(refundReference: string): Promise<GetRefundResponse> {
        try {
            const response: AxiosResponse = await this.axiosInstance.get(`/refund/${refundReference}`);
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    // ============================================================================
    // WEBHOOK UTILITIES
    // ============================================================================

    validateWebhook(payload: string, signature: string, secret: string): boolean {
        const crypto = require('crypto');
        const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(payload), 'utf-8').digest('hex');
        return hash === signature;
    }

    handleWebhook(event: PaystackWebhookEvent): { shouldProcess: boolean; data: any } {
        const processableEvents = [
            'charge.success',
            'charge.failed',
            'subscription.create',
            'subscription.disable',
            'invoice.create',
            'invoice.update',
            'invoice.payment_failed',
        ];

        return {
            shouldProcess: processableEvents.includes(event.event),
            data: event.data,
        };
    }

    // ============================================================================
    // UTILITY METHODS
    // ============================================================================

    // Convert from kobo to naira
    static koboToNaira(amountInKobo: number): number {
        return amountInKobo / 100;
    }

    // Convert from naira to kobo
    static nairaToKobo(amountInNaira: number): number {
        return amountInNaira * 100;
    }

    // Generate unique reference
    static generateReference(prefix: string = 'GYM'): string {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        return `${prefix}_${timestamp}_${randomString}`.toUpperCase();
    }

    static getNextBillingDate(
        startDate: string | Date,
        billingCycle: PlanInterval
    ): Date {
        const date = typeof startDate === "string" ? parseISO(startDate) : startDate

        if (billingCycle === "monthly") {
            return addMonths(date, 1)
        }

        if (billingCycle === "annually") {
            return addYears(date, 1)
        }

        throw new Error("Invalid billing cycle")
    }

    // Handle Paystack errors
    private static handleError(error: any): Error {
        if (error.response) {
            const { status, data } = error.response;
            return new Error(`Paystack API Error (${status}): ${data.message || 'Unknown error'}`);
        } else if (error.request) {
            return new Error('Network error: Unable to reach Paystack API');
        } else {
            return new Error(`Request error: ${error.message}`);
        }
    }
}

export default PaystackService;


// // Step 1: Collect combined payment
// const firstPayment = await paystack.transaction.initialize({
//   amount: (planAmount + registrationFee) * 100,
//   email: user.email,
//   metadata: { type: 'initial_payment' }
// });

// // Step 2: Create subscription for recurring payments (plan amount only)
// const subscription = await paystack.subscription.create({
//   customer: customerCode,
//   plan: planCode, // This plan only contains the monthly amount
//   start_date: nextMonth // Start next month
// });

// fetchSubscriptionByPlanCodeNCustomer
// generateManageLink
// createPlan
// updatePlan
// deletePlan
// verifyTransaction
// getNextBillingDate
// chargeAuthorization