import { Menu, X, Code2, ArrowRight } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { ThemeToggle } from '@/components/theme-toggle'

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const navigate = useNavigate();

    // Handle scroll effect for header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLoginButtonClick = () => {
        navigate('/auth/login');
    }

    const scrollToSection = (id) => {
        setIsMenuOpen(false); // Close mobile menu if open
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 mr-3">
                <Code2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-foreground">
              Shivam <span className="text-primary">POS</span>
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Features
              </button>
              
              <button onClick={() => scrollToSection('infrastructure')} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Resources
              </button>
              
              <button onClick={() => scrollToSection('creator')} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Contact
              </button>
            </nav>

            {/* Right Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="ghost" onClick={handleLoginButtonClick} className="font-semibold">
                Sign In
              </Button>
              <Button onClick={handleLoginButtonClick} className="shadow-lg shadow-primary/20 rounded-full px-6">
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-4 md:hidden">
              <ThemeToggle />
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-foreground p-2 hover:bg-accent rounded-md transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-background border-b border-border shadow-2xl animate-in slide-in-from-top-5">
            <div className="px-4 py-6 space-y-4">
              <button onClick={() => scrollToSection('features')} className="block w-full text-left px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg">
                Features
              </button>
              <button onClick={() => scrollToSection('infrastructure')} className="block w-full text-left px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg">
                Resources
              </button>
              <button onClick={() => scrollToSection('creator')} className="block w-full text-left px-4 py-3 text-base font-medium text-foreground hover:bg-accent rounded-lg">
                Contact
              </button>
              
              <div className="pt-4 border-t border-border space-y-3">
                <Button variant="outline" onClick={handleLoginButtonClick} className="w-full justify-center">
                  Sign In
                </Button>
                <Button onClick={handleLoginButtonClick} className="w-full justify-center shadow-lg shadow-primary/20">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
    )
}

export default Header