import PaystackService from '@/lib/services/paystack.service';
import { faker } from '@faker-js/faker';
import {
    AccountRole,
    AccountStatus,
    Gender,
    PlanInterval,
    PlanStatus,
    PrismaClient,
    SubscriptionStatus,
    TransactionStatus,
    TransactionType
} from '@prisma/client';
import bcrypt from "bcrypt";

export const isPasswordCorrect = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
}

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
}

export class SeedingService {
    private static prisma = new PrismaClient();

    // ============================================================================
    // ACCOUNT SEEDING
    // ============================================================================

    static async seedAccount(data: {
        email: string;
        password: string;
        name: string;
        phone?: string;
        role?: AccountRole;
        status?: AccountStatus;
        gender?: Gender;
        dob?: Date;
        address?: string;
        memberId?: string;
        emergencyContactName?: string;
        emergencyContactPhone?: string;
        emergencyContactRelationship?: string;
        medicalConditions?: string;
    }) {
        const hashedPassword = await hashPassword(data.password);

        return await SeedingService.prisma.account.create({
            data: {
                ...data,
                password: hashedPassword,
                role: data.role || AccountRole.member,
                status: data.status || AccountStatus.active,
                memberId: data.role === AccountRole.member ? data.memberId || SeedingService.generateMemberId() : null,
            }
        });
    }

    static async seedMember(data: {
        email: string;
        password: string;
        name: string;
        phone: string;
        gender: Gender;
        dob: Date;
        address?: string;
        emergencyContactName?: string;
        emergencyContactPhone?: string;
        emergencyContactRelationship?: string;
        medicalConditions?: string;
    }) {
        return await SeedingService.seedAccount({
            ...data,
            role: AccountRole.member,
            memberId: SeedingService.generateMemberId(),
        });
    }

    static async seedAdmin(data: {
        email: string;
        password: string;
        name: string;
        phone?: string;
        permissions?: string[];
    }) {
        const hashedPassword = await hashPassword(data.password);

        return await SeedingService.prisma.account.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                phone: data.phone,
                role: AccountRole.admin,
                status: AccountStatus.active,
                permissions: data.permissions || ['read_members', 'edit_members', 'read_transactions'],
                lastLogin: new Date(),
            }
        });
    }

    static async seedSuperAdmin(data: {
        email: string;
        password: string;
        name: string;
        phone?: string;
    }) {
        const hashedPassword = await hashPassword(data.password);

        return await SeedingService.prisma.account.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                phone: data.phone,
                role: AccountRole.superadmin,
                status: AccountStatus.active,
                permissions: ['*'], // All permissions
                lastLogin: new Date(),
            }
        });
    }

    static async inviteAdmin(data: {
        email: string;
        name: string;
        phone?: string;
        permissions?: string[];
        invitedBy: string; // Admin ID who sent the invite
    }) {
        // Generate temporary password
        const tempPassword = SeedingService.generateTempPassword();
        const hashedPassword = await hashPassword(tempPassword);

        const admin = await SeedingService.prisma.account.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                phone: data.phone,
                role: AccountRole.admin,
                status: AccountStatus.inactive, // Will be activated when they accept invite
                permissions: data.permissions || ['read_members'],
            }
        });

        // TODO: Send email invitation with temp password
        console.log(`Admin invitation sent to ${data.email} with temp password: ${tempPassword}`);

        return { admin, tempPassword };
    }

    // ============================================================================
    // PLAN SEEDING
    // ============================================================================

    static async seedPlan(data: {
        name: string;
        description: string;
        amount: number;
        interval: PlanInterval;
        features: string[];
        status?: PlanStatus;
        category?: string;
        code?: string;
        apiId?: string
    }) {
        return await SeedingService.prisma.plan.create({
            data: {
                ...data,
                status: data.status || PlanStatus.active,
                code: data.code || SeedingService.generatePlanCode(data.name),
            }
        });
    }

    static async seedBasicPlans() {
        const plans = [
            // {
            //     name: 'Basic Monthly',
            //     description: 'Access to gym equipment and basic facilities',
            //     amount: 10000,
            //     code: 'PLN_jc9cguop9t0cwej',
            //     interval: PlanInterval.monthly,
            //     features: ['Gym equipment access', 'Locker room', 'Basic support'],
            //     category: 'Basic',
            //     status: PlanStatus.active,
            //     apiId: '2630204'
            // },
            {
                name: 'Premium Monthly',
                description: 'Full access with personal training sessions',
                amount: 25000,
                interval: PlanInterval.monthly,
                features: ['Gym equipment access', 'Locker room', 'Personal training', 'Group classes', 'Priority support'],
                category: 'Premium',
                status: PlanStatus.inactive
            },
            {
                name: 'Elite Monthly',
                description: 'Complete access with premium amenities',
                amount: 35000,
                interval: PlanInterval.monthly,
                features: ['All Premium features', 'Sauna access', 'Nutrition consultation', '24/7 access', 'Guest passes'],
                category: 'Elite',
                status: PlanStatus.inactive
            },
            {
                name: 'Basic Annual',
                description: 'Annual basic membership with discount',
                amount: 150000,
                interval: PlanInterval.annually,
                features: ['Gym equipment access', 'Locker room', 'Basic support', '2 months free'],
                category: 'Basic',
                status: PlanStatus.inactive
            },
            {
                name: 'Premium Annual',
                description: 'Annual premium membership with discount',
                amount: 250000,
                interval: PlanInterval.annually,
                features: ['All Premium Monthly features', '2 months free', 'Free merchandise'],
                category: 'Premium',
                status: PlanStatus.inactive
            },
            {
                name: 'Elite Annual',
                description: 'Annual elite membership with maximum benefits',
                amount: 350000,
                interval: PlanInterval.annually,
                features: ['All Elite Monthly features', '2 months free', 'VIP lounge access', 'Quarterly health checkup'],
                category: 'Elite',
                status: PlanStatus.inactive
            }
        ];

        const createdPlans = [];
        for (const plan of plans) {
            const apiCreated = await PaystackService.createPlan({
                name: plan.name,
                amount: plan.amount,
                interval: plan.interval,
                description: plan.description,
            })
            if (apiCreated.status) {
                const created = await SeedingService.seedPlan({
                    ...plan,
                    apiId: String(apiCreated.data.id),
                    code: apiCreated.data.plan_code
                });
                createdPlans.push(created);
            }
        }

        return createdPlans;
    }

    // ============================================================================
    // SUBSCRIPTION SEEDING
    // ============================================================================

    static async seedSubscription(data: {
        accountId: string;
        planId: string;
        status?: SubscriptionStatus;
        startDate?: Date;
        endDate?: Date;
        nextBillingDate?: Date;
        amount: number;
        subscriptionCode?: string;
        customerCode?: string;
        discountApplied?: number;
    }) {
        const startDate = data.startDate || new Date();
        const plan = await SeedingService.prisma.plan.findUnique({ where: { id: data.planId } });

        if (!plan) throw new Error('Plan not found');

        // Calculate end date based on plan interval
        const endDate = data.endDate || SeedingService.calculateEndDate(startDate, plan.interval);
        const nextBillingDate = data.nextBillingDate || SeedingService.calculateNextBilling(startDate, plan.interval);

        return await SeedingService.prisma.subscription.create({
            data: {
                accountId: data.accountId,
                planId: data.planId,
                status: data.status || SubscriptionStatus.active,
                startDate,
                endDate,
                nextBillingDate,
                amount: data.amount,
                subscriptionCode: data.subscriptionCode || SeedingService.generateSubscriptionCode(),
                customerCode: data.customerCode || SeedingService.generateCustomerCode(),
                discountApplied: data.discountApplied || 0,
            }
        });
    }

    static async seedActiveSubscription(accountId: string, planId: string) {
        const plan = await SeedingService.prisma.plan.findUnique({ where: { id: planId } });
        if (!plan) throw new Error('Plan not found');

        return await SeedingService.seedSubscription({
            accountId,
            planId,
            status: SubscriptionStatus.active,
            amount: Number(plan.amount),
        });
    }

    // ============================================================================
    // TRANSACTION SEEDING
    // ============================================================================

    static async seedTransaction(data: {
        accountId: string;
        subscriptionId?: string;
        amount: number;
        totalAmount?: number;
        status?: TransactionStatus;
        type: TransactionType;
        description: string;
        reference?: string;
        apiId?: string;
        gateway?: string;
        refundReason?: string
        refundDate?: Date
    }) {
        return await SeedingService.prisma.transaction.create({
            data: {
                ...data,
                status: data.status || TransactionStatus.pending,
                reference: data.reference || SeedingService.generateTransactionReference(),
                gateway: data.gateway || 'paystack',
                totalAmount: data.totalAmount || data.amount,
            }
        });
    }

    static async seedRegistrationTransaction(data: {
        accountId: string;
        subscriptionId: string;
        planAmount: number;
        registrationFee: number;
        reference?: string;
    }) {
        const totalAmount = data.planAmount + data.registrationFee;

        return await SeedingService.seedTransaction({
            accountId: data.accountId,
            subscriptionId: data.subscriptionId,
            amount: data.planAmount,
            totalAmount,
            type: TransactionType.registration,
            description: `Registration fee + First month subscription`,
            status: TransactionStatus.success,
            reference: data.reference,
        });
    }

    static async seedSubscriptionTransaction(data: {
        accountId: string;
        subscriptionId: string;
        amount: number;
        reference?: string;
    }) {
        return await SeedingService.seedTransaction({
            accountId: data.accountId,
            subscriptionId: data.subscriptionId,
            amount: data.amount,
            type: TransactionType.subscription,
            description: 'Monthly subscription payment',
            status: TransactionStatus.success,
            reference: data.reference,
        });
    }

    static async seedRefundTransaction(data: {
        accountId: string;
        originalTransactionId: string;
        amount: number;
        reason: string;
    }) {
        return await SeedingService.seedTransaction({
            accountId: data.accountId,
            amount: -Math.abs(data.amount), // Negative amount for refund
            type: TransactionType.refund,
            description: `Refund: ${data.reason}`,
            status: TransactionStatus.success,
            refundReason: data.reason,
            refundDate: new Date(),
        });
    }

    // ============================================================================
    // ACCOUNT NOTES SEEDING
    // ============================================================================

    static async seedAccountNote(data: {
        accountId: string;
        content: string;
        createdBy: string;
    }) {
        return await SeedingService.prisma.accountNote.create({
            data
        });
    }

    static async seedMemberNotes(memberId: string, adminId: string) {
        const notes = [
            'Member joined through online registration',
            'Completed gym orientation successfully',
            'Regular attendance, very committed',
            'Requested nutrition consultation'
        ];

        const createdNotes = [];
        for (const content of notes) {
            const note = await SeedingService.seedAccountNote({
                accountId: memberId,
                content,
                createdBy: adminId,
            });
            createdNotes.push(note);
        }

        return createdNotes;
    }

    // ============================================================================
    // SETTINGS SEEDING
    // ============================================================================

    static async seedSetting(key: string, value: string, type: string = 'string') {
        return await SeedingService.prisma.setting.upsert({
            where: { key },
            update: { value, type },
            create: { key, value, type }
        });
    }

    static async seedDefaultSettings() {
        const settings = [
            { key: 'gym_name', value: 'Elite Fitness Center', type: 'string' },
            { key: 'gym_email', value: 'info@elitefitness.com', type: 'string' },
            { key: 'gym_phone', value: '+234-800-123-4567', type: 'string' },
            { key: 'gym_address', value: '123 Fitness Street, Lagos, Nigeria', type: 'string' },
            { key: 'registration_fee', value: '7500', type: 'number' },
            { key: 'currency', value: 'NGN', type: 'string' },
            { key: 'timezone', value: 'Africa/Lagos', type: 'string' },
            { key: 'tax_rate', value: '0', type: 'number' },
            { key: 'paystack_public_key', value: 'pk_test_xxxxxx', type: 'string' },
            { key: 'paystack_secret_key', value: 'sk_test_xxxxxx', type: 'string' },
            { key: 'email_notifications_enabled', value: 'true', type: 'boolean' },
            { key: 'sms_notifications_enabled', value: 'true', type: 'boolean' },
        ];

        const createdSettings = [];
        for (const setting of settings) {
            const created = await SeedingService.seedSetting(setting.key, setting.value, setting.type);
            createdSettings.push(created);
        }

        return createdSettings;
    }

    // ============================================================================
    // BULK SEEDING METHODS
    // ============================================================================

    static async seedFakeMembers(count: number = 50) {
        const members = [];

        for (let i = 0; i < count; i++) {
            const member = await SeedingService.seedMember({
                email: faker.internet.email(),
                password: 'password123',
                name: faker.person.fullName(),
                phone: faker.phone.number(),
                gender: faker.helpers.arrayElement([Gender.male, Gender.female, Gender.other]),
                dob: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
                address: faker.location.streetAddress(),
                emergencyContactName: faker.person.fullName(),
                emergencyContactPhone: faker.phone.number(),
                emergencyContactRelationship: faker.helpers.arrayElement(['Spouse', 'Parent', 'Sibling', 'Friend']),
                medicalConditions: faker.helpers.maybe(() => 'Hypertension', { probability: 0.2 }),
            });

            members.push(member);
        }

        return members;
    }

    static async seedCompleteMemberWithSubscription(memberData: {
        email: string;
        password: string;
        name: string;
        phone: string;
        planId: string;
    }) {
        // Create member
        const member = await SeedingService.seedMember({
            ...memberData,
            gender: Gender.male,
            dob: new Date('1990-01-01'),
        });

        // Create subscription
        const subscription = await SeedingService.seedActiveSubscription(member.id, memberData.planId);

        // Create registration transaction
        const plan = await SeedingService.prisma.plan.findUnique({ where: { id: memberData.planId } });
        if (plan) {
            await SeedingService.seedRegistrationTransaction({
                accountId: member.id,
                subscriptionId: subscription.id,
                planAmount: Number(plan.amount),
                registrationFee: Number(process.env.NEXT_PUBLIC_REGISTRATION_FEE),
            });
        }

        return { member, subscription };
    }

    // ============================================================================
    // UTILITY METHODS
    // ============================================================================

    private static generateMemberId(): string {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();
        return `GYM${timestamp}${random}`;
    }

    private static generatePlanCode(name: string): string {
        const sanitized = name.replace(/\s+/g, '_').toUpperCase();
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();
        return `${sanitized}_${random}`;
    }

    private static generateSubscriptionCode(): string {
        return `SUB_${Date.now()}_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    }

    private static generateCustomerCode(): string {
        return `CUS_${Date.now()}_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    }

    private static generateTransactionReference(): string {
        return `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    }

    private static generateTempPassword(): string {
        return Math.random().toString(36).substring(2, 12);
    }

    private static calculateEndDate(startDate: Date, interval: PlanInterval): Date {
        const endDate = new Date(startDate);
        if (interval === PlanInterval.monthly) {
            endDate.setMonth(endDate.getMonth() + 1);
        } else {
            endDate.setFullYear(endDate.getFullYear() + 1);
        }
        return endDate;
    }

    private static calculateNextBilling(startDate: Date, interval: PlanInterval): Date {
        return SeedingService.calculateEndDate(startDate, interval);
    }

    // ============================================================================
    // MASTER SEEDING METHOD
    // ============================================================================

    static async seedAll() {
        console.log('🌱 Starting database seeding...');

        try {
            // 1. Seed settings
            console.log('📋 Seeding settings...');
            await SeedingService.seedDefaultSettings();

            // 2. Seed plans
            console.log('💳 Seeding membership plans...');
            const plans = await SeedingService.seedBasicPlans();

            // 3. Seed super admin
            console.log('👑 Seeding super admin...');
            const superAdmin = await SeedingService.seedSuperAdmin({
                email: 'superadmin@gym.com',
                password: 'superadmin123',
                name: 'Super Administrator',
                phone: '+234-800-000-0001',
            });

            // 4. Seed regular admin
            console.log('👨‍💼 Seeding admin...');
            const admin = await SeedingService.seedAdmin({
                email: 'admin@gym.com',
                password: 'admin123',
                name: 'Gym Administrator',
                phone: '+234-800-000-0002',
            });

            // 5. Seed fake members with subscriptions
            console.log('👥 Seeding members...');
            const members = await SeedingService.seedFakeMembers(25);

            // Create subscriptions for some members
            for (let i = 0; i < 15; i++) {
                const member = members[i];
                const randomPlan = faker.helpers.arrayElement(plans);

                await SeedingService.seedCompleteMemberWithSubscription({
                    email: member.email,
                    password: 'password123',
                    name: member.name,
                    phone: member.phone || '',
                    planId: randomPlan.id,
                });
            }

            // 6. Seed some notes
            console.log('📝 Seeding member notes...');
            for (let i = 0; i < 5; i++) {
                await SeedingService.seedMemberNotes(members[i].id, admin.id);
            }

            console.log('✅ Database seeding completed successfully!');

            return {
                superAdmin,
                admin,
                plans,
                membersCount: members.length,
            };

        } catch (error) {
            console.error('❌ Error seeding database:', error);
            throw error;
        }
    }

    // ============================================================================
    // CLEANUP METHOD
    // ============================================================================

    static async cleanup() {
        console.log('🧹 Cleaning up database...');

        try {
            // Delete in reverse order of dependencies
            await SeedingService.prisma.accountNote.deleteMany();
            await SeedingService.prisma.transaction.deleteMany();
            await SeedingService.prisma.subscription.deleteMany();
            await SeedingService.prisma.plan.deleteMany();
            await SeedingService.prisma.account.deleteMany();
            await SeedingService.prisma.setting.deleteMany();

            console.log('✅ Database cleanup completed!');
        } catch (error) {
            console.error('❌ Error cleaning database:', error);
            throw error;
        }
    }

    static async disconnect() {
        await SeedingService.prisma.$disconnect();
    }
}


// for (const account of accounts) {
//     await prisma.account.create({
//         data: {
//             ...account as any,
//             lastLogin: null,
//             dob: account.dob ? new Date(account.dob) : null,
//             createdAt: new Date(account.createdAt),
//             updatedAt: new Date(account.updatedAt)
//         }
//     })
// } for (const subscription of subscriptions) {
//     await prisma.subscription.create({
//         data: {
//             ...subscription as any,
//             startDate: new Date(subscription.startDate),
//             nextBillingDate: new Date(subscription.nextBillingDate),
//             createdAt: new Date(subscription.createdAt),
//             updatedAt: new Date(subscription.updatedAt)
//         }
//     })
// }
// for (const transaction of transactions) {
//     await prisma.transaction.create({
//         data: {
//             ...transaction as any,
//             createdAt: new Date(transaction.createdAt),
//             updatedAt: new Date(transaction.updatedAt)
//         }
//     })
// }