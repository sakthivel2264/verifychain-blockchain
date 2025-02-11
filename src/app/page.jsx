"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, BarChart, Users, Search } from "lucide-react"
import { initializeContract } from "@/lib/contractfunctions";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const handleInitialize = async () =>{
    const response = await initializeContract()
    if(response){
      router.push("/getstarted")
    }
    console.log(response)
  }
  const handleInitialize2 = async () =>{
    const response = await initializeContract()
    if(response){
      router.push("/verify")
    }
    console.log(response)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-purple-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">VerifyChain</span>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="#features" className="text-gray-600 hover:text-gray-900">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="" className="text-gray-600 hover:text-gray-900">
                  <Button onClick={handleInitialize} >Get Started</Button>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl mb-6">
              Secure Product Verification on the Blockchain
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              VerifyChain provides a robust, transparent, and tamper-proof system to authenticate products and combat
              counterfeiting.
            </p>
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" onClick={handleInitialize2}>
              Start Verifying
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card>
                <CardHeader>
                  <Shield className="h-10 w-10 text-purple-600 mb-2" />
                  <CardTitle>Secure Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Utilize blockchain technology to ensure tamper-proof product verification.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <BarChart className="h-10 w-10 text-purple-600 mb-2" />
                  <CardTitle>Supply Chain Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Track products from manufacturer to consumer with complete transparency.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 text-purple-600 mb-2" />
                  <CardTitle>Multi-Party System</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Connect manufacturers, sellers, and consumers in a unified platform.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Search className="h-10 w-10 text-purple-600 mb-2" />
                  <CardTitle>Easy Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Simple product lookup using unique serial numbers for instant verification.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Product Registration</h3>
                <p className="text-gray-600">Manufacturers add products to the blockchain with unique identifiers.</p>
              </div>
              <div>
                <div className="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Supply Chain Tracking</h3>
                <p className="text-gray-600">
                  Products are tracked as they move from manufacturers to sellers to consumers.
                </p>
              </div>
              <div>
                <div className="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Consumer Verification</h3>
                <p className="text-gray-600">
                  Consumers can easily verify product authenticity using the product's unique code.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="get-started" className="bg-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Supply Chain?</h2>
            <p className="text-xl mb-8">Join VerifyChain today and protect your brand from counterfeiting.</p>
            <Button size="lg" variant="secondary">
              Request a Demo
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-300">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p>&copy; 2023 VerifyChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

