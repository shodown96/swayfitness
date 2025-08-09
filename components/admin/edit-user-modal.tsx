"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MembersService } from "@/lib/services/members.service"
import { EditUserParamsParamsType, EditUserParamsSchema } from '@/lib/validations'
import { FullAccount } from "@/types/account"
import { useFormik } from 'formik'
import { toast } from "sonner"
import { Input } from "../custom/Input"
import { Calendar, Mail, Phone, Save, User } from "lucide-react"
import { Select } from "../custom/Select"
import { useAdminStore } from "@/lib/stores/adminStore"
import { useEffect } from "react"
import { Gender } from "@prisma/client"

export default function EditUserModal({
    onActionComplete,
}: {
    onActionComplete: (user: FullAccount) => void
}) {

    const {
        selectedAccount,
        isEditUserModalOpened,
        setSelectedAccount,
        setIsEditUserModalOpened
    } = useAdminStore()
    const updateUser = async (values: EditUserParamsParamsType) => {
        if (!selectedAccount) return;
        try {
            const data = await MembersService.updateByAdmin(selectedAccount.id, values)
            if (data.success) {
                toast.success("Successfuly updated member details")
                setSelectedAccount(null)
                onActionComplete(selectedAccount)
            }
        } catch (err) {
            console.error("Suspend failed", err)
        }
    }
    const formik = useFormik<EditUserParamsParamsType>({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            dob: "",
            gender: "male",
            emergencyContactName: "",
            emergencyContactPhone: "",
            emergencyContactRelationship: "",
        },
        onSubmit: updateUser,
        validateOnBlur: true,
        validationSchema: EditUserParamsSchema,
        enableReinitialize: true,
    })

    const {
        handleBlur, handleChange, handleSubmit,
        setFieldValue,
        setValues,
        values, errors, touched, isValid, isSubmitting
    } = formik

    useEffect(() => {
        if (selectedAccount && isEditUserModalOpened) {
            setValues({
                name: selectedAccount.name,
                email: selectedAccount.email,
                phone: String(selectedAccount.phone),
                dob: selectedAccount.dob ? new Date(selectedAccount.dob).toISOString().split("T")[0] : "",
                gender: selectedAccount.gender as Gender,
                emergencyContactName: String(selectedAccount.emergencyContactName),
                emergencyContactPhone: String(selectedAccount.emergencyContactPhone),
                emergencyContactRelationship: String(selectedAccount.emergencyContactRelationship),
            })
        }
    }, [selectedAccount, isEditUserModalOpened])

    return (

        <Dialog open={isEditUserModalOpened} onOpenChange={setIsEditUserModalOpened}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Member Details</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            id="name"
                            name="name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            value={values.name}
                            error={errors.name}
                            touched={touched.name}
                            leftIcon={User}
                            label="Full Name"
                        />

                        <Input
                            id="email"
                            name="email"
                            type="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            value={values.email}
                            error={errors.email}
                            touched={touched.email}
                            leftIcon={Mail}
                            label="Email Address"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <Input
                            id="phone"
                            name="phone"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            value={values.phone}
                            error={errors.phone}
                            touched={touched.phone}
                            leftIcon={Phone}
                            label="Phone Number"
                        />

                        <Input
                            id="dob"
                            name="dob"
                            type="date"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.dob}
                            error={errors.dob}
                            touched={touched.dob}
                            leftIcon={Calendar}
                            label="Date of Birth"
                        />
                    </div>

                    <Select
                        name="gender"
                        value={values.gender}
                        onChange={(value) => setFieldValue("gender", value)}
                        onBlur={handleBlur}
                        options={[
                            { value: "male", label: "Male" },
                            { value: "female", label: "Female" },
                            { value: "prefer-not-to-say", label: "Prefer not to say" },
                        ]}
                        error={errors.gender}
                        touched={touched.gender}
                        label="Gender"
                    />

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Emergency Contact</h3>

                        <div className="grid md:grid-cols-2 gap-4">
                            <Input
                                id="emergencyContactName"
                                name="emergencyContactName"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="Contact name"
                                value={values.emergencyContactName}
                                error={errors.emergencyContactName}
                                touched={touched.emergencyContactName}
                                leftIcon={User}
                                label="Contact Name"
                            />

                            <Input
                                id="emergencyContactPhone"
                                name="emergencyContactPhone"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="Contact phone"
                                value={values.emergencyContactPhone}
                                error={errors.emergencyContactPhone}
                                touched={touched.emergencyContactPhone}
                                leftIcon={Phone}
                                label="Contact Phone"
                            />
                        </div>

                        <Select
                            name="emergencyContactRelationship"
                            value={values.emergencyContactRelationship}
                            onChange={(value) => setFieldValue("emergencyContactRelationship", value)}
                            onBlur={handleBlur}
                            options={[
                                { value: "spouse", label: "Spouse" },
                                { value: "parent", label: "Parent" },
                                { value: "sibling", label: "Sibling" },
                                { value: "friend", label: "Friend" },
                                { value: "other", label: "Other" },
                            ]}
                            error={errors.emergencyContactRelationship}
                            touched={touched.emergencyContactRelationship}
                            label="Relationship"
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={!isValid || isSubmitting} className="bg-blue-600 hover:bg-blue-700 px-8">
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog >
    )
}
