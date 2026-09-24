import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ERROR_KEYS, footerFormSchema, FooterFormInput } from '@shirans/shared';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { isPreviewDeploy } from '@/config/env';
import { submitContact } from '@/services/contact.service';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import useEmailSend from './useEmailSend';

type Status = 'idle' | 'sending' | 'sent' | 'failed';

const PREVIEW_NOTICE = 'זו גרסת תצוגה — הטופס לא נשלח.';

/**
 * The lead form: name, phone, email, message. Sends to the inbox (EmailJS) and
 * the admin's contacts list at once; either one landing counts as sent.
 */
export function ContactForm({
  submitLabel = 'שליחה',
  className,
}: {
  submitLabel?: string;
  className?: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FooterFormInput>({ resolver: zodResolver(footerFormSchema) });
  const { sendEmail } = useEmailSend();
  const [status, setStatus] = useState<Status>('idle');

  const onSubmit = async (data: FooterFormInput) => {
    setStatus('sending');
    const results = await Promise.allSettled([
      sendEmail(data).then((res) => {
        if (!res) throw new Error('Email not sent');
      }),
      submitContact({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        message: data.context ?? '',
      }),
    ]);

    if (results.some((result) => result.status === 'fulfilled')) {
      setStatus('sent');
      reset();
    } else {
      setStatus('failed');
    }
  };

  const message =
    status === 'sent'
      ? 'תודה! הפרטים התקבלו ונחזור אליכם בהקדם.'
      : status === 'failed'
        ? isPreviewDeploy
          ? PREVIEW_NOTICE
          : getClientErrorMessage(ERROR_KEYS.SERVER.CONTACT.SUBMIT_FAILED)
        : null;

  return (
    <form className={cn('flex flex-col gap-3', className)} onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input label='שם מלא' required autoComplete='name' {...register('name')} error={errors.name} />
      <Input
        label='טלפון'
        type='tel'
        required
        autoComplete='tel'
        dir='rtl'
        {...register('phoneNumber')}
        error={errors.phoneNumber}
      />
      <Input label='אימייל' type='email' autoComplete='email' {...register('email')} error={errors.email} />
      <Input as='textarea' label='הודעה (אופציונלי)' rows={3} {...register('context')} error={errors.context} />

      <Button type='submit' arrow fullWidth disabled={status === 'sending'} className='mt-1'>
        {status === 'sending' ? 'שולח…' : submitLabel}
      </Button>

      <p
        role='status'
        aria-live='polite'
        className={cn(
          'min-h-5 text-center text-small',
          status === 'failed' ? 'text-danger' : 'text-success',
        )}
      >
        {message}
      </p>
    </form>
  );
}
