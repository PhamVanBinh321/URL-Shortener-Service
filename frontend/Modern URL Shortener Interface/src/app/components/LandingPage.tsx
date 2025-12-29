import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link2, BarChart3, Shield, Zap, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <Link2 className="w-8 h-8 text-blue-600" />
              <span className="text-xl sm:text-2xl font-bold text-gray-900">Shortify</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
            </nav>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" className="rounded-full" onClick={() => navigate('/login')}>
                Log In
              </Button>
              <Button
                onClick={() => navigate('/signup')}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
              >
                Sign Up
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-gray-900 px-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 px-2" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                <a href="#about" className="text-gray-600 hover:text-gray-900 px-2" onClick={() => setMobileMenuOpen(false)}>About</a>
                <div className="flex flex-col gap-2 pt-2">
                  <Button variant="ghost" className="rounded-full w-full" onClick={() => navigate('/login')}>
                    Log In
                  </Button>
                  <Button
                    onClick={() => navigate('/signup')}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-full"
                  >
                    Sign Up
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Shorten Your Links, Amplify Your Reach
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-10">
            Create powerful short links and track their performance with detailed analytics.
            Perfect for marketers, businesses, and content creators.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <Input
              type="url"
              placeholder="Paste your long URL here"
              className="flex-1 h-12 sm:h-14 rounded-full border-gray-300 px-4 sm:px-6"
            />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-12 sm:h-14 px-6 sm:px-8">
              Shorten
            </Button>
          </div>

          <p className="text-xs sm:text-sm text-gray-500 mt-4">
            No registration required. Start shortening URLs instantly.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Everything You Need to Manage Your Links
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Powerful features to help you create, manage, and track your short links
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="p-6 sm:p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Detailed Analytics
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Track clicks, geographic data, and referral sources. Understand your audience with comprehensive analytics.
              </p>
            </Card>

            <Card className="p-6 sm:p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Secure & Reliable
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Enterprise-grade security with 99.9% uptime guarantee. Your links are always accessible and protected.
              </p>
            </Card>

            <Card className="p-6 sm:p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Lightning Fast
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Create shortened links instantly with our global CDN. Fast redirects from anywhere in the world.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Link2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                <span className="text-lg sm:text-xl font-bold">Shortify</span>
              </div>
              <p className="text-sm sm:text-base text-gray-400">
                The modern way to shorten and track your links.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Shortify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
