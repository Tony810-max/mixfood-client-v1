
import { useUiText } from '@/contexts/LanguageContext';

import { AuthCard, AuthFormLayout, AuthHeader, AuthLogo } from "@/components/auth";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { STORAGE_KEYS } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLoginErrorMessage, useLogin } from "@/hooks/api/useAuth";
import { loginSchema, type LoginFormData } from "@/lib/validation";
import { ROUTES } from "@/utils/const";
import { authStorage } from "@/utils/storage";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const ui = useUiText();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const loginMutation = useLogin();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    setErrors(prev => ({ ...prev, [field]: "" }));
    setLoginError(null);
  };

  const handleLogin = async (e?: React.FormEvent) => {
    // Prevent default form submission if event is provided
    if (e) {
      e.preventDefault();
    }

    console.log('[Login] handleLogin called');
    // Clear previous login error
    setLoginError(null);

    // Validate form using zod
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      console.log('[Login] Validation failed:', result.error);
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof LoginFormData;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    console.log('[Login] Validation passed, calling mutation');
    try {
      const response = await loginMutation.mutateAsync({ payload: { email: formData.email, password: formData.password }, remember: rememberMe });

      // Set user data from response
      const userData = response.user || {
        id: 1,
        email: formData.email,
        name: formData.email.split('@')[0],
        role: 'USER',
      };
      console.log('[Login] Setting user:', userData);
      console.log('[Login] Response tokens:', {
        accessToken: response.accessToken ? 'exists' : 'missing',
        refreshToken: response.refreshToken ? 'exists' : 'missing',
      });
      setUser(userData);

      // Save user data to storage (same location as tokens)
      const location: 'local' | 'session' = rememberMe ? 'local' : 'session';
      console.log('[Login] Saving user to storage, location:', location);
      authStorage.setUser(userData, location);
      console.log('[Login] User saved, checking storage:', authStorage.getUser());

      // Verify tokens are stored
      console.log('[Login] Checking stored tokens:', {
        accessToken_local: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ? 'exists' : 'missing',
        accessToken_session: sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ? 'exists' : 'missing',
        refreshToken_local: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ? 'exists' : 'missing',
        refreshToken_session: sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) ? 'exists' : 'missing',
      });

      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('[Login] Error caught in handleLogin:', error);
      // Set error state to display on form using the same error handling as toast
      const errorMessage = getLoginErrorMessage(error);
      setLoginError(errorMessage);
    }
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
          <AuthHeader
            title={t.loginTitle}
            subtitle={t.loginSubtitle}
          />
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                <p className="text-sm">{loginError}</p>
              </div>
            )}
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
                  className={`pl-10 h-11 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-orange-200 dark:border-orange-900 focus:border-orange-400 focus:ring-orange-400'}`}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                {t.loginPassword}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t.loginPasswordPlaceholder}
                  className={`pl-10 pr-10 h-11 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-orange-200 dark:border-orange-900 focus:border-orange-400 focus:ring-orange-400'}`}
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {t.rememberMe}
                </label>
              </div>
              <Link
                to={ROUTES.AUTH.FORGOT_PASSWORD}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
              >
                {t.forgotPassword}
              </Link>
            </div>
            <Button
              className="w-full h-11 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
              size="lg"
              type="submit"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? t.loginSigningIn : t.loginButton}
            </Button>
          </form>
          <div className="flex flex-col space-y-4 pt-6">
            <div className="text-center text-sm">
              <span className="text-muted-foreground">{t.noAccount} </span>
              <Link
                to={ROUTES.AUTH.REGISTER}
                className="font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
              >
                {t.registerLink}
              </Link>
            </div>
          </div>
        </AuthFormLayout>
      </motion.div>
    </AuthCard>
  );
};

export default LoginPage;
