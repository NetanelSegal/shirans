import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock } from 'lucide-react';
import { costCalculatorContactSchema } from '@shirans/shared';
import type { CostCalculatorContact } from '@shirans/shared';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { StepNav } from '../StepNav';

interface ContactStepProps {
  onBack: () => void;
  onSubmit: (contact: CostCalculatorContact) => Promise<void> | void;
  isSubmitting: boolean;
  submitError: string | null;
}

export function ContactStep({
  onBack,
  onSubmit,
  isSubmitting,
  submitError,
}: ContactStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CostCalculatorContact>({
    resolver: zodResolver(costCalculatorContactSchema),
    defaultValues: { name: '', phoneNumber: '', email: '', marketingConsent: false },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        label="שם מלא"
        borderColor="border-gray-300"
        autoComplete="name"
        error={errors.name}
        {...register('name')}
      />
      <Input
        label="טלפון"
        type="tel"
        inputMode="numeric"
        borderColor="border-gray-300"
        autoComplete="tel"
        error={errors.phoneNumber}
        {...register('phoneNumber')}
      />
      <Input
        label="אימייל"
        type="email"
        borderColor="border-gray-300"
        autoComplete="email"
        error={errors.email}
        {...register('email')}
      />

      <Checkbox
        label="אני מאשר/ת לקבל עדכונים ותוכן מקצועי משירן."
        {...register('marketingConsent')}
      />

      {submitError && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {submitError}
        </p>
      )}

      <StepNav
        onBack={onBack}
        nextType="submit"
        nextLabel={isSubmitting ? 'שולח...' : 'לקבלת ההערכה'}
        nextDisabled={isSubmitting}
      />

      <div className="mt-2 flex flex-col items-center gap-2 text-center">
        <Lock className="size-5 text-primary/60" aria-hidden />
        <p className="text-sm text-primary/60">
          הפרטים שלכם נשמרים אצלנו בלבד ולא יועברו לגורמים שלישיים.
        </p>
      </div>
    </form>
  );
}
