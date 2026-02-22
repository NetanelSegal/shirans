import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  calculatorFormSchema,
  type CalculatorFormInput,
  type CalculatorConfigInput,
  calculateEstimate,
  DEFAULT_CALCULATOR_CONFIG,
  WHATSAPP_NUMBER,
  WHATSAPP_MESSAGE,
  formatPrice,
} from '@shirans/shared';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '@/constants/urls';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { calculatorService } from '@/services/calculator.service';

const FINISH_OPTIONS = [
  { value: 'standard', label: 'סטנדרט' },
  { value: 'invested', label: 'מושקע' },
  { value: 'premium', label: 'יוקרתי' },
] as const;

const POOL_OPTIONS = [
  { value: 'none', label: 'ללא' },
  { value: 'small', label: 'קטנה' },
  { value: 'medium', label: 'בינונית' },
  { value: 'large', label: 'גדולה' },
] as const;

const CARPENTRY_OPTIONS = [
  { value: 'none', label: 'אין' },
  { value: 'ready', label: 'קנייה מוכנה' },
  { value: 'custom', label: 'ייצור לפי הזמנה' },
] as const;

const FURNITURE_OPTIONS = [
  { value: 'none', label: 'אין' },
  { value: 'basic', label: 'בסיסי' },
  { value: 'full', label: 'מלא' },
] as const;

const PRICE_DISPLAY_OPTIONS = [
  { value: 'before_vat', label: 'לפני מע״מ' },
  { value: 'including_vat', label: 'כולל מע״מ' },
] as const;

function Select({
  label,
  options,
  error,
  value,
  onChange,
  onBlur,
  name,
  id,
}: {
  label: string;
  options: readonly { value: string; label: string }[];
  error?: { message?: string };
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: () => void;
  name: string;
  id?: string;
}) {
  const selectId = id ?? name;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={selectId} className="text-sm font-bold text-dark">
        {label}
      </label>
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`rounded-xl border p-2 ${
          error ? 'border-red-500' : 'border-gray-300'
        } bg-secondary`}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
      >
        {options.map(({ value: optValue, label: optLabel }) => (
          <option key={optValue} value={optValue}>
            {optLabel}
          </option>
        ))}
      </select>
      {error && (
        <span id={`${selectId}-error`} className="text-sm text-red-500">
          {error.message}
        </span>
      )}
    </div>
  );
}

export default function Calculator() {
  const [result, setResult] = useState<{ min: number; max: number } | null>(
    null
  );
  const [config, setConfig] = useState<CalculatorConfigInput | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    calculatorService
      .getConfig()
      .then((c) => setConfig(c ?? DEFAULT_CALCULATOR_CONFIG))
      .catch(() => setConfig(DEFAULT_CALCULATOR_CONFIG))
      .finally(() => setConfigLoading(false));
  }, []);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CalculatorFormInput>({
    resolver: zodResolver(calculatorFormSchema),
    defaultValues: {
      builtAreaSqm: 200,
      outdoorAreaSqm: 50,
      constructionFinish: 'standard',
      pool: 'none',
      outdoorFinish: 'standard',
      kitchen: 'standard',
      carpentry: 'none',
      furniture: 'none',
      equipment: 'none',
      priceDisplay: 'including_vat',
    },
  });

  const priceDisplay = watch('priceDisplay');

  const effectiveConfig = config ?? DEFAULT_CALCULATOR_CONFIG;

  const onSubmit = async (data: CalculatorFormInput) => {
    const estimate = calculateEstimate(data, effectiveConfig);
    setResult(estimate);
    setSubmitError(null);
    setSubmitLoading(true);
    try {
      await calculatorService.submitLead({
        ...data,
        estimateMin: estimate.min,
        estimateMax: estimate.max,
      });
    } catch {
      setSubmitError('שמירת הליד נכשלה. החישוב הוצג בהצלחה.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

  if (configLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center" dir="rtl">
        <span>טוען מחשבון...</span>
      </div>
    );
  }

  return (
    <main dir="rtl" className="mx-auto max-w-3xl py-10" aria-label="מחשבון אומדן עלות לבנייה פרטית">
      <Helmet>
        <title>מחשבון אומדן עלות - שירן גלעד אדריכלות ועיצוב פנים</title>
        <meta
          name="description"
          content="חשבו אומדן עלות לבנייה פרטית. הזינו פרטים וקבלו טווח מחירים משוער."
        />
        <meta property="og:title" content="מחשבון אומדן עלות - שירן גלעד" />
        <meta property="og:url" content={`${BASE_URL}/calculator`} />
      </Helmet>

      <h1 className="heading mb-8 text-center font-bold">
        מחשבון אומדן עלות לבנייה פרטית
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-8"
        noValidate
      >
        <section
          className="rounded-xl bg-secondary/30 p-6"
          aria-labelledby="user-details-heading"
        >
          <h2 id="user-details-heading" className="mb-4 text-xl font-semibold">
            פרטי התקשרות
          </h2>
          <div className="grid gap-4 md:grid-cols-1">
            <Input
              id="calculator-name"
              label="שם מלא"
              type="text"
              {...register('name')}
              error={errors.name}
              autoComplete="name"
            />
            <Input
              id="calculator-phone"
              label="מספר טלפון"
              type="tel"
              {...register('phoneNumber')}
              error={errors.phoneNumber}
              autoComplete="tel"
            />
            <Input
              id="calculator-email"
              label="כתובת אימייל"
              type="email"
              {...register('email')}
              error={errors.email}
              autoComplete="email"
            />
          </div>
        </section>

        <section
          className="rounded-xl bg-secondary/30 p-6"
          aria-labelledby="building-details-heading"
        >
          <h2 id="building-details-heading" className="mb-4 text-xl font-semibold">
            פרטי הבנייה
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              id="calculator-built-area"
              label="שטח בנוי במ״ר (160–500)"
              type="number"
              {...register('builtAreaSqm', { valueAsNumber: true })}
              error={errors.builtAreaSqm}
              min={160}
              max={500}
            />
            <Controller
              name="constructionFinish"
              control={control}
              render={({ field }) => (
                <Select
                  label="רמת גמר בנייה"
                  options={FINISH_OPTIONS}
                  error={errors.constructionFinish}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
            <Controller
              name="pool"
              control={control}
              render={({ field }) => (
                <Select
                  label="בריכה"
                  options={POOL_OPTIONS}
                  error={errors.pool}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
            <Input
              id="calculator-outdoor-area"
              label="שטח פיתוח חוץ במ״ר"
              type="number"
              {...register('outdoorAreaSqm', { valueAsNumber: true })}
              error={errors.outdoorAreaSqm}
              min={0}
            />
            <Controller
              name="outdoorFinish"
              control={control}
              render={({ field }) => (
                <Select
                  label="רמת גמר פיתוח"
                  options={FINISH_OPTIONS}
                  error={errors.outdoorFinish}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
            <Controller
              name="kitchen"
              control={control}
              render={({ field }) => (
                <Select
                  label="מטבח"
                  options={FINISH_OPTIONS}
                  error={errors.kitchen}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
            <Controller
              name="carpentry"
              control={control}
              render={({ field }) => (
                <Select
                  label="נגרות כללית"
                  options={CARPENTRY_OPTIONS}
                  error={errors.carpentry}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
            <Controller
              name="furniture"
              control={control}
              render={({ field }) => (
                <Select
                  label="ריהוט"
                  options={FURNITURE_OPTIONS}
                  error={errors.furniture}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
            <Controller
              name="equipment"
              control={control}
              render={({ field }) => (
                <Select
                  label="אבזור והלבשה"
                  options={FURNITURE_OPTIONS}
                  error={errors.equipment}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
          </div>
        </section>

        <fieldset
          className="rounded-xl bg-secondary/30 p-6"
          aria-labelledby="price-display-legend"
        >
          <legend id="price-display-legend" className="mb-4 text-xl font-semibold">
            הצגת מחירים
          </legend>
          <div className="flex flex-wrap gap-4">
            {PRICE_DISPLAY_OPTIONS.map(({ value, label }) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-2"
              >
                <input
                  type="radio"
                  value={value}
                  {...register('priceDisplay')}
                  className="h-4 w-4"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {submitError && (
          <p className="text-sm text-amber-600" role="alert">
            {submitError}
          </p>
        )}
        <Button
          type="submit"
          variant="primary"
          className="w-full md:w-auto"
          disabled={submitLoading}
        >
          {submitLoading ? 'שומר...' : 'הצגת אומדן תקציב'}
        </Button>
      </form>

      {result && (
        <section
          className="mt-10 rounded-xl bg-primary/10 p-6"
          aria-live="polite"
          aria-label="תוצאת החישוב"
        >
          <h2 className="mb-4 text-xl font-semibold">אומדן תקציב</h2>
          <p className="mb-6 text-2xl font-bold">
            ₪ {formatPrice(result.min)} – ₪ {formatPrice(result.max)}
          </p>
          <p className="mb-4 text-sm text-gray-600">
            {priceDisplay === 'including_vat'
              ? 'המחירים כוללים מע״מ'
              : 'המחירים לפני מע״מ'}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
            aria-label="לקביעת פגישת היכרות בוואטסאפ"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
              aria-hidden
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            לקביעת פגישת היכרות בוואטסאפ
          </a>
        </section>
      )}
    </main>
  );
}
