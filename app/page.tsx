import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, Utensils, Heart, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"

export default function HomePage() {
  const pillars = [
    {
      icon: TrendingUp,
      title: "Progression",
      description: "Every small step leads to massive transformation",
    },
    {
      icon: Users,
      title: "Expert Training",
      description: "Professional guidance to maximize your results",
    },
    {
      icon: Utensils,
      title: "Nutrition Support",
      description: "Fuel your body for the results you want",
    },
    {
      icon: Heart,
      title: "Community",
      description: "Train alongside motivated individuals who inspire greatness",
    },
  ]

  const programs = [
    {
      name: "Cardio Strength",
      instructor: "Sarah Johnson",
      specialty: "Cardio Specialist",
      description: "High-intensity cardio workouts designed to boost endurance and burn calories effectively.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Weight Training",
      instructor: "Mike Chen",
      specialty: "Strength Coach",
      description: "Build lean muscle mass and increase strength with progressive weight training programs.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Pilates",
      instructor: "Lisa Rodriguez",
      specialty: "Pilates Expert",
      description: "Improve flexibility, core strength, and body awareness through controlled movements.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Yoga",
      instructor: "David Park",
      specialty: "Yoga Instructor",
      description: "Find balance and inner peace while building strength and flexibility through yoga practice.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Self Defense",
      instructor: "Emma Thompson",
      specialty: "Self Defense Coach",
      description: "Learn practical self-defense techniques while building confidence and physical fitness.",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      name: "Body Conditioning",
      instructor: "Alex Morgan",
      specialty: "Conditioning Trainer",
      description: "Total body conditioning workouts to improve overall fitness and athletic performance.",
      image: "/placeholder.svg?height=200&width=200",
    },
  ]

  const trainers = [
    {
      name: "Sarah Johnson",
      title: "Head Trainer",
      experience: "8 years experience",
      specializations: ["Strength Training", "HIIT", "Nutrition"],
      quote: "Every rep counts towards your transformation",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Mike Chen",
      title: "Strength Coach",
      experience: "6 years experience",
      specializations: ["Powerlifting", "Bodybuilding", "Form Correction"],
      quote: "Perfect form leads to perfect results",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Lisa Rodriguez",
      title: "Wellness Expert",
      experience: "5 years experience",
      specializations: ["Pilates", "Flexibility", "Rehabilitation"],
      quote: "Wellness is a journey, not a destination",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "David Park",
      title: "Mind-Body Coach",
      experience: "7 years experience",
      specializations: ["Yoga", "Meditation", "Stress Relief"],
      quote: "Find your inner strength through mindful movement",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Emma Thompson",
      title: "Defense Instructor",
      experience: "4 years experience",
      specializations: ["Self Defense", "Boxing", "Cardio Kickboxing"],
      quote: "Confidence comes from knowing you can protect yourself",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Alex Morgan",
      title: "Performance Coach",
      experience: "9 years experience",
      specializations: ["Athletic Training", "Conditioning", "Sports Performance"],
      quote: "Push your limits, exceed your expectations",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  const facilities = [
    {
      title: "Modern Cardio Equipment",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Weight Training Section",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Group Class Studio",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Locker Room Facilities",
      image: "/placeholder.svg?height=300&width=400",
    },
  ]

  const testimonials = [
    {
      name: "Jennifer A.",
      quote: "Joining this gym changed my entire approach to fitness. The trainers are incredible!",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Marcus T.",
      quote: "Best investment I've made in my health. The community here is so supportive.",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Priya S.",
      quote: "Finally found a gym that understands my fitness goals. Highly recommend!",
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  return (
    <div className="min-h-screen">
      <Navigation/>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-slate-800 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
          }}
        />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Transform Your Body, Elevate Your Lifestyle
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Join our premium fitness community and discover what your body is truly capable of
          </p>
          <Link href="/join">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Why Choose SwayFitness</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Four pillars that make us the premier choice for your fitness journey
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pillars.map((pillar, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <pillar.icon className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">{pillar.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Training Programs Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Training Programs</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expert-led programs designed to help you achieve your fitness goals
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative">
                  <Image
                    src={program.image || "/placeholder.svg"}
                    alt={program.instructor}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{program.name}</h3>
                  <p className="text-orange-500 font-semibold mb-2">{program.instructor}</p>
                  <p className="text-sm text-gray-500 mb-3">{program.specialty}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{program.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Expert Trainers Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Meet Our Expert Trainers</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our certified professionals are here to guide you every step of your fitness journey
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trainers.map((trainer, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative">
                  <Image src={trainer.image || "/placeholder.svg"} alt={trainer.name} fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{trainer.name}</h3>
                  <p className="text-orange-500 font-semibold mb-2">{trainer.title}</p>
                  <p className="text-sm text-gray-500 mb-3">{trainer.experience}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {trainer.specializations.map((spec, specIndex) => (
                      <span key={specIndex} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm italic leading-relaxed">"{trainer.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Gallery */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Our Facilities</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              State-of-the-art equipment and spaces designed for your success
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {facilities.map((facility, index) => (
              <div key={index} className="relative aspect-video overflow-hidden rounded-lg group">
                <Image
                  src={facility.image || "/placeholder.svg"}
                  alt={facility.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                  <h3 className="text-white text-xl font-bold p-6">{facility.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Member Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-800 mb-4">What Our Members Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from real people who transformed their lives with us
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 text-center">
                <CardContent className="p-0">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center justify-center space-x-3">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <p className="font-semibold text-slate-800">{testimonial.name}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ready to Start Section */}
      <section className="py-16 bg-slate-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join Our Fitness Family?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Take the first step towards a healthier, stronger you. Choose the plan that fits your lifestyle.
          </p>
          <Link href="/plans">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg">
              View Our Plans
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
