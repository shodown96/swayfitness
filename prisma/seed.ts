import { prisma } from "@/lib/prisma";
import PaystackService from "@/lib/services/paystack.service";
import { PlanInterval, PlanStatus } from "@prisma/client";
import dotenv from "dotenv";
import { SeedingService } from "./seed.service";


dotenv.config();
// Source-of-truth plan definitions.
// The seed enforces that Paystack and the DB match this list exactly.
// Amounts are in naira. Features and category are DB-only fields.
const TARGET_PLANS = [
    {
        name: "Premium Monthly",
        description: "Full access with personal training sessions",
        amount: 25000,
        interval: PlanInterval.monthly,
        features: ["Gym equipment access", "Locker room", "Personal training", "Group classes", "Priority support"],
        category: "Premium",
    },
    {
        name: "Elite Monthly",
        description: "Complete access with premium amenities",
        amount: 35000,
        interval: PlanInterval.monthly,
        features: ["All Premium features", "Sauna access", "Nutrition consultation", "24/7 access", "Guest passes"],
        category: "Elite",
    },
    {
        name: "Basic Annual",
        description: "Annual basic membership with discount",
        amount: 150000,
        interval: PlanInterval.annually,
        features: ["Gym equipment access", "Locker room", "Basic support", "2 months free"],
        category: "Basic",
    },
    {
        name: "Premium Annual",
        description: "Annual premium membership with discount",
        amount: 250000,
        interval: PlanInterval.annually,
        features: ["All Premium Monthly features", "2 months free", "Free merchandise"],
        category: "Premium",
    },
    {
        name: "Elite Annual",
        description: "Annual elite membership with maximum benefits",
        amount: 350000,
        interval: PlanInterval.annually,
        features: ["All Elite Monthly features", "2 months free", "VIP lounge access", "Quarterly health checkup"],
        category: "Elite",
    },
] as const

// Paginated fetch from Paystack
async function fetchAllPaystackPlans(): Promise<any[]> {
    const all: any[] = []
    let page = 1
    const perPage = 50

    while (true) {
        const res = await PaystackService.listPlans({ page, perPage })
        if (!res?.status || !Array.isArray(res.data) || res.data.length === 0) break
        all.push(...res.data)
        const pageCount: number = res.meta?.pageCount ?? 1
        if (page >= pageCount) break
        page++
    }

    return all
}

const runScript = async () => {
    // 1. Fetch all live Paystack plans
    console.log("\n[seed] Fetching plans from Paystack...")
    const allPlans = await fetchAllPaystackPlans()
    const livePlans = allPlans.filter((p) => !p.is_deleted && !p.is_archived)
    console.log(`[seed] ${livePlans.length} active plan(s) found on Paystack`)

    // Build lookup: "amountKobo_interval" -> Paystack plan
    // PlanInterval enum values equal Paystack's interval strings (e.g. "monthly")
    const paystackByKey = new Map<string, any>()
    for (const p of livePlans) {
        const key = `${p.amount}_${p.interval}`
        const existing = paystackByKey.get(key)
        if (!existing || p.id > existing.id) {
            paystackByKey.set(key, p)
        }
    }

    // 2. Reconcile each target plan
    console.log("\n[seed] Reconciling target plans...")
    const matchedCodes = new Set<string>()

    for (const target of TARGET_PLANS) {
        const key = `${target.amount * 100}_${target.interval}`
        const paystackPlan = paystackByKey.get(key)

        if (paystackPlan) {
            // Plan already exists on Paystack, sync DB metadata
            matchedCodes.add(paystackPlan.plan_code)

            await prisma.plan.upsert({
                where: { code: paystackPlan.plan_code },
                update: {
                    name: target.name,
                    description: target.description,
                    amount: target.amount,
                    interval: target.interval,
                    features: [...target.features],
                    category: target.category,
                    apiId: String(paystackPlan.id),
                    status: PlanStatus.active,
                },
                create: {
                    name: target.name,
                    description: target.description,
                    amount: target.amount,
                    interval: target.interval,
                    features: [...target.features],
                    category: target.category,
                    code: paystackPlan.plan_code,
                    apiId: String(paystackPlan.id),
                    status: PlanStatus.active,
                },
            })

            console.log(`[seed] ✓  Synced:   ${target.name.padEnd(20)} ₦${target.amount.toLocaleString().padStart(10)} / ${target.interval}  (${paystackPlan.plan_code})`)

        } else {
            // Plan missing on Paystack, create it
            console.log(`[seed] ✚  Creating: ${target.name} on Paystack...`)

            const created = await PaystackService.createPlan({
                name: target.name,
                description: target.description,
                amount: target.amount,
                interval: target.interval,
            })

            if (!created?.status) {
                console.warn(`[seed] ⚠  Failed to create "${target.name}" on Paystack — skipping`)
                continue
            }

            matchedCodes.add(created.data.plan_code)

            await prisma.plan.upsert({
                where: { code: created.data.plan_code },
                update: {
                    name: target.name,
                    description: target.description,
                    amount: target.amount,
                    interval: target.interval,
                    features: [...target.features],
                    category: target.category,
                    apiId: String(created.data.id),
                    status: PlanStatus.active,
                },
                create: {
                    name: target.name,
                    description: target.description,
                    amount: target.amount,
                    interval: target.interval,
                    features: [...target.features],
                    category: target.category,
                    code: created.data.plan_code,
                    apiId: String(created.data.id),
                    status: PlanStatus.active,
                },
            })

            console.log(`[seed] ✚  Created:  ${target.name.padEnd(20)} ₦${target.amount.toLocaleString().padStart(10)} / ${target.interval}  (${created.data.plan_code})`)
        }
    }

    // 3. Delete unrecognised plans from Paystack
    const unmatched = livePlans.filter((p) => !matchedCodes.has(p.plan_code))

    if (unmatched.length > 0) {
        console.log(`\n[seed] Removing ${unmatched.length} unrecognised Paystack plan(s)...`)
        for (const p of unmatched) {
            try {
                await PaystackService.deletePlan(String(p.id))
                await prisma.plan.updateMany({
                    where: { code: p.plan_code },
                    data: { status: PlanStatus.inactive },
                })
                console.log(`[seed] ✕  Deleted:  ${p.name.padEnd(20)} ₦${(p.amount / 100).toLocaleString().padStart(10)} / ${p.interval}  (${p.plan_code})`)
            } catch (err: any) {
                console.warn(`[seed] ⚠  Could not delete "${p.name}" (${p.plan_code}): ${err?.message ?? err}`)
            }
        }
    }

    // 4. Deactivate any remaining stale DB plans
    if (matchedCodes.size > 0) {
        const deactivated = await prisma.plan.updateMany({
            where: {
                code: { notIn: [...matchedCodes] },
                NOT: { code: null },
                status: PlanStatus.active,
            },
            data: { status: PlanStatus.inactive },
        })
        if (deactivated.count > 0) {
            console.log(`\n[seed] ⚠  Deactivated ${deactivated.count} stale DB plan(s)`)
        }
    }

    // 5. Seed registration_fee setting (never overwrite an existing value)
    await prisma.setting.upsert({
        where: { key: "registration_fee" },
        update: {},
        create: { key: "registration_fee", value: "5000", type: "number" },
    })
    console.log("\n[seed] ✓  registration_fee setting ready")
}

const runScriptv2 = async () => {
    // Seed individual items
    const admin = await SeedingService.seedSuperAdmin({
        email: 'admin@gym.com',
        password: 'admin123',
        name: 'John Admin',
    });
}

runScript()
    .then(() => console.log("\n[seed] Done ✓"))
runScriptv2()
    .then(() => console.log("\n[seed] Done ✓"))
    .catch((err) => {
        console.error("\n[seed] ✗ Seed failed:", err?.message ?? err)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())
