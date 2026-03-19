import { useState, useEffect, useMemo, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createCalculatorFormSchema,
  type CalculatorFormInput,
  type CalculatorConfigInput,
  calculateEstimate,
  formatPrice,
  ERROR_KEYS,
} from '@shirans/shared';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import {
  FINISH_OPTIONS,
  POOL_OPTIONS,
  CARPENTRY_OPTIONS,
  FURNITURE_OPTIONS,
} from './constants';
import { info } from '@/data/contact-info';
import { ENUM_LABELS_HE } from '@/constants/calculatorLabels';
import { transformError } from '@/utils/errorHandler';
import { getClientErrorMessage, ERROR_MESSAGES } from '@/constants/errorMessages';
import type { ErrorKey } from '@shirans/shared';

export interface CalculatorFormProps {
  config: CalculatorConfigInput;
  onSubmit: (data: CalculatorFormInput, estimate: number) => Promise<void>;
}

export function CalculatorForm({ config, onSubmit }: CalculatorFormProps) {
  const schema = useMemo(() => createCalculatorFormSchema(config), [config]);

  const {
    trigger,
    getValues,
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      phoneNumber: '',
      email: '',
      builtAreaSqm: undefined,
      outdoorAreaSqm: undefined,
      constructionFinish: '',
      pool: '',
      outdoorFinish: '',
      kitchen: '',
      carpentry: '',
      furniture: '',
      equipment: '',
    },
  });

  const watchedValues = watch();
  const [liveEstimate, setLiveEstimate] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const pendingScrollRef = useRef(false);

  const { min: builtMin, max: builtMax } = config.builtAreaSqmRange;

  const isFormValid = isValid && liveEstimate !== null;

  useEffect(() => {
    const built = watchedValues.builtAreaSqm;
    const outdoor = watchedValues.outdoorAreaSqm;
    const hasValidNumbers =
      typeof built === 'number' &&
      !Number.isNaN(built) &&
      built >= builtMin &&
      built <= builtMax &&
      typeof outdoor === 'number' &&
      !Number.isNaN(outdoor) &&
      outdoor >= 0;
    const hasValidSelects =
      watchedValues.constructionFinish !== '' &&
      watchedValues.pool !== '' &&
      watchedValues.outdoorFinish !== '' &&
      watchedValues.kitchen !== '' &&
      watchedValues.carpentry !== '' &&
      watchedValues.furniture !== '' &&
      watchedValues.equipment !== '';
    const hasValidContact =
      watchedValues.name?.trim().length >= 2 &&
      watchedValues.phoneNumber?.length === 10 &&
      /^\d+$/.test(watchedValues.phoneNumber ?? '') &&
      watchedValues.email?.includes('@');

    if (hasValidNumbers && hasValidSelects && hasValidContact) {
      const estimate = calculateEstimate(watchedValues as CalculatorFormInput, config);
      setLiveEstimate(estimate);
    } else {
      setLiveEstimate(null);
    }
  }, [watchedValues, config, builtMin, builtMax]);

  const handleFormSubmit = async (data: CalculatorFormInput) => {
    const estimate = calculateEstimate(data, config);
    setSubmitError(null);
    setSubmitLoading(true);
    try {
      await onSubmit(data, estimate);
    } catch (err) {
      const appError = transformError(err);
      const key = appError.errorKey;
      const message =
        key && key in ERROR_MESSAGES
          ? getClientErrorMessage(key as ErrorKey)
          : getClientErrorMessage(ERROR_KEYS.SERVER.CALCULATOR.SUBMIT_FAILED);
      setSubmitError(message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const phoneForWhatsApp = (info.find((i) => i.icon === 'tel')?.text ?? '')
    .replace(/\D/g, '')
    .replace(/^0/, '972');

  const handleInvalid = (errs: Record<string, unknown>) => {
    scrollToFirstError(errs);
  };

  useEffect(() => {
    if (pendingScrollRef.current && Object.keys(errors).length > 0) {
      scrollToFirstError(errors as Record<string, unknown>);
      pendingScrollRef.current = false;
    }
  }, [errors]);

  return (
    <>
      <form
        onSubmit={handleSubmit(handleFormSubmit, handleInvalid)}
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
          <div className="grid gap-4 md:grid-cols-1 items-end">
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
              label={`שטח בנוי במ״ר (${builtMin}–${builtMax})`}
              type="number"
              {...register('builtAreaSqm', { valueAsNumber: true })}
              error={errors.builtAreaSqm}
              min={builtMin}
              max={builtMax}
            />
            <Controller
              name="constructionFinish"
              control={control}
              render={({ field }) => (
                <Select
                  id="calculator-construction-finish"
                  label="רמת גמר בנייה"
                  options={FINISH_OPTIONS}
                  placeholder="בחר רמת גמר"
                  error={errors.constructionFinish ? { message: errors.constructionFinish.message } : undefined}
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
                  id="calculator-pool"
                  label="בריכה"
                  options={POOL_OPTIONS}
                  placeholder="בחר בריכה"
                  error={errors.pool ? { message: errors.pool.message } : undefined}
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
                  id="calculator-outdoor-finish"
                  label="רמת גמר פיתוח"
                  options={FINISH_OPTIONS}
                  placeholder="בחר רמת גמר"
                  error={errors.outdoorFinish ? { message: errors.outdoorFinish.message } : undefined}
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
                  id="calculator-kitchen"
                  label="מטבח"
                  options={FINISH_OPTIONS}
                  placeholder="בחר מטבח"
                  error={errors.kitchen ? { message: errors.kitchen.message } : undefined}
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
                  id="calculator-carpentry"
                  label="נגרות כללית"
                  options={CARPENTRY_OPTIONS}
                  placeholder="בחר נגרות"
                  error={errors.carpentry ? { message: errors.carpentry.message } : undefined}
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
                  id="calculator-furniture"
                  label="ריהוט"
                  options={FURNITURE_OPTIONS}
                  placeholder="בחר ריהוט"
                  error={errors.furniture ? { message: errors.furniture.message } : undefined}
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
                  id="calculator-equipment"
                  label="אבזור והלבשה"
                  options={FURNITURE_OPTIONS}
                  placeholder="בחר אבזור"
                  error={errors.equipment ? { message: errors.equipment.message } : undefined}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
          </div>
        </section>

        <section
          className="rounded-xl bg-primary/10 p-6"
          aria-live="polite"
          aria-label={isFormValid ? 'תוצאת החישוב' : 'מצב טרם השלמה'}
        >
          {submitError && (
            <p className="mb-4 text-sm text-amber-600" role="alert">
              {submitError}
            </p>
          )}
          <h2 className="mb-4 text-xl font-semibold">אומדן תקציב</h2>
          <p className="mb-6 text-2xl font-bold">
            {isFormValid ? `₪ ${formatPrice(liveEstimate!)}` : '₪ xxxx'}
          </p>
          {!isFormValid && (
            <p className="mb-4 text-sm text-gray-600">
              צריך להכניס את כל הפרטים כדי לראות את אומדן התקציב
            </p>
          )}
          {isFormValid && (
            <p className="mb-4 text-sm text-gray-600">המחיר לא כולל מע״מ</p>
          )}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              type="submit"
              variant="primary"
              className="w-full sm:w-auto"
              disabled={submitLoading}
            >
              {submitLoading ? 'שומר...' : 'הצגת אומדן תקציב'}
            </Button>
            {isFormValid && (
              <a
                onClick={async (e) => {
                  e.preventDefault();
                  if (!(await trigger())) {
                    pendingScrollRef.current = true;
                    return;
                  }
                  window.open(
                    getWhatsappLink(phoneForWhatsApp, getValues() as CalculatorFormInput, liveEstimate!),
                    '_blank'
                  );
                }}
                href={getWhatsappLink(phoneForWhatsApp, getValues() as CalculatorFormInput, liveEstimate!)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white transition-opacity hover-capable:hover:opacity-90"
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
            )}
          </div>
        </section>
      </form>
    </>
  );
}

const FORM_FIELD_ORDER: (keyof CalculatorFormInput)[] = [
  'name',
  'phoneNumber',
  'email',
  'builtAreaSqm',
  'constructionFinish',
  'pool',
  'outdoorAreaSqm',
  'outdoorFinish',
  'kitchen',
  'carpentry',
  'furniture',
  'equipment',
];

const FIELD_IDS: Record<keyof CalculatorFormInput, string> = {
  name: 'calculator-name',
  phoneNumber: 'calculator-phone',
  email: 'calculator-email',
  builtAreaSqm: 'calculator-built-area',
  constructionFinish: 'calculator-construction-finish',
  pool: 'calculator-pool',
  outdoorAreaSqm: 'calculator-outdoor-area',
  outdoorFinish: 'calculator-outdoor-finish',
  kitchen: 'calculator-kitchen',
  carpentry: 'calculator-carpentry',
  furniture: 'calculator-furniture',
  equipment: 'calculator-equipment',
};

function scrollToFirstError(errors: Record<string, unknown>) {
  for (const key of FORM_FIELD_ORDER) {
    if (key in errors) {
      document.getElementById(FIELD_IDS[key])?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      break;
    }
  }
}

const FIELD_LABELS_HE: Record<keyof CalculatorFormInput, string> = {
  name: 'שם',
  phoneNumber: 'טלפון',
  email: 'אימייל',
  builtAreaSqm: 'שטח בנוי (מ״ר)',
  constructionFinish: 'רמת גמר בנייה',
  pool: 'בריכה',
  outdoorAreaSqm: 'שטח פיתוח חוץ (מ״ר)',
  outdoorFinish: 'רמת גמר פיתוח',
  kitchen: 'מטבח',
  carpentry: 'נגרות כללית',
  furniture: 'ריהוט',
  equipment: 'אבזור והלבשה',
};

function formatValueForWhatsApp(value: unknown): string {
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string' && ENUM_LABELS_HE[value]) return ENUM_LABELS_HE[value];
  return String(value ?? '');
}

function getWhatsappLink(phoneNumber: string, data: CalculatorFormInput, result: number): string {
  let message = 'היי שירן השתמשתי במחשבון אומדן תקציב באתר שלך ואלה הפרטים שהזנתי.\n';
  message += 'פרטי החישוב:';
  (Object.keys(FIELD_LABELS_HE) as (keyof CalculatorFormInput)[]).forEach((key) => {
    const value = data[key];
    if (value !== undefined) {
      message += `\n${FIELD_LABELS_HE[key]}: ${formatValueForWhatsApp(value)}`;
    }
  });
  message += `\nאומדן תקציב: ₪ ${formatPrice(result)}`;
  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
