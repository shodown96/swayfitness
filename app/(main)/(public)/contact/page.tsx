"use client"


import { Input } from "@/components/custom/Input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { mainClient } from "@/lib/axios"
import { API_ENDPOINTS } from "@/lib/constants/api"
import { ContactParamsSchema, ContactParamsType } from "@/lib/validations"
import { useFormik } from 'formik'
import { Clock, Mail, MapPin, Phone, Send, User } from "lucide-react"
import { toast } from "sonner"


export default function ContactPage() {
  const submitContactForm = async (values: ContactParamsType) => {
    try {
      const result = await mainClient.post(API_ENDPOINTS.Contact, values)
      if (result.success) {
        toast.success("Thank you for your message! We'll get back to you soon.")
        formik.resetForm()
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.")
    }
  }

  const formik = useFormik<ContactParamsType>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
    onSubmit: submitContactForm,
    validateOnBlur: true,
    validationSchema: ContactParamsSchema,
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

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      details: "123 Fitness Street, Victoria Island, Lagos",
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+234 901 234 5678",
    },
    {
      icon: Mail,
      title: "Email",
      details: "hello@swayfitness.ng",
    },
    {
      icon: Clock,
      title: "Operating Hours",
      details: "Mon-Fri: 5:00 AM - 11:00 PM\nSat-Sun: 6:00 AM - 10:00 PM",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-slate-800 mb-6">Get In Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about our programs or facilities? We're here to help you start your fitness journey.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-8">Contact Information</h2>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="p-6">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <info.icon className="w-6 h-6 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 mb-2">{info.title}</h3>
                        <p className="text-gray-600 whitespace-pre-line">{info.details}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Location Map Placeholder */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-800">Our Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Interactive Map Coming Soon</p>
                    <p className="text-sm text-gray-400 mt-1">123 Fitness Street, Victoria Island, Lagos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-slate-800">Send Us a Message</CardTitle>
                <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="Enter your email address"
                    value={values.email}
                    error={errors.email}
                    touched={touched.email}
                    leftIcon={Mail}
                    label="Email Address"
                  />

                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    value={values.phone}
                    error={errors.phone}
                    touched={touched.phone}
                    leftIcon={Phone}
                    label="Phone Number"
                  />

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={values.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      className={`w-full ${errors.message && touched.message ? 'border-red-500' : ''}`}
                    />
                    {errors.message && touched.message && (
                      <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Additional CTA Section */}
      <section className="py-16 bg-slate-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Visit Us?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Come by for a free tour of our facilities and meet our expert trainers. No appointment necessary!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg">
              Schedule a Tour
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-slate-800 px-8 py-4 text-lg bg-transparent"
            >
              Call Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}