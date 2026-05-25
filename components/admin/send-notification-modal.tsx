"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SendNotificationParamsSchema, SendNotificationParamsType } from "@/lib/validations";
import { useFormik } from "formik";
import { Input } from "../custom/Input";
import { Textarea } from "../custom/Textarea";
import { Button } from "../ui/button";
import { mainClient } from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api";
import { toast } from "sonner";
import { CheckCircle, Send, Users } from "lucide-react";
import { useState } from "react";

const TARGET_OPTIONS = [
  {
    value: "all",
    label: "All active members",
    description: "Everyone with an active account",
  },
  {
    value: "active",
    label: "Members with active subscriptions",
    description: "Currently paying, subscribed members",
  },
  {
    value: "inactive",
    label: "Members with lapsed subscriptions",
    description: "Cancelled, expired, or suspended subscriptions",
  },
] as const;

interface SendResult {
  sent: number;
  failed: number;
  total: number;
}

export function SendNotificationDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [result, setResult] = useState<SendResult | null>(null);

  const handleSend = async (values: SendNotificationParamsType) => {
    try {
      const response = await mainClient.post<SendResult>(
        API_ENDPOINTS.Admins.SendNotification,
        values,
      );
      if (response.success && response.data) {
        setResult(response.data);
        toast.success(response.message || "Notification sent successfully");
      } else {
        toast.error(response.message || "Failed to send notification");
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const formik = useFormik<SendNotificationParamsType>({
    initialValues: {
      title: "",
      message: "",
      target: "all",
    },
    onSubmit: handleSend,
    validateOnBlur: true,
    validationSchema: SendNotificationParamsSchema,
  });

  const {
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    resetForm,
  } = formik;

  const handleClose = () => {
    setOpen(false);
    // Reset after the dialog finishes closing
    setTimeout(() => {
      resetForm();
      setResult(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-orange-500" />
            Send Mass Notification
          </DialogTitle>
          <DialogDescription>
            Send an email to a group of members. Emails are delivered via Brevo.
          </DialogDescription>
        </DialogHeader>

        {/* Success summary */}
        {result ? (
          <div className="py-4 space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
            </div>
            <h3 className="text-center text-lg font-semibold text-slate-800">
              Notification sent!
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-green-700">{result.sent}</p>
                <p className="text-xs text-green-600 mt-0.5">Delivered</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-slate-700">{result.total}</p>
                <p className="text-xs text-gray-500 mt-0.5">Total</p>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-red-600">{result.failed}</p>
                <p className="text-xs text-red-500 mt-0.5">Failed</p>
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" onClick={handleClose}>
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : (
          /* Form */
          <>
            <div className="flex flex-col gap-4 py-2">
              {/* Audience target */}
              <div className="space-y-1.5">
                <Label className="text-sm font-medium flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gray-400" />
                  Audience
                </Label>
                <Select
                  value={values.target}
                  onValueChange={(val) => setFieldValue("target", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {TARGET_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div>
                          <p className="font-medium text-sm">{opt.label}</p>
                          <p className="text-xs text-gray-400">{opt.description}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <Input
                id="title"
                label="Subject / Title"
                placeholder="e.g. Holiday schedule change"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.title}
                error={errors.title}
                touched={touched.title}
              />

              {/* Message */}
              <Textarea
                id="message"
                label="Message"
                placeholder="Write your message here. Use plain text — line breaks are preserved."
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.message}
                error={errors.message}
                touched={touched.message}
              />

              {/* Character hint */}
              <p className="text-xs text-gray-400 -mt-2">
                {values.message.length} characters
              </p>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleSubmit()}
                disabled={!isValid || isSubmitting}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Sending…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Notification
                  </span>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
