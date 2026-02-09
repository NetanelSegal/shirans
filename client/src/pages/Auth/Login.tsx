import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginInput } from '@shirans/shared';
import { useAuth } from '../../hooks/useAuth';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { ErrorDisplay } from '../../components/ErrorDisplay';
import { AppError } from '../../types/error.types';
import { BASE_URL } from '../../constants/urls';
import { Input } from '../../components/ui/Input';

export default function Login() {
  const [error, setError] = useState<AppError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const { login, isAuthenticated } = useAuth();
  const { handleError } = useErrorHandler();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    setIsLoading(true);

    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      const appError = handleError(err, 'Login');
      setError(appError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>התחברות - שירן גלעד</title>
        <meta name="description" content="התחברות לחשבון" />
        <link rel="canonical" href={`${BASE_URL}/login`} />
      </Helmet>

      <div className="flex items-center justify-center py-section-all" dir="rtl">
        <div className="w-full max-w-md">
          <h1 className="heading mb-6 text-center">התחברות</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              borderColor="border-gray-300"
              label="כתובת אימייל"
              type="email"
              {...register('email')}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              borderColor="border-gray-300"
              label="סיסמה"
              type="password"
              {...register('password')}
              error={errors.password}
              autoComplete="current-password"
            />

            {error && <ErrorDisplay error={error} />}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-primary p-3 font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? 'מתחבר...' : 'התחבר'}
            </button>

            <div className="text-center">
              <Link to="/register" className="text-primary underline">
                אין לך חשבון? הירשם כאן
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
