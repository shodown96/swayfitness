"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AdminsService } from "@/lib/services/admins.service"
import { useAdminStore } from "@/lib/stores/adminStore"
import { InviteAdminParamsSchema, InviteAdminParamsType } from "@/lib/validations"
import { useFormik } from "formik"
import { Mail, Phone, User } from 'lucide-react'
import { toast } from "sonner"
import { Input } from "../custom/Input"
import { Select } from "../custom/Select"

export default function InviteAdminModal({ onActionComplete }: {
    onActionComplete: () => Promise<void>
}) {
    const { isInviteModalOpen, setIsInviteModalOpen } = useAdminStore()
    const inviteAdmin = async (values: InviteAdminParamsType) => {
        try {
            const result = await AdminsService.invite(values)
            if (result.success) {
                formik.resetForm()
                setIsInviteModalOpen(false)
                toast.success(result.message)
                onActionComplete()
            }
        } catch (err) {
            alert("Failed to invite admin")
            console.error(err)
        }
    }
    const formik = useFormik<InviteAdminParamsType>({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            role: "admin",
        },
        onSubmit: inviteAdmin,
        validateOnBlur: true,
        validationSchema: InviteAdminParamsSchema,
        enableReinitialize: true,
    })

    const {
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        setValues,
        values,
        errors, touched,
        isValid,
        isSubmitting
    } = formik
    return (
        <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite New Administrator</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
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
                    <Input
                        id="phone"
                        name="phone"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter phone"
                        value={values.phone}
                        error={errors.phone}
                        touched={touched.phone}
                        leftIcon={Phone}
                        label="Phone Number"
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
                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            disabled={!isValid || isSubmitting}
                            onClick={() => handleSubmit()}>
                            <Mail className="w-4 h-4 mr-2" />
                            {isSubmitting ? 'Sending' : 'Send Invitation'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
