// "use server"
// import {prisma} from "@/lib/prisma"
// import type { CreatePlanParamsTypeV2 } from "@/lib/validations"
// import { checkAuth } from "../auth/check-auth"
// import PaystackService from "@/lib/services/paystack.service"


// export async function getPlans() {
//   const plans = await prisma.plan.findMany({
//     where: { active: true },
//     include: { _count: { select: { subscriptions: true } } }
//   })
//   console.log("plans", plans)
//   return plans
// }
// export async function getAdminPlans() {
//   await checkAuth(true)
//   const plans = await prisma.plan.findMany({
//     include: { _count: { select: { subscriptions: true } } }
//   })
//   return plans
// }


// export async function createPlan(params: CreatePlanParamsTypeV2) {
//   try {
//     await checkAuth(true)
//     console.log("Creating plan:", params)
//     const apiCreated = await PaystackService.createPlan({
//       name: params.name,
//       amount: params.amount * 100,
//       interval: params.interval,
//       description: params.description
//     })
//     console.log("apiCreated:", apiCreated)
//     // TODO: multiple currencies
//     const dbCreated = await prisma.plan.create({
//       data: {
//         apiId: String(apiCreated.data.id),
//         code: String(apiCreated.data.plan_code),
//         name: params.name,
//         amount: params.amount,
//         interval: params.interval,
//         description: params.description,
//         active: params.active,
//         features: params.features,
//       }
//     })
//     return dbCreated
//   } catch (error) {
//     console.log("Error creating plan", error)
//     return null
//   }
// }

// export async function updatePlan(id: string, params: Partial<CreatePlanParamsTypeV2>) {
//   await checkAuth(true)
//   console.log("Updating plan:", id, params)

//   try {
//     const plan = await prisma.plan.findUnique({
//       where: { id },
//     })
//     if (!plan) throw new Error("Plan not found")
//     // Placeholder for creating a plan
//     console.log("updating plan:", params)
//     const apiUpdated = await PaystackService.updatePlan(plan?.apiId, {
//       name: params.name,
//       amount: params.amount ? params.amount * 100 : undefined,
//       interval: params.interval,
//       description: params.description
//     })
//     console.log("apiUpdated:", apiUpdated)
//     const dbUpdated = await prisma.plan.update({
//       where: { id },
//       data: {
//         name: params.name,
//         amount: params.amount,
//         interval: params.interval,
//         description: params.description,
//         features: params.features,
//         active: params.active
//       }
//     })
//     console.log("dbUpdated:", dbUpdated)
//     return dbUpdated
//   } catch (error) {
//     console.log("Error updating plan", error)
//     return null
//   }
// }

// export async function deletePlan(apiId: string) {
//   try {
//     await checkAuth(true)
//     // Placeholder for deleting a plan
//     console.log("Deleting plan:", apiId)
//     const result = await PaystackService.deletePlan(apiId)
//     console.log(result)
//     if (result.status) {
//       await prisma.plan.delete({
//         where: { apiId },
//       })
//     }
//     return true
//   } catch (error) {
//     return false
//   }
// }
