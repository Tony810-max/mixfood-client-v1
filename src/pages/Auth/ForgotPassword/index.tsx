import { AuthCard, AuthFormLayout, AuthHeader, AuthLogo, CountdownTimer, OTPInput, StepProgress } from "@/components/auth";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage, useUiText } from "@/contexts/LanguageContext";
import { useForgotPassword } from "@/hooks/useForgotPassword";
import { ROUTES } from "@/utils/const";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Key, Lock, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const { t } = useLanguage();
  const ui = useUiText();
  const navigate = useNavigate();
  const {
    step,
    email,
    otp,
    newPassword,
    confirmPassword,
    isLoading,
    error,
    errors,
    setEmail,
    setOtp,
    setNewPassword,
    setConfirmPassword,
    setStep,
    handleSendOTP,
    handleVerifyOTP,
    handleResetPassword,
    handleResendOTP,
    reset,
  } = useForgotPassword({
    sendSuccess: t.fpSendSuccess,
    sendError: t.fpSendError,
    resendSuccess: t.fpResendSuccess,
    resendError: t.fpResendError,
    otpLengthError: t.fpOtpLengthError,
    otpVerifySuccess: t.fpOtpVerifySuccess,
    otpVerifyError: t.fpOtpVerifyError,
    resetSuccess: t.fpResetSuccess,
    resetError: t.fpResetError,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const steps = [
    { id: 1, label: t.fpStepEmail, icon: <Mail className="w-6 h-6" /> },
    { id: 2, label: t.fpStepOtp, icon: <Key className="w-6 h-6" /> },
    { id: 3, label: t.fpStepNewPassword, icon: <Lock className="w-6 h-6" /> },
  ];

  const getStepNumber = () => {
    switch (step) {
      case 'email': return 1;
      case 'otp': return 2;
      case 'newPassword': return 3;
      case 'success': return 3;
      default: return 1;
    }
  };

  const handleBack = () => {
    if (step === 'otp') {
      reset();
    } else if (step === 'newPassword') {
      setStep('email');
      setOtp('');
    } else {
      navigate(ROUTES.AUTH.LOGIN);
    }
  };

  const renderEmailStep = () => (
    <motion.div
      key="email"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <AuthLogo icon={<Mail className="w-full h-full text-primary p-4" />} />
      <AuthHeader
        title={t.forgotPasswordTitle}
        subtitle={t.forgotPasswordSubtitle}
      />
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            {t.loginEmailAddress}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder={t.loginEmailPlaceholderAddress}
              className={`pl-10 h-11 ${error ? 'border-destructive focus:border-destructive focus:ring-destructive' : 'border-primary/30 focus:border-primary focus:ring-primary'}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-sm text-destructive">{ui(error)}</p>}
        </div>
        <Button
          className="w-full h-11 bg-primary-gradient font-semibold shadow-md hover:shadow-lg hover:brightness-95 transition-all"
          size="lg"
          onClick={handleSendOTP}
          disabled={isLoading || !email}
        >
          {isLoading ? (
            <>
              <Key className="mr-2 h-4 w-4 animate-spin" />
              {t.forgotPasswordSending}
            </>
          ) : (
            <>
              <Key className="mr-2 h-4 w-4" />
              {t.forgotPasswordButton}
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          className="w-full border border-border bg-secondary/70 text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground"
          onClick={() => navigate(ROUTES.AUTH.LOGIN)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.forgotPasswordBackToLogin}
        </Button>
      </div>
    </motion.div>
  );

  const renderOTPStep = () => (
    <motion.div
      key="otp"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <AuthLogo icon={<ShieldCheck className="w-full h-full text-primary p-4" />} />
      <AuthHeader
        title={t.fpStepOtp}
        subtitle={`${t.fpOtpSubtitle} ${email}`}
      />
      <div className="space-y-4">
        <div className="bg-primary/10 p-4 rounded-lg border border-primary/25">
          <p className="text-sm text-foreground">
            {t.fpOtpNote}
          </p>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t.fpOtpLabel}</Label>
          <OTPInput
            length={6}
            value={otp}
            onChange={setOtp}
            disabled={isLoading}
            error={ui(error)}
          />
        </div>
        <CountdownTimer
          initialSeconds={60}
          onResend={handleResendOTP}
          isResending={isLoading}
        />
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
            onClick={handleBack}
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.registerBack}
          </Button>
          <Button
            className="flex-1 h-11 bg-primary-gradient font-semibold shadow-md hover:shadow-lg hover:brightness-95 transition-all"
            onClick={handleVerifyOTP}
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <>
                <Key className="mr-2 h-4 w-4 animate-spin" />
                {t.fpVerifying}
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t.fpVerifyButton}
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderNewPasswordStep = () => (
    <motion.div
      key="newPassword"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <AuthLogo icon={<Lock className="w-full h-full text-primary p-4" />} />
      <AuthHeader
        title={t.fpNewPasswordTitle}
        subtitle={t.fpNewPasswordSubtitle}
      />
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-sm font-medium">
            {t.fpNewPasswordLabel}
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`pl-10 pr-10 h-11 ${errors.newPassword || error ? 'border-destructive focus:border-destructive focus:ring-destructive' : 'border-primary/30 focus:border-primary focus:ring-primary'}`}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.newPassword && <p className="text-sm text-destructive">{ui(errors.newPassword)}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            {t.fpConfirmNewPasswordLabel}
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`pl-10 pr-10 h-11 ${errors.confirmPassword || error ? 'border-destructive focus:border-destructive focus:ring-destructive' : 'border-primary/30 focus:border-primary focus:ring-primary'}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-sm text-destructive">{ui(errors.confirmPassword)}</p>}
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
            onClick={handleBack}
            disabled={isLoading}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.registerBack}
          </Button>
          <Button
            className="flex-1 h-11 bg-primary-gradient font-semibold shadow-md hover:shadow-lg hover:brightness-95 transition-all"
            onClick={handleResetPassword}
            disabled={isLoading || !newPassword || !confirmPassword}
          >
            {isLoading ? (
              <>
                <Key className="mr-2 h-4 w-4 animate-spin" />
                {t.fpResetting}
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t.fpResetButton}
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderSuccessStep = () => (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
      >
        <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
      </motion.div>
      <AuthHeader
        title={t.fpSuccessTitle}
        subtitle={t.fpSuccessSubtitle}
      />
      <div className="space-y-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-800 dark:text-green-200">
            {t.fpSuccessMessage}
          </p>
        </div>
        <Button
          className="w-full h-11 bg-primary-gradient font-semibold shadow-md hover:shadow-lg hover:brightness-95 transition-all"
          size="lg"
          onClick={() => navigate(ROUTES.AUTH.LOGIN)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.fpLoginNow}
        </Button>
      </div>
    </motion.div>
  );

  return (
    <AuthCard>
      <Header />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AuthFormLayout>
          {step !== 'success' && (
            <StepProgress currentStep={getStepNumber()} steps={steps} />
          )}
          <AnimatePresence mode="wait">
            {step === 'email' && renderEmailStep()}
            {step === 'otp' && renderOTPStep()}
            {step === 'newPassword' && renderNewPasswordStep()}
            {step === 'success' && renderSuccessStep()}
          </AnimatePresence>
        </AuthFormLayout>
      </motion.div>
    </AuthCard>
  );
};

export default ForgotPasswordPage;
