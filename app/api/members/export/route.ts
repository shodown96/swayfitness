// app/api/admin/users/export/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { checkAuth } from "@/actions/auth/check-auth"
import { z } from "zod"

// Validation schema for export parameters
const ExportSchema = z.object({
    format: z.enum(['csv', 'excel']).default('csv'),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    status: z.enum(['active', 'inactive', 'suspended', 'all']).default('all'),
    includeSubscription: z.boolean().default(false),
    fields: z.array(z.string()).optional(), // Specific fields to export
})

export async function GET(request: NextRequest) {
    try {
        // Auth check
        const { user } = await checkAuth(true)
        if (user?.role !== 'superadmin' && user?.role !== 'admin') {
            return NextResponse.json(
                { error: "Unauthorized access" },
                { status: 401 }
            )
        }

        // Parse query parameters
        const { searchParams } = new URL(request.url)
        const params = {
            format: searchParams.get('format') || 'csv',
            dateFrom: searchParams.get('dateFrom') || undefined,
            dateTo: searchParams.get('dateTo') || undefined,
            status: searchParams.get('status') || 'all',
            includeSubscriptions: searchParams.get('includeSubscriptions') === 'true',
            fields: searchParams.get('fields')?.split(',') || undefined,
        }

        const validation = ExportSchema.safeParse(params)
        if (!validation.success) {
            return NextResponse.json(
                { error: "Invalid parameters", details: validation.error.errors },
                { status: 400 }
            )
        }

        const { format, dateFrom, dateTo, status, includeSubscription = true, fields } = validation.data

        // Build where clause
        const where: any = {}

        if (dateFrom || dateTo) {
            where.createdAt = {}
            if (dateFrom) where.createdAt.gte = new Date(dateFrom)
            if (dateTo) where.createdAt.lte = new Date(dateTo)
        }

        if (status !== 'all') {
            where.status = status
        }

        // Fetch users with optional subscription data
        const users = await prisma.account.findMany({
            where,
            include: {
                subscription: includeSubscription ? {
                    include: { plan: true },
                } : false,
                _count: {
                    select: {
                        transactions: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        // Define available fields
        const availableFields: any = {
            id: 'User ID',
            name: 'Full Name',
            email: 'Email Address',
            phone: 'Phone Number',
            dateOfBirth: 'Date of Birth',
            gender: 'Gender',
            address: 'Address',
            status: 'Account Status',
            emergencyContactName: 'Emergency Contact Name',
            emergencyContactPhone: 'Emergency Contact Phone',
            emergencyContactRelationship: 'Emergency Contact Relationship',
            currentPlan: 'Current Plan',
            subscriptionStatus: 'Subscription Status',
            joinDate: 'Join Date',
            lastUpdated: 'Last Updated'
        }

        // Determine which fields to include
        const fieldsToExport = fields || Object.keys(availableFields)
        const headers = fieldsToExport.map(field => availableFields[field] || field)

        // Transform data for export
        const exportData = users.map(user => {
            const currentSubscription: any = user.subscription

            const userData: any = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                dateOfBirth: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
                gender: user.gender || '',
                address: user.address || '',
                status: user.status || 'active',
                emergencyContactName: user.emergencyContactName || '',
                emergencyContactPhone: user.emergencyContactPhone || '',
                emergencyContactRelationship: user.emergencyContactRelationship || '',
                currentPlan: currentSubscription?.plan?.name || 'No Plan',
                subscriptionStatus: currentSubscription?.status || 'No Subscription',
                joinDate: new Date(user.createdAt).toISOString().split('T')[0],
                lastUpdated: new Date(user.updatedAt).toISOString().split('T')[0]
            }

            // Return only requested fields
            return fieldsToExport.reduce((obj, field) => {
                obj[field] = userData[field] || ''
                return obj
            }, {} as any)
        })

        if (format === 'csv') {
            // Generate CSV
            const csvContent = generateCSV(headers, exportData, fieldsToExport)

            const fileName = `users-export-${new Date().toISOString().split('T')[0]}.csv`

            return new NextResponse(csvContent, {
                status: 200,
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': `attachment; filename="${fileName}"`,
                },
            })
        } else {
            // For Excel format, you'd use a library like 'xlsx'
            return NextResponse.json(
                { error: "Excel format not implemented yet" },
                { status: 501 }
            )
        }

    } catch (error) {
        console.error("CSV export error:", error)
        return NextResponse.json(
            { error: "Failed to export users" },
            { status: 500 }
        )
    }
}

function generateCSV(headers: string[], data: any[], fields: string[]): string {
    // Create CSV header row
    const csvHeaders = headers.join(',')

    // Create CSV data rows
    const csvRows = data.map(row => {
        return fields.map(field => {
            const value = row[field]?.toString() || ''
            // Escape commas and quotes in CSV
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                return `"${value.replace(/"/g, '""')}"`
            }
            return value
        }).join(',')
    })

    return [csvHeaders, ...csvRows].join('\n')
}