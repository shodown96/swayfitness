import { PrismaClient } from "@prisma/client";
import fs from "fs/promises";

const prisma = new PrismaClient();

export async function exportAllData(outputPath: string) {
  const [accounts, plans, subscriptions, transactions, notes] = await Promise.all([
    prisma.account.findMany(),
    prisma.plan.findMany(),
    prisma.subscription.findMany(),
    prisma.transaction.findMany(),
    prisma.accountNote.findMany(),
  ]);

  const data = { accounts, plans, subscriptions, transactions, notes };

  await fs.writeFile(outputPath, JSON.stringify(data, null, 2), "utf-8");

  console.log(`Exported ${accounts.length} accounts, ${plans.length} plans, ${subscriptions.length} subscriptions, ${transactions.length} transactions, ${notes.length} notes to ${outputPath}`);
  return data;
}

export async function importAllData(inputPath: string) {
  const raw = await fs.readFile(inputPath, "utf-8");
  const { accounts, plans, subscriptions, transactions, notes } = JSON.parse(raw);

  await prisma.$transaction(async (tx) => {
    // 1. Plans first — no dependencies
    for (const { createdAt, updatedAt, ...rest } of plans) {
      await tx.plan.upsert({
        where: { id: rest.id },
        update: {},
        create: {
          ...rest,
          createdAt: new Date(createdAt),
          updatedAt: new Date(updatedAt),
        },
      });
    }

    // 2. Accounts — no dependencies
    for (const { createdAt, updatedAt, lastVisit, lastLogin, dob, ...rest } of accounts) {
      await tx.account.upsert({
        where: { id: rest.id },
        update: {},
        create: {
          ...rest,
          createdAt: new Date(createdAt),
          updatedAt: new Date(updatedAt),
          ...(lastVisit && { lastVisit: new Date(lastVisit) }),
          ...(lastLogin && { lastLogin: new Date(lastLogin) }),
          ...(dob && { dob: new Date(dob) }),
        },
      });
    }

    // 3. Subscriptions — depends on Account + Plan
    for (const { createdAt, updatedAt, startDate, endDate, nextBillingDate, cancellationDate, ...rest } of subscriptions) {
      await tx.subscription.upsert({
        where: { id: rest.id },
        update: {},
        create: {
          ...rest,
          createdAt: new Date(createdAt),
          updatedAt: new Date(updatedAt),
          startDate: new Date(startDate),
          ...(endDate && { endDate: new Date(endDate) }),
          ...(nextBillingDate && { nextBillingDate: new Date(nextBillingDate) }),
          ...(cancellationDate && { cancellationDate: new Date(cancellationDate) }),
        },
      });
    }

    // 4. Transactions — depends on Account + Subscription
    for (const { createdAt, updatedAt, refundDate, ...rest } of transactions) {
      await tx.transaction.upsert({
        where: { id: rest.id },
        update: {},
        create: {
          ...rest,
          createdAt: new Date(createdAt),
          updatedAt: new Date(updatedAt),
          ...(refundDate && { refundDate: new Date(refundDate) }),
        },
      });
    }

    // 5. Account notes — depends on Account
    for (const { createdAt, ...rest } of notes) {
      await tx.accountNote.upsert({
        where: { id: rest.id },
        update: {},
        create: {
          ...rest,
          createdAt: new Date(createdAt),
        },
      });
    }
  });

  console.log(`Imported ${accounts.length} accounts, ${plans.length} plans, ${subscriptions.length} subscriptions, ${transactions.length} transactions, ${notes.length} notes`);
}

exportAllData("data.json")