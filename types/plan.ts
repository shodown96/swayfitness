import { Plan } from "@prisma/client";

export interface FullPlan extends Plan {
    _count: {
        subscriptions: number;
    };
}