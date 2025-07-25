"use client"

import { Button } from "@/components/ui/button"
import { PATHS } from "@/lib/constants/paths"
import { useAuthStore } from "@/lib/stores/authStore"
import { Menu, X } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"

export function Navigation() {
  const { user, signOut } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-slate-800">
            SwayFitness
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-slate-800 transition-colors">
              Home
            </Link>
            <Link href={PATHS.Plans} className="text-gray-600 hover:text-slate-800 transition-colors">
              Plans
            </Link>
            {/* <Link
              href="/#trainers"
              className="text-gray-600 hover:text-slate-800 transition-colors"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector("#trainers")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Trainers
            </Link> */}
            <Link href={PATHS.Contact} className="text-gray-600 hover:text-slate-800 transition-colors">
              Contact
            </Link>
            {user ? (
              <>
                <Link href={PATHS.Dashboard} className="text-gray-600 hover:text-slate-800 transition-colors">
                  Dashboard
                </Link>
                <Button onClick={signOut} className="bg-orange-500 hover:bg-orange-600 text-white">Log out</Button>
              </>
            ) : (
              <>
                <Link href={PATHS.SignIn} className="text-gray-600 hover:text-slate-800 transition-colors">
                  Sign In
                </Link>
                <Link href={PATHS.Join}>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">Join Now</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-slate-800 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href={PATHS.Plans}
                className="text-gray-600 hover:text-slate-800 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Plans
              </Link>
              {/* <Link
                href="/#trainers"
                className="text-gray-600 hover:text-slate-800 transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  setTimeout(() => {
                    document.querySelector("#trainers")?.scrollIntoView({ behavior: "smooth" })
                  }, 100)
                }}
              >
                Trainers
              </Link> */}
              <Link
                href={PATHS.Contact}
                className="text-gray-600 hover:text-slate-800 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Link
                href={PATHS.SignIn}
                className="text-gray-600 hover:text-slate-800 transition-colors"
                onClick={() => {
                  setIsOpen(false)
                  signOut()
                }}
              >
                Sign In
              </Link>
              <Link href={PATHS.Join} onClick={() => setIsOpen(false)}>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white w-fit">Join Now</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
