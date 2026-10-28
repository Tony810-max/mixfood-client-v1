
import { useUiText } from '@/contexts/LanguageContext';
import { AuthCard, AuthFormLayout, AuthHeader, AuthLogo } from "@/components/auth";
import { OTPInput } from "@/components/auth/OTPInput";
import { StepProgress } from "@/components/auth/StepProgress";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRegister, useSendRegistrationCode } from "@/hooks/api/useAuth";
import {
  registerStep1Schema,
  registerStep2Schema,
  type RegisterFormData,
} from "@/lib/validation";
import { ROUTES } from "@/utils/const";
import { formatPhoneNumber } from "@/utils/formatters";
import { showErrorToast } from "@/utils/toastHelpers";
import { motion } from "framer-motion";
import { Eye, EyeOff, Info, Lock, Mail, Phone, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const ui = useUiText();
  const { t } = useLanguage();
  const steps = [
    { id: 1, label: t.registerStep1Label, icon: <User className="w-5 h-5" /> },
    { id: 2, label: t.registerStep2Label, icon: <Shield className="w-5 h-5" /> },
  ];
  const navigate = useNavigate();
  const sendCodeMutation = useSendRegistrationCode();
  const registerMutation = useRegister();
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    verifyCode: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-send the verification code once the user reaches step 2
  useEffect(() => {
    if (step === 2 && !codeSent && countdown === 0) {
      doSendCode(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const doSendCode = async (silent = false) => {
    if (countdown > 0) return;
    if (!silent) setIsLoading(true);
    try {
      await sendCodeMutation.mutateAsync(formData.email);
      setCountdown(60);
      setCodeSent(true);
    } catch {
      if (silent) showErrorToast(t.registerCodeError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    const result = registerStep1Schema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof RegisterFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleRegister = async () => {
    const result = registerStep2Schema.safeParse({
      email: formData.email,
      verifyCode: formData.verifyCode,
    });
    if (!result.success) {
      setErrors({ verifyCode: result.error.errors.find((e) => e.path[0] === "verifyCode")?.message ?? "" });
      return;
    }

    setIsLoading(true);
    try {
      await registerMutation.mutateAsync({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        code: formData.verifyCode,
        password: formData.password,
      });
      navigate(ROUTES.AUTH.LOGIN);
    } catch {
      // Error is handled by the mutation
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    let formattedValue = value;
    if (field === "phone") {
      formattedValue = formatPhoneNumber(value);
    }
    setFormData((prev) => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const goBack = () => {
    setStep(1);
    setErrors({});
  };

  return (
    <AuthCard>
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AuthFormLayout>
          <AuthLogo />
          <AuthHeader title={t.registerTitle} subtitle={t.registerSubtitle} />
          <StepProgress currentStep={step} steps={steps} className="max-w-sm mx-auto" />

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    {t.registerFullName}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder={t.registerFullNamePlaceholder}
                      className={`pl-10 h-11 ${errors.fullName ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-orange-200 dark:border-orange-900 focus:border-orange-400 focus:ring-orange-400"}`}
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                    />
                  </div>
                  {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    {t.registerPhoneNumber}
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t.registerPhonePlaceholder}
                      className={`pl-10 h-11 ${errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-orange-200 dark:border-orange-900 focus:border-orange-400 focus:ring-orange-400"}`}
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t.registerEmail}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t.registerEmailPlaceholder}
                    className={`pl-10 h-11 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-orange-200 dark:border-orange-900 focus:border-orange-400 focus:ring-orange-400"}`}
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t.registerPassword}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t.registerPasswordPlaceholder}
                    className={`pl-10 pr-10 h-11 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-orange-200 dark:border-orange-900 focus:border-orange-400 focus:ring-orange-400"}`}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                    aria-label={showPassword ? ui("Hide password") : ui("Show password")}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  {t.registerConfirmPassword}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder={t.registerConfirmPasswordPlaceholder}
                    className={`pl-10 pr-10 h-11 ${errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-orange-200 dark:border-orange-900 focus:border-orange-400 focus:ring-orange-400"}`}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                    aria-label={showPassword ? ui("Hide passwords") : ui("Show passwords")}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
              <Button
                className="w-full h-11 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                size="lg"
                onClick={handleContinue}
                disabled={isLoading}
              >
                {t.registerContinue}
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{t.registerVerifySubtitle}</p>
              </div>

              {/* Registered email */}
              <div className="space-y-2">
                <Label htmlFor="verifyEmail" className="text-sm font-medium">
                  {t.registerEmail}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="verifyEmail"
                    type="email"
                    className="pl-10 h-11 border-orange-200 dark:border-orange-900 bg-muted/50 text-muted-foreground"
                    value={formData.email}
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verifyCode" className="text-sm font-medium">
                  {t.registerVerifyCode}
                </Label>
                <OTPInput
                  length={6}
                  value={formData.verifyCode}
                  onChange={(value) => handleInputChange("verifyCode", value)}
                  disabled={isLoading}
                />
                {errors.verifyCode && (
                  <p className="text-sm text-red-500 text-center">{errors.verifyCode}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 border-orange-200 dark:border-orange-900 hover:bg-orange-50 dark:hover:bg-orange-950 whitespace-nowrap"
                  onClick={() => doSendCode(false)}
                  disabled={countdown > 0 || isLoading}
                >
                  {isLoading && countdown === 0
                    ? t.registerSending
                    : countdown > 0
                      ? t.registerResendIn.replace("{seconds}", countdown.toString())
                      : t.registerResendCode}
                </Button>
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900 p-3 text-sm text-orange-800 dark:text-orange-200">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{t.registerNoteSentToEmail}</span>
              </div>

              <div className="flex gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 flex-1 border-orange-200 dark:border-orange-900 hover:bg-orange-50 dark:hover:bg-orange-950"
                  onClick={goBack}
                  disabled={isLoading}
                >
                  {t.registerBack}
                </Button>
                <Button
                  className="h-11 flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                  size="lg"
                  onClick={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading ? t.registerCreating : t.registerButton}
                </Button>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col space-y-4 pt-6">
            <div className="text-center text-sm">
              <span className="text-muted-foreground">{t.registerHasAccount} </span>
              <Link
                to={ROUTES.AUTH.LOGIN}
                className="font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
              >
                {t.registerLoginLink}
              </Link>
            </div>
          </div>
        </AuthFormLayout>
      </motion.div>
    </AuthCard>
  );
};

export default RegisterPage;
