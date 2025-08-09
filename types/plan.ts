import { Account, Plan, Subscription, Transaction } from "@prisma/client";

export interface FullPlan extends Plan {
    _count: {
        subscriptions: number;
    };
}

export interface FullSubscription extends Subscription {
    account: Account
    plan: Plan
}

export interface FullTransaction extends Transaction {
    account: Account
}