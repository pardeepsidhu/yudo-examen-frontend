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
import { Variants } from "framer-motion";

// Shadcn UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { googleLogin, otpVerify, resetPassword, sendResetPassLink, signin, signup } from '../api/user.api';
import { useRouter } from 'next/navigation';
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
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()




  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
    const id = params.get('token');
    if (localStorage.getItem("user")) {
      if (!id) {
        router.push("/");
      }
      else {
        setView("resetPass")
      }

    }
    else {
      if (id) {
        setView("resetPass")
      }
      else {
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
  }, [setView, router]);

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
  }, [view, handleGoogleResponse]);

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


  const handleFrogotPass = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      e.preventDefault();
      const res = await sendResetPassLink(formData.email);
      if (res.error) {
        showAlert("error", res.error)
      }
      else {
        showAlert("success", res.message)
      }
    } catch (error) {
      showAlert("error", "some error accured while sending reset password link")
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
      const res = await signin(formData.email, formData.password)
      if (res.error) {
        showAlert('error', res.error);
      }
      else {
        showAlert('success', "login Successfuly");
        localStorage.setItem("user", JSON.stringify(res))
        router.push("/")
      }
    } else {
      const res = await signup(formData.email, formData.password)
      if (res.error) {
        showAlert('error', res.error);

      }
      else {
        showAlert('success', res.message);
        setView("otp")
      }
    }
    setIsLoading(false)
  };

  // Verify OTP
  const verifyOtp = async () => {
    const otpCode = otpValues.join('');

    if (otpCode.length !== 4 || !/^\d{4}$/.test(otpCode)) {
      showAlert('error', 'Please enter a valid 4-digit code');
      return;
    }

    setIsLoading(true);

    setIsLoading(true);



    const res = await otpVerify(formData.email, otpCode)
    if (res.error) {
      showAlert('error', res.error);
    }
    else {
      showAlert('success', "login Successfuly");
      localStorage.setItem("user", JSON.stringify(res))
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

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  // Render alert if present


  return (
    <div className="min-h-screen flex flex-col md:flex-row" >
      {/* Left side - Form */}

      <div className="w-full md:w-1/2 flex justify-center items-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0 rounded-sm sm:rounded-xl overflow-hidden bg-white/90 backdrop-blur-xl relative">
            {/* Gradient top border */}
            <div className="absolute top-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-500" />

            <CardHeader className="pt-8 pb-6 flex flex-col items-center bg-gradient-to-br from-indigo-50 to-blue-50 relative">
              {/* Animated background blobs */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-300 rounded-full blur-2xl animate-blob" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-300 rounded-full blur-2xl animate-blob animation-delay-2000" />
              </div>

              {/* <div className="relative z-10 mb-4">
                <div className="overflow-hidden h-[100px]">
                  <Image src="/Logo.png" className="bg-center relative bottom-5" alt="Logo" height={130} width={150} priority />
                </div>
              </div> */}

              <motion.h2
                className="text-3xl font-black text-center bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent relative z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {view === 'login' ? "Welcome Back!" :
                  view === 'signup' ? "Create Account" :
                    view === 'otp' ? "Verify Code" :
                      "All Set!"}
              </motion.h2>
              <p className="text-sm text-gray-600 mt-2 relative z-10">
                {view === 'login' ? "Sign in to continue your learning journey" :
                  view === 'signup' ? "Join thousands of learners today" :
                    view === 'otp' ? "Enter the code we sent to your email" :
                      "Your account is ready to go"}
              </p>
            </CardHeader>

            <CardContent className="px-6 sm:px-8 pb-8">
              {view === 'login' || view === 'signup' ? (
                <motion.form
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Email Field */}
                  <motion.div variants={itemVariants}>
                    <Label htmlFor="email" className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
                      <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`pl-11 pr-4 h-12 border-2 rounded-xl transition-all ${errors.email
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                            : 'border-indigo-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100'
                          }`}
                        placeholder="your@email.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.email}
                      </p>
                    )}
                  </motion.div>

                  {/* Password Field */}
                  <motion.div variants={itemVariants}>
                    <div className="flex justify-between items-center mb-2">
                      <Label htmlFor="password" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Password
                      </Label>
                      {view === 'login' && (
                        <a
                          href="#"
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                          onClick={(e) => handleFrogotPass(e)}
                        >
                          Forgot password?
                        </a>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`pl-11 pr-12 h-12 border-2 rounded-xl transition-all ${errors.password
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                            : 'border-indigo-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100'
                          }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-400 hover:text-indigo-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.password}
                      </p>
                    )}
                  </motion.div>

                  {/* Confirm Password (Signup only) */}
                  {view === 'signup' && (
                    <motion.div variants={itemVariants}>
                      <Label htmlFor="confirmPassword" className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
                        <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-400" size={18} />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`pl-11 pr-12 h-12 border-2 rounded-xl transition-all ${errors.confirmPassword
                              ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                              : 'border-indigo-100 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100'
                            }`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-400 hover:text-indigo-600 transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.confirmPassword}
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      className="relative w-full h-12 text-white font-bold text-base rounded-xl overflow-hidden group shadow-lg hover:shadow-xl transition-all mt-6"
                      disabled={isLoading}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500" />
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Shine effect */}
                      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700" />

                      <div className="relative z-10 flex items-center justify-center gap-2">
                        {isLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            {view === 'login' ? "Logging in..." : "Creating account..."}
                          </>
                        ) : (
                          <>
                            {view === 'login' ? "Log In" : "Sign Up"}
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </div>
                    </Button>
                  </motion.div>

                  {/* Divider */}
                  <motion.div variants={itemVariants}>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t-2 border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-4 text-gray-500 font-medium">or continue with</span>
                      </div>
                    </div>

                    {/* Google Sign In */}
                    <div className="mt-4">
                      <div id="google-signin-button" className="h-12 rounded-xl overflow-hidden border-2 border-indigo-100 hover:border-indigo-300 transition-colors"></div>
                    </div>

                    {/* Toggle View */}
                    <div className="mt-6 text-center">
                      <p className="text-sm text-gray-600">
                        {view === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <button
                          type="button"
                          onClick={() => toggleView(view === 'login' ? 'signup' : 'login')}
                          className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
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
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-100">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      We've sent a <span className="font-bold text-indigo-600">4-digit verification code</span> to your email. Please enter it below.
                    </p>
                  </div>

                  <div className="flex justify-center gap-3 my-8">
                    {otpValues.map((value, index) => (
                      <Input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={value}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className={`w-14 h-14 text-center text-2xl font-black p-0 rounded-xl border-2 transition-all ${value
                            ? 'border-indigo-400 bg-gradient-to-br from-indigo-50 to-blue-50 ring-4 ring-indigo-100'
                            : 'border-indigo-200 hover:border-indigo-300'
                          }`}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !value && index > 0) {
                            document.getElementById(`otp-${index - 1}`)?.focus();
                          }
                        }}
                      />
                    ))}
                  </div>

                  <Button
                    className="relative w-full h-12 text-white font-bold text-base rounded-xl overflow-hidden group shadow-lg hover:shadow-xl transition-all"
                    onClick={verifyOtp}
                    disabled={isLoading || otpValues.join('').length !== 4}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700" />

                    <div className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Verify Code
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </div>
                  </Button>

                  <div className="text-center p-3 rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-600">
                      Didn't receive the code?
                      <button
                        type="button"
                        className="font-bold text-indigo-600 hover:text-indigo-700 ml-1 transition-colors"
                        onClick={() => {
                          setView("signup");
                          setOtpValues(['', '', '', '']);
                          document.getElementById('otp-0')?.focus();
                        }}
                      >
                        Resend Code
                      </button>
                    </p>
                  </div>
                </motion.div>
              ) : view === "resetPass" ? (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-5"
                  onSubmit={(e) => handleresetPasword(e)}
                >
                  <div>
                    <Label htmlFor="reset-password" className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
                      <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      New Password
                    </Label>
                    <Input
                      id="reset-password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`h-12 border-2 rounded-xl ${errors.password ? 'border-red-300' : 'border-indigo-100'}`}
                      placeholder="••••••••"
                    />
                    {errors.password && (
                      <p className="mt-2 text-xs text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="reset-confirm-password" className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
                      <svg className="h-4 w-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Confirm Password
                    </Label>
                    <Input
                      id="reset-confirm-password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`h-12 border-2 rounded-xl ${errors.confirmPassword ? 'border-red-300' : 'border-indigo-100'}`}
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-2 text-xs text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="relative w-full h-12 text-white font-bold text-base rounded-xl overflow-hidden group shadow-lg hover:shadow-xl transition-all mt-6"
                    disabled={isLoading}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700" />

                    <div className="relative z-10">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin inline" />
                          Resetting...
                        </>
                      ) : (
                        "Reset Password"
                      )}
                    </div>
                  </Button>
                </motion.form>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center py-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="mb-6"
                  >
                    <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-500 shadow-2xl">
                      <CheckCircle size={48} className="text-white" />
                    </div>
                  </motion.div>

                  <h3 className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                    Verification Successful!
                  </h3>

                  <p className="text-gray-600 text-center mb-8 max-w-sm">
                    Your account has been verified successfully. You're all set to start your learning journey!
                  </p>

                  <Button
                    className="relative w-full h-12 text-white font-bold text-base rounded-xl overflow-hidden group shadow-lg hover:shadow-xl transition-all"
                    onClick={() => {
                      showAlert('success', 'Redirecting to dashboard...');
                      router.push("/");
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700" />

                    <div className="relative z-10 flex items-center justify-center gap-2">
                      Continue to Dashboard
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

      </div>

      {/* Right side - Features */}
      <LoginStaticSide />

      <style jsx>{`
    @keyframes blob {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -20px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
    }
    .animate-blob { animation: blob 7s ease-in-out infinite; }
    .animation-delay-2000 { animation-delay: 2s; }
  `}</style>
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