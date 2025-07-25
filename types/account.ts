import { Account, Plan, Subscription } from "@prisma/client";

export interface FullAccount extends Account {
  subscription?: Subscription & { plan: Plan } | null
}