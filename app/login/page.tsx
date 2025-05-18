'use client'
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import { LoginStaticSide } from './staticSide';

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { googleLogin, otpVerify, resetPassword, sendResetPassLink, signin, signup } from '../api/user.api';
import { useRouter } from 'next/navigation';
import { useTheme } from '../context/theme.context';
import toast from 'react-hot-toast';


// Define types
type AuthViewType = 'login' | 'signup' | 'otp' | 'success' | 'resetPass';
type AlertType = 'success' | 'error' | 'info' | null;


// Form validation type
interface FormError {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function LoginSignup() {
  
//   const { toast } = useToast();
  const [view, setView] = useState<AuthViewType>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [token,setToken]=useState<string|null>(null)
  const router = useRouter()
  const {theme} = useTheme()



    useEffect(() => {
     
      const params = new URLSearchParams(window.location.search);
      const id = params.get('token');
      if(localStorage.getItem("user")){
        if(!id){
         router.push("/");
        }
        else{
          setView("resetPass")
        }
     
      }
      else{
        if(id){
          setView("resetPass")
        }
        else{
          setView("login")
        }
      }

     setToken(id)

    }, [router]);


  

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  // Form validation
  const [errors, setErrors] = useState<FormError>({});
  // useEffect(()=>{
  //   if(token)setView("resetPass")
  // },[])
  // Google Auth Setup


  const handleGoogleResponse = useCallback(async (response: { clientId: string, credential: string }) => {
    setIsLoading(true);
    try {
      const res = await googleLogin(response?.credential);
      if (res.error) {
        showAlert('error', res.error || "some error internal accured");
      } else {
        showAlert('success', 'Successfully logged in with Google!');
        setView('success');
        localStorage.setItem("user", JSON.stringify(res));
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showAlert('error', 'Google authentication failed. Please try again.');
      console.error("Google auth error:", error);
    }
  }, [ setView, router]);

    useEffect(() => {
    // Load Google Identity Services script
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      document.body.appendChild(script);
    };

    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button') as HTMLElement,
          {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            shape: 'rectangular',
            width: '100%',
            logo_alignment: 'center',
            text: view === 'login' ? 'signin_with' : 'signup_with',
          }
        );
      }
    };

    loadGoogleScript();

    return () => {
      // Clean up if needed
      const googleScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (googleScript) {
        googleScript.remove();
      }
    };
  }, [view,handleGoogleResponse]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when typing
    if (errors[name as keyof FormError]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  // OTP handling
  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;
    
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    
    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };


  const handleFrogotPass =async (e:  React.MouseEvent<HTMLAnchorElement>) =>{
    try {
      e.preventDefault();
      const res = await sendResetPassLink(formData.email);
      if(res.error){
        showAlert("error",res.error)
      }
      else{
        showAlert("success",res.message)
      }
    } catch (error) {
      showAlert("error","some error accured while sending reset password link")
      console.error(error)
    }
  }
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormError = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Signup specific validations
    if (view === 'signup') {

      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Process form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
      
      if (view === 'login') {
        const res = await signin(formData.email,formData.password)
        if(res.error){
          showAlert('error',res.error);
        }
        else{
          showAlert('success',"login Successfuly");
        localStorage.setItem("user",JSON.stringify(res))
          router.push("/")
        }
      } else {
        const res = await signup(formData.email,formData.password)
        if(res.error){
          showAlert('error',res.error);
        
        }
        else{
          showAlert('success',res.message);
          setView("otp")
        }
      }
    setIsLoading(false)
  };

  // Verify OTP
  const verifyOtp = async() => {
    const otpCode = otpValues.join('');
    
    if (otpCode.length !== 4 || !/^\d{4}$/.test(otpCode)) {
      showAlert('error', 'Please enter a valid 4-digit code');
      return;
    }
    
    setIsLoading(true);
    
    setIsLoading(true);
    
      
  
      const res = await otpVerify(formData.email,otpCode)
      if(res.error){
        showAlert('error',res.error);
      }
      else{
        showAlert('success',"login Successfuly");
        localStorage.setItem("user",JSON.stringify(res))
          router.push("/")
      }
    
  setIsLoading(false)
  };

const handleresetPasword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validation
    const newErrors: FormError = {};
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {

      const data = await resetPassword(token || "", formData.password);
      if (data.success) {
        showAlert("success", "Password reset successful! Please login.");
        router.push("/profile");
        setFormData({ ...formData, password: "", confirmPassword: "" });
      } else {
        showAlert("error", data.error || "Failed to reset password.");
      }
    } catch {
      showAlert("error", "Something went wrong.");
    }
    setIsLoading(false);
  }

  

  // Show alert message
  
  const showAlert = (type: AlertType, message: string) => {
    if (type === 'success') toast.success(message);
    else if (type === 'error') toast.error(message);
    else toast(message);
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
    });
    setErrors({});
  };

  // Toggle between login and signup
  const toggleView = (newView: 'login' | 'signup') => {
    resetForm();
    setView(newView);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  // Render alert if present
  

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: theme.neutral }}>
      {/* Left side - Form */}
    
      <div className="w-full md:w-1/2 flex justify-center items-center p-3 sm:p-6">
      
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-lg border-0">
            <CardHeader className="pt-6 pb-2 flex flex-col items-center">
            <div className="">
              <div className='overflow-hidden h-[100px]'> <Image src='/Logo.png' className='bg-center relative bottom-5' alt='Logo' height={130} width={150} priority /></div>
                
              </div>
              
              <motion.h2 
                className="text-2xl font-bold text-center"
                style={{ color: theme.primary }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {view === 'login' ? "Welcome Back!" : 
                 view === 'signup' ? "Create Your Account" : 
                 view === 'otp' ? "Verification Required" : 
                 "Verification Complete"}
              </motion.h2>
            </CardHeader>
            
            <CardContent className="px-6 pb-6">
              
              
              {view === 'login' || view === 'signup' ? (
                <motion.form
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  onSubmit={handleSubmit}
                >
                 
                  
                  <motion.div variants={itemVariants} className="mb-4">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`pl-10 h-10 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        placeholder="your@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    )}
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="mb-4">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Password
                      </Label>
                      {view === 'login' && (
                        <a 
                          href="#" 
                          className="text-xs font-medium"
                          style={{ color: theme.primary }}
                          onClick={(e) => handleFrogotPass(e)}
                        >
                          Forgot password?
                        </a>
                      )}
                    </div>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`pl-10 pr-10 h-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                        placeholder="********"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                    )}
                  </motion.div>
                  
                  {view === 'signup' && (
                    <motion.div variants={itemVariants} className="mb-4">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                        Confirm Password
                      </Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`pl-10 pr-10 h-10 ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          placeholder="********"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                      )}
                    </motion.div>
                  )}
                  
                  <motion.div variants={itemVariants} className="mb-6">
                    <Button
                      type="submit"
                      className="w-full h-10 mt-2 text-white font-medium"
                      style={{ backgroundColor: theme.primary }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {view === 'login' ? "Logging in..." : "Signing up..."}
                        </>
                      ) : (
                        <>
                          {view === 'login' ? "Log In" : "Sign Up"}
                          <ArrowRight className="ml-2" size={18} />
                        </>
                      )}
                    </Button>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    {/* <Separator className="my-6" /> */}
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-2 text-gray-500">or continue with</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 sm:mt-6 space-y-2">
                      <div id="google-signin-button" className="h-10"></div>
                    </div>
                    
                    <div className="mt-4 sm:mt-6 text-center">
                      <p className="text-sm text-gray-600">
                        {view === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <button 
                          type="button"
                          onClick={() => toggleView(view === 'login' ? 'signup' : 'login')} 
                          className="font-medium"
                          style={{ color: theme.primary }}
                        >
                          {view === 'login' ? "Sign Up" : "Log In"}
                        </button>
                      </p>
                    </div>
                  </motion.div>
                </motion.form>
              ) : view === 'otp' ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <p className="text-gray-600 text-center text-sm">
                    We&apos;ve sent a verification code to your email address. Please enter the 4-digit code below.
                  </p>
                  
                  <div className="flex justify-center gap-3 my-6">
                    {otpValues.map((value, index) => (
                      <Input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={value}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-12 h-12 text-center text-xl font-bold p-0"
                        style={{ 
                          backgroundColor: value ? theme.neutral : '#fff',
                        }}
                        onKeyDown={(e) => {
                          // Handle backspace
                          if (e.key === 'Backspace' && !value && index > 0) {
                            document.getElementById(`otp-${index - 1}`)?.focus();
                          }
                        }}
                      />
                    ))}
                  </div>
                  
                  <Button
                    className="w-full h-10 text-white font-medium"
                    style={{ backgroundColor: theme.primary }}
                    onClick={verifyOtp}
                    disabled={isLoading || otpValues.join('').length !== 4}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify
                        <ArrowRight className="ml-2" size={18} />
                      </>
                    )}
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Didn&apos;t receive code? 
                      <button 
                        type="button"
                        className="font-medium ml-1" 
                        style={{ color: theme.primary }}
                        onClick={() => {
                          setView("signup")
                          setOtpValues(['', '', '', '']);
                          document.getElementById('otp-0')?.focus();
                        }}
                      >
                        Retry
                      </button>
                    </p>
                  </div>
                </motion.div>
              ) : view ==="resetPass" ? 
         (
  // Reset Password Section
  <motion.form
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="space-y-5"
    onSubmit={(e)=>handleresetPasword(e)}
  >
    <div>
      <Label htmlFor="reset-password" className="text-sm font-medium text-gray-700">
        New Password
      </Label>
      <Input
        id="reset-password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleInputChange}
        className={`h-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        placeholder="********"
      />
      {errors.password && (
        <p className="mt-1 text-xs text-red-500">{errors.password}</p>
      )}
    </div>
    <div>
      <Label htmlFor="reset-confirm-password" className="text-sm font-medium text-gray-700">
        Confirm Password
      </Label>
      <Input
        id="reset-confirm-password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        className={`h-10 ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        placeholder="********"
      />
      {errors.confirmPassword && (
        <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
      )}
    </div>
    <Button
      type="submit"
      className="w-full h-10 mt-2 text-white font-medium"
      style={{ backgroundColor: theme.primary }}
      disabled={isLoading}

    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Resetting...
        </>
      ) : (
        <>Reset Password</>
      )}
    </Button>
  </motion.form>
)
             
              
               : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20
                    }}
                    className="mb-4"
                  >
                    <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.tertiary }}>
                      <CheckCircle size={40} color={theme.white} />
                    </div>
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold mt-2" style={{ color: theme.primary }}>
                    Verification Successful!
                  </h3>
                  
                  <p className="text-gray-600 text-center mt-2 mb-6">
                    Your account has been verified successfully. You can now access your dashboard.
                  </p>
                  
                  <Button
                    className="w-full h-10 text-white font-medium"
                    style={{ backgroundColor: theme.primary }}
                    onClick={() => {
                      showAlert('success', 'Redirecting to dashboard...');
                      router.push("/")
                    }}
                  >
                    Continue to Dashboard
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Right side - Features */}
      <LoginStaticSide />
    </div>
  );
}

// Add this to global.d.ts or a similar file for TypeScript support
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: unknown) => void;
          renderButton: (element: HTMLElement, options: unknown) => void;
          prompt: () => void;
        };
      };
    };
  }
}