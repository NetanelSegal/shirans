import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../hooks/useAuth';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { ErrorDisplay } from '../../components/ErrorDisplay';
import { AppError } from '../../types/error.types';
import { BASE_URL } from '../../constants/urls';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<AppError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({ name: false, email: false, password: false });

  const { register } = useAuth();
  const { handleError } = useErrorHandler();
  const navigate = useNavigate();

  const handleInputFocus = (e: ChangeEvent<HTMLInputElement>) => {
    setIsFocused((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleInputBlur = (e: ChangeEvent<HTMLInputElement>) => {
    setIsFocused((prev) => ({ ...prev, [e.target.name]: false }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await register(email, password, name);
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

      <div className="min-h-screen flex items-center justify-center px-page-all py-section-all" dir="rtl">
        <div className="w-full max-w-md">
          <h1 className="heading mb-6 text-center">הרשמה</h1>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <label
                htmlFor="name"
                className={`absolute right-2 top-2 rounded-md bg-secondary px-2 font-bold shadow-md transition-all duration-150 ease-in-out ${
                  isFocused.name || name !== '' ? '-translate-y-3/4' : ''
                }`}
              >
                שם מלא
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full rounded-xl p-2"
                required
                autoComplete="name"
                minLength={2}
                maxLength={50}
              />
            </div>

            <div className="relative">
              <label
                htmlFor="email"
                className={`absolute right-2 top-2 rounded-md bg-secondary px-2 font-bold shadow-md transition-all duration-150 ease-in-out ${
                  isFocused.email || email !== '' ? '-translate-y-3/4' : ''
                }`}
              >
                כתובת אימייל
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full rounded-xl p-2"
                required
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <label
                htmlFor="password"
                className={`absolute right-2 top-2 rounded-md bg-secondary px-2 font-bold shadow-md transition-all duration-150 ease-in-out ${
                  isFocused.password || password !== '' ? '-translate-y-3/4' : ''
                }`}
              >
                סיסמה
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full rounded-xl p-2"
                required
                autoComplete="new-password"
                minLength={8}
              />
            </div>

            {error && <ErrorDisplay error={error} />}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-primary p-3 font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? 'נרשם...' : 'הירשם'}
            </button>

            <div className="text-center">
              <a href="/login" className="text-primary underline">
                יש לך כבר חשבון? התחבר כאן
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
