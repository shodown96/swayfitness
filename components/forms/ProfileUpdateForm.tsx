"use client"

import { useFormik } from "formik"
import { User, Mail, Phone, Calendar, Save } from "lucide-react"
import { Input } from "@/components/custom/Input"
import { Select } from "@/components/custom/Select"
import { ProfileUpdateParamsSchema, type ProfileUpdateParamsType } from "@/lib/validations"
import { Button } from "@/components/ui/button"

interface ProfileUpdateFormProps {
  onFormSubmit: (values: ProfileUpdateParamsType) => void
  initialValues: ProfileUpdateParamsType
  isLoading?: boolean
}

export default function ProfileUpdateForm({ onFormSubmit, initialValues, isLoading }: ProfileUpdateFormProps) {
  const formik = useFormik<ProfileUpdateParamsType>({
    initialValues,
    onSubmit: async (values) => {
      onFormSubmit(values)
    },
    validateOnBlur: true,
    validationSchema: ProfileUpdateParamsSchema,
    enableReinitialize: true,
  })

  const { handleBlur, handleChange, handleSubmit, values, errors, touched, isValid, setFieldValue } = formik

  return (
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
        <Button type="submit" disabled={!isValid || isLoading} className="bg-orange-500 hover:bg-orange-600 px-8">
          {isLoading ? (
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
  )
}
