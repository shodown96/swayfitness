"use client"

import { useFormik } from "formik"
import { useState } from "react"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { Input } from "@/components/custom/Input"
import { Select } from "@/components/custom/Select"
import { Textarea } from "@/components/custom/Textarea"
import { CreatePlanParamsSchema, type CreatePlanParamsType } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface CreatePlanFormProps {
  onFormSubmit: (values: CreatePlanParamsType) => void
  initialValues?: Partial<CreatePlanParamsType>
  isLoading?: boolean
  submitButtonText?: string
}

export default function CreatePlanForm({
  onFormSubmit,
  initialValues,
  isLoading,
  submitButtonText = "Create Plan",
}: CreatePlanFormProps) {
  const [features, setFeatures] = useState<string[]>(initialValues?.features || [""])

  const formik = useFormik<CreatePlanParamsType>({
    initialValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      price: initialValues?.price || 0,
      interval: initialValues?.interval || "monthly",
      features: initialValues?.features || [],
      status: initialValues?.status || "active",
    },
    onSubmit: async (values) => {
      const cleanFeatures = features.filter((f) => f.trim() !== "")
      onFormSubmit({ ...values, features: cleanFeatures })
    },
    validateOnBlur: true,
    validationSchema: CreatePlanParamsSchema,
  })

  const addFeature = () => {
    setFeatures([...features, ""])
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setFeatures(newFeatures)
  }

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          name="name"
          placeholder="e.g., Premium Monthly"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.name}
          touched={formik.touched.name}
          label="Plan Name *"
        />

        <Input
          name="price"
          type="number"
          placeholder="25000"
          value={formik.values.price.toString()}
          onChange={(e) => formik.setFieldValue("price", Number(e.target.value))}
          onBlur={formik.handleBlur}
          error={formik.errors.price}
          touched={formik.touched.price}
          label="Price (₦) *"
        />
      </div>

      <Textarea
        name="description"
        placeholder="Describe the plan benefits..."
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.errors.description}
        touched={formik.touched.description}
        label="Description *"
        rows={3}
      />

      <div className="grid md:grid-cols-2 gap-4">
        <Select
          name="interval"
          value={formik.values.interval}
          onChange={(value) => formik.setFieldValue("interval", value)}
          onBlur={formik.handleBlur}
          options={[
            { value: "monthly", label: "Monthly" },
            { value: "annual", label: "Annual" },
          ]}
          error={formik.errors.interval}
          touched={formik.touched.interval}
          label="Billing Interval *"
        />

        <div className="flex items-center space-x-2 pt-6">
          <Switch
            checked={formik.values.status === "active"}
            onCheckedChange={(checked) => formik.setFieldValue("status", checked ? "active" : "inactive")}
          />
          <Label>Active Plan</Label>
        </div>
      </div>

      {/* Features Management */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">Plan Features *</Label>
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                placeholder="Enter feature..."
                containerClass="flex-1"
              />
              {features.length > 1 && (
                <Button type="button" variant="outline" size="icon" onClick={() => removeFeature(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addFeature} className="w-full bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Add Feature
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!formik.isValid || isLoading || features.filter((f) => f.trim()).length === 0}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {submitButtonText.includes("Create") ? "Creating..." : "Updating..."}
          </>
        ) : (
          submitButtonText
        )}
      </Button>
    </form>
  )
}
