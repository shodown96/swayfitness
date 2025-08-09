"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AdminsService } from "@/lib/services/admins.service"
import { useAdminStore } from "@/lib/stores/adminStore"
import { EditAdminParamsSchema, EditAdminParamsType } from "@/lib/validations"
import { useFormik } from 'formik'
import { Mail, Save, User } from "lucide-react"
import { useEffect } from "react"
import { toast } from "sonner"
import { Input } from "../custom/Input"
import { Select } from "../custom/Select"

export default function EditAdminModal({
    onActionComplete,
}: {
    onActionComplete: () => void
}) {
    const {
        selectedAccount,
        isEditAdminModalOpened,
        setSelectedAccount,
        setIsEditAdminModalOpen
    } = useAdminStore()

    const updateAdmin = async (values: EditAdminParamsType) => {
        if (!selectedAccount) return
        try {
            const data = await AdminsService.update(selectedAccount.id, values)
            if (data.success) {
                toast.success("Successfully updated admin details")
                setSelectedAccount(null)
                onActionComplete()
            }
        } catch (err) {
            console.error("Update failed", err)
        }
    }

    const formik = useFormik<EditAdminParamsType>({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            role: "admin",
            status: "active",
        },
        onSubmit: updateAdmin,
        validateOnBlur: true,
        validationSchema: EditAdminParamsSchema,
        enableReinitialize: true,
    })

    const {
        handleBlur, handleChange, handleSubmit,
        setFieldValue, setValues,
        values, errors, touched, isValid, isSubmitting
    } = formik

    useEffect(() => {
        if (selectedAccount && isEditAdminModalOpened) {
            setValues({
                name: selectedAccount.name,
                email: selectedAccount.email,
                phone: selectedAccount.phone || "",
                role: selectedAccount.role || "",
                status: selectedAccount.status || "",
            })
        }
    }, [selectedAccount, isEditAdminModalOpened])

    return (
        <Dialog open={isEditAdminModalOpened} onOpenChange={setIsEditAdminModalOpen}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Admin</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        id="name"
                        name="name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter full name"
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
                        placeholder="Enter email"
                        value={values.email}
                        error={errors.email}
                        touched={touched.email}
                        leftIcon={Mail}
                        label="Email Address"
                    />

                    <Select
                        name="role"
                        value={values.role}
                        onChange={(value) => setFieldValue("role", value)}
                        onBlur={handleBlur}
                        options={[
                            { value: "admin", label: "Admin" },
                            { value: "superadmin", label: "Super Admin" },
                        ]}
                        error={errors.role}
                        touched={touched.role}
                        label="Role"
                    />

                    <Select
                        name="status"
                        value={values.status}
                        onChange={(value) => setFieldValue("status", value)}
                        onBlur={handleBlur}
                        options={[
                            { value: "active", label: "Active" },
                            { value: "inactive", label: "Inactive" },
                        ]}
                        error={errors.status}
                        touched={touched.status}
                        label="Status"
                    />

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
        </Dialog>
    )
}
