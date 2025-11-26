// pos-frontend-vite/src/pages/common/Auth/Login.jsx

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Code2, 
  ArrowLeft,
  CheckCircle
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '@/Redux Toolkit/features/auth/authThunk'
import { getUserProfile } from '../../../Redux Toolkit/features/user/userThunks'
import { startShift } from '../../../Redux Toolkit/features/shiftReport/shiftReportThunks'
import { ThemeToggle } from '../../../components/theme-toggle'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { error, loading } = useSelector((state) => state.auth)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    try {
      const resultAction = await dispatch(login(formData))
      
      if (login.fulfilled.match(resultAction)) {
        const jwt = resultAction.payload.jwt
        localStorage.setItem("jwt", jwt)
        
        // Fetch user profile
        const profileAction = await dispatch(getUserProfile(jwt))
        
        if (getUserProfile.fulfilled.match(profileAction)) {
          const userRole = profileAction.payload.role
          
          // If cashier, start shift
          if (userRole === 'ROLE_CASHIER') {
            try {
              await dispatch(startShift({
                userId: profileAction.payload.id,
                cashInHand: 0 
              })).unwrap()
            } catch (shiftError) {
              console.error("Failed to start shift:", shiftError)
            }
          }

          toast({
            title: "Success",
            description: "Logged in successfully",
          })

          // Redirect based on role
          switch (userRole) {
            case 'ROLE_STORE_ADMIN':
              navigate('/store/dashboard')
              break
            case 'ROLE_BRANCH_MANAGER':
              navigate('/branch/dashboard')
              break
            case 'ROLE_CASHIER':
              navigate('/cashier')
              break
            case 'ROLE_SUPER_ADMIN':
              navigate('/super-admin/dashboard')
              break
            default:
              navigate('/')
          }
        }
      } else {
        // Handle login failure
        toast({
          title: "Login Failed",
          description: resultAction.payload || "Invalid credentials",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Login error:", err)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-background">
      
      {/* Left Side - Branding / Visual */}
      <div className="hidden lg:flex w-1/2 bg-primary/5 relative items-center justify-center p-12 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        
        <div className="relative z-10 max-w-lg">
          <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground shadow-2xl">
            <Code2 className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-6">
            Manage Your Store with Confidence
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            One platform to manage inventory, sales, and customer relationships. 
            Built for modern retailers who demand speed and reliability.
          </p>
          
          <div className="space-y-4">
            {['Real-time Inventory Tracking', 'Smart Sales Analytics', 'Multi-Branch Support'].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-muted-foreground">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16 relative">
        
        {/* Top Actions */}
        <div className="absolute top-8 right-8 flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
        </div>

        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground mt-2">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  name="email"
                  placeholder="Email address"
                  type="email"
                  className="pl-10 h-12 bg-muted/30"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  name="password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 h-12 bg-muted/30 pr-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Divider & Sign Up Action */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Don't have an account?
              </span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-12 font-medium border-primary/20 hover:bg-primary/5 text-primary"
            onClick={() => navigate('/auth/onboarding')}
          >
            Create an Account
          </Button>

        </div>
      </div>
    </div>
  )
}

export default Login