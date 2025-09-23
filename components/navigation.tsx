"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-2xl text-foreground hover:text-primary transition-colors">
            Byte Unite
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/programmers" className="text-secondary hover:text-primary transition-colors font-medium">
              Programmers
            </Link>
            <Link href="/portfolio" className="text-secondary hover:text-primary transition-colors font-medium">
              Portfolio
            </Link>
            <Link href="/events" className="text-secondary hover:text-primary transition-colors font-medium">
              Events
            </Link>
            <Link href="/blog" className="text-secondary hover:text-primary transition-colors font-medium">
              Blog
            </Link>
            <Link href="/categories" className="text-secondary hover:text-primary transition-colors font-medium">
              Categories
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Join Community</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <Link
                href="/programmers"
                className="text-secondary hover:text-primary transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Programmers
              </Link>
              <Link
                href="/portfolio"
                className="text-secondary hover:text-primary transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Portfolio
              </Link>
              <Link
                href="/events"
                className="text-secondary hover:text-primary transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Events
              </Link>
              <Link
                href="/blog"
                className="text-secondary hover:text-primary transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/categories"
                className="text-secondary hover:text-primary transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Categories
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <Button variant="ghost" asChild>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    Join Community
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
