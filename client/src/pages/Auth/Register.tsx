import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@shirans/shared';
import { useAuth } from '../../hooks/useAuth';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { ErrorDisplay } from '../../components/ErrorDisplay';
import { AppError } from '../../types/error.types';
import { BASE_URL } from '../../constants/urls';
import { Input } from '../../components/ui/Input';

export default function Register() {
  const [error, setError] = useState<AppError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const { register: registerUser, isAuthenticated } = useAuth();
  const { handleError } = useErrorHandler();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: RegisterInput) => {
    setError(null);
    setIsLoading(true);

    try {
      await registerUser(data.email, data.password, data.name);
      navigate('/');
    } catch (err) {
      const appError = handleError(err, 'Register');
      setError(appError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>הרשמה - שירן גלעד</title>
        <meta name="description" content="הרשמה לחשבון חדש" />
        <link rel="canonical" href={`${BASE_URL}/register`} />
      </Helmet>

      <div className="flex items-center justify-center py-section-all" dir="rtl">
        <div className="w-full max-w-md">
          <h1 className="heading mb-6 text-center">הרשמה</h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              borderColor="border-gray-300"
              label="שם מלא"
              type="text"
              {...register('name')}
              error={errors.name}
              autoComplete="name"
            />
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
              autoComplete="new-password"
            />

            {error && <ErrorDisplay error={error} />}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-primary p-3 font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? 'נרשם...' : 'הירשם'}
            </button>

            <div className="text-center">
              <Link to="/login" className="text-primary underline">
                יש לך כבר חשבון? התחבר כאן
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
