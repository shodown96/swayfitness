"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { SendNotificationParamsSchema, SendNotificationParamsType } from "@/lib/validations";
import { useFormik } from "formik";
import { Input } from "../custom/Input";
import { Textarea } from "../custom/Textarea";
import { Button } from "../ui/button";
import { mainClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api";
import { toast } from "sonner";
import { ERROR_MESSAGES } from "@/lib/constants/messages";

export function SendNotificationDialog({
    open,
    setOpen
}: {
    open: boolean,
    setOpen: (open: boolean) => void
}) {


    const handleSend = async (values: SendNotificationParamsType) => {
        try {
            const result = await mainClient.post(API_ENDPOINTS.Admins.SendNotification, values)
            toast.success(result.message || ERROR_MESSAGES.UnexpectedError)
        } catch (error) {

        }
    };


    const formik = useFormik<SendNotificationParamsType>({
        initialValues: {
            title: "",
            message: "",
        },
        onSubmit: handleSend,
        validateOnBlur: true,
        validationSchema: SendNotificationParamsSchema,
    })


    const {
        handleBlur,
        handleChange,
        handleSubmit,
        values,
        errors,
        touched,
        isValid,
        isSubmitting
    } = formik

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Send Notification to Members</DialogTitle>
                    <DialogDescription>
                        Write a title and message to notify all gym members.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-2">
                    <Input
                        id="title"
                        label="Title"
                        placeholder="Enter your title"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.title}
                        error={errors.title}
                        touched={touched.title}
                    />
                    <Textarea
                        id="message"
                        label="Message"
                        placeholder="Enter your message"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.message}
                        error={errors.message}
                        touched={touched.message}
                    />
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => setOpen(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleSubmit()}
                        disabled={!isValid || isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700">
                        {isSubmitting ? "Sending..." : "Send"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
