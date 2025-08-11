import { z } from "zod"
import { toFormikValidationSchema } from "zod-formik-adapter"
import { VALIDATION_MESSAGES } from "./constants/messages"
import { formatString } from "./utils"
import { AccountRole, AccountStatus, Gender, PlanInterval } from "@prisma/client"

// Auth Validations
const SignInParams = z.object({
  email: z
    .string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Email") })
    .email({ message: VALIDATION_MESSAGES.EmailInvalid }),
  password: z.string({
    required_error: formatString(VALIDATION_MESSAGES.Required, "Password"),
  }),
})

const AdminLoginParams = z.object({
  email: z
    .string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Email") })
    .email({ message: VALIDATION_MESSAGES.EmailInvalid }),
  password: z.string({
    required_error: formatString(VALIDATION_MESSAGES.Required, "Password"),
  }),
})

const MemberRegistrationParams = z
  .object({
    name: z
      .string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Full Name") })
      .min(2, { message: VALIDATION_MESSAGES.NameMin }),
    email: z
      .string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Email") })
      .email({ message: VALIDATION_MESSAGES.EmailInvalid }),
    phone: z
      .string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Phone") })
      .min(10, { message: VALIDATION_MESSAGES.PhoneInvalid }),
    dob: z.string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Date of Birth") }),
    startDate: z.string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Start Date") }),
    gender: z.string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Gender") }),
    password: z
      .string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Password") })
      .min(8, { message: VALIDATION_MESSAGES.PasswordMin }),
    confirmPassword: z.string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Confirm Password") }),
    emergencyContactName: z.string({
      required_error: formatString(VALIDATION_MESSAGES.Required, "Emergency Contact Name"),
    }),
    emergencyContactPhone: z.string({
      required_error: formatString(VALIDATION_MESSAGES.Required, "Emergency Contact Phone"),
    }),
    emergencyContactRelationship: z.string({
      required_error: formatString(VALIDATION_MESSAGES.Required, "Relationship"),
    }),
    planId: z.string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Plan") }),
    medicalConditions: z.string().optional(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.PasswordMismatch,
    path: ["confirmPassword"],
  })


// Admin Validations
const CreateMemberParams = z.object({
  name: z
    .string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Full Name") })
    .min(2, { message: VALIDATION_MESSAGES.NameMin }),
  email: z
    .string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Email") })
    .email({ message: VALIDATION_MESSAGES.EmailInvalid }),
  phone: z.string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Phone") }),
  planId: z.string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Plan") }),
  dob: z.string({
    required_error: formatString(VALIDATION_MESSAGES.Required, "Date of Birth"),
  }),
  gender: z.string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Gender") }),
  emergencyContactName: z.string({
    required_error: formatString(VALIDATION_MESSAGES.Required, "Emergency Contact Name"),
  }),
  emergencyContactPhone: z.string({
    required_error: formatString(VALIDATION_MESSAGES.Required, "Emergency Contact Phone"),
  }),
  emergencyContactRelationship: z.string({
    required_error: formatString(VALIDATION_MESSAGES.Required, "Relationship"),
  }),
})

const CreatePlanParams = z.object({
  name: z
    .string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Plan Name") })
    .min(2, { message: VALIDATION_MESSAGES.NameMin }),
  description: z.string({
    required_error: formatString(VALIDATION_MESSAGES.Required, "Description"),
  }),
  amount: z
    .number({ required_error: formatString(VALIDATION_MESSAGES.Required, "Price") })
    .min(1, { message: VALIDATION_MESSAGES.PriceMin }),
  interval: z.enum(["monthly", "annual"], {
    required_error: formatString(VALIDATION_MESSAGES.Required, "Billing Interval"),
  }),
  features: z.array(z.string()).min(1, { message: VALIDATION_MESSAGES.FeaturesMin }),
  status: z.enum(["active", "inactive"]),
})

const ProfileUpdateParams = z.object({
  name: z
    .string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Full Name") })
    .min(2, { message: VALIDATION_MESSAGES.NameMin }),
  email: z
    .string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Email") })
    .email({ message: VALIDATION_MESSAGES.EmailInvalid }),
  phone: z.string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Phone") }),
  address: z.string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Address") }),
  dob: z.string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Date of Birth") }),
  gender: z.string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Gender") }),
  emergencyContactName: z.string({
    required_error: formatString(VALIDATION_MESSAGES.Required, "Emergency Contact Name"),
  }),
  emergencyContactPhone: z.string({
    required_error: formatString(VALIDATION_MESSAGES.Required, "Emergency Contact Phone"),
  }),
  emergencyContactRelationship: z.string({
    required_error: formatString(VALIDATION_MESSAGES.Required, "Relationship"),
  }),
})

const EditUserParams = z.object({
  name: z
    .string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Full Name") })
    .min(2, { message: VALIDATION_MESSAGES.NameMin }),
  email: z
    .string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Email") })
    .email({ message: VALIDATION_MESSAGES.EmailInvalid }),
  phone: z.string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Phone") }),
  address: z.string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Address") }),
  dob: z.string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Date of Birth") }),
  gender: z.string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Gender") }),
  emergencyContactName: z.string({
    required_error: formatString(VALIDATION_MESSAGES.Required, "Emergency Contact Name"),
  }),
  emergencyContactPhone: z.string({
    required_error: formatString(VALIDATION_MESSAGES.Required, "Emergency Contact Phone"),
  }),
  emergencyContactRelationship: z.string({
    required_error: formatString(VALIDATION_MESSAGES.Required, "Relationship"),
  }),
})


const SendNotificationParams = z.object({
  title: z.string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Title") }),
  message: z.string({ required_error: formatString(VALIDATION_MESSAGES.Required, "Message") })
})

const CreatePlanParamsV2 = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string(),
  amount: z.number().min(0, "Price must be positive"),
  interval: z.enum(["monthly", "yearly"]),
  features: z.array(z.string()).optional(),
  active: z.boolean().default(true),
})

const EditAdminParams = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Role is required"),
  role: z.string().min(1, "Role is required"),
  status: z.string().min(1, "Status is required"),
})

const InviteAdminParams = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Role is required"),
  role: z.string().min(1, "Role is required"),
})


// Zod validation schemas
const AdminProfileParams = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string()
    .email("Invalid email address")
    .min(1, "Email is required"),
  phone: z.string()
    .min(1, "Phone is required"),
})

const PasswordParams = z.object({
  currentPassword: z.string()
    .min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number"),
  confirmPassword: z.string()
    .min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
})

const ContactParams = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .min(1, 'Name is required'),
  email: z.string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  phone: z.string()
    .regex(/^[\+]?[0-9\s\-\(\)]*$/, 'Invalid phone number format')
    .min(10, 'Phone number must be at least 10 digits')
    .optional()
    .or(z.literal('')),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .min(1, 'Message is required'),
})

const RefundFormParams = z.object({
  reason: z.string().min(1, 'Refund reason is required'),
  customReason: z.string().optional(),
  amount: z.number()
  // amount: z.string()
  //   .min(1, 'Refund amount is required')
  //   .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Must be a valid amount'),
})


// Export schemas and types
export const SignInParamsSchema = toFormikValidationSchema(SignInParams)
export const AdminLoginParamsSchema = toFormikValidationSchema(AdminLoginParams)
export const MemberRegistrationParamsSchema = toFormikValidationSchema(MemberRegistrationParams)
export const CreatePlanParamsSchema = toFormikValidationSchema(CreatePlanParams)
export const CreateMemberParamsSchema = toFormikValidationSchema(CreateMemberParams)
export const ProfileUpdateParamsSchema = toFormikValidationSchema(ProfileUpdateParams)
export const EditUserParamsSchema = toFormikValidationSchema(EditUserParams)
export const CreatePlanParamsSchemaV2 = toFormikValidationSchema(CreatePlanParamsV2)
export const SendNotificationParamsSchema = toFormikValidationSchema(SendNotificationParams)
export const EditAdminParamsSchema = toFormikValidationSchema(EditAdminParams)
export const InviteAdminParamsSchema = toFormikValidationSchema(InviteAdminParams)
export const AdminProfileParamsSchema = toFormikValidationSchema(AdminProfileParams)
export const PasswordParamsSchema = toFormikValidationSchema(PasswordParams)
export const ContactParamsSchema = toFormikValidationSchema(ContactParams)
export const RefundFormParamsSchema = toFormikValidationSchema(RefundFormParams)

export type CreatePlanParamsTypeV2 = z.infer<typeof CreatePlanParamsV2> & {
  interval: PlanInterval
}
export type SignInParamsType = z.infer<typeof SignInParams>
export type AdminLoginParamsType = z.infer<typeof AdminLoginParams>
export type MemberRegistrationParamsType = z.infer<typeof MemberRegistrationParams> & {
  gender: Gender
}
export type CreatePlanParamsType = z.infer<typeof CreatePlanParams>
export type CreateMemberParamsType = z.infer<typeof CreateMemberParams>
export type ProfileUpdateParamsType = z.infer<typeof ProfileUpdateParams> & {
  gender: Gender
}
export type EditUserParamsParamsType = z.infer<typeof EditUserParams> & {
  gender: Gender
}
export type SendNotificationParamsType = z.infer<typeof SendNotificationParams>
export type EditAdminParamsType = z.infer<typeof EditAdminParams> & {
  status: AccountStatus,
  role: AccountRole
}
export type InviteAdminParamsType = z.infer<typeof InviteAdminParams> & {
  role: AccountRole
}

export type AdminProfileParamsType = z.infer<typeof AdminProfileParams>
export type PasswordParamsType = z.infer<typeof PasswordParams>
export type ContactParamsType = z.infer<typeof ContactParams>
export type RefundFormParamsType = z.infer<typeof RefundFormParams>