import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { footerFormSchema, FooterFormInput } from '@shirans/shared';
import { ERROR_KEYS } from '@shirans/shared';
import useEmailSend from '../hooks/useEmailSend';
import { submitContact } from '../../../services/contact.service';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { Input } from '../../ui/Input';
import Button from '../../ui/Button';

export default function FooterForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FooterFormInput>({
    resolver: zodResolver(footerFormSchema),
  });
  const { sendEmail } = useEmailSend();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: FooterFormInput) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    const emailPromise = sendEmail(data);
    const apiPromise = submitContact({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      message: data.context ?? '',
    });

    const results = await Promise.allSettled([emailPromise, apiPromise]);
    const emailOk = results[0].status === 'fulfilled';
    const apiOk = results[1].status === 'fulfilled';
    const atLeastOneSucceeded = emailOk || apiOk;

    setLoading(false);
    if (atLeastOneSucceeded) {
      setSuccess(true);
      setError('');
      reset();
      setTimeout(() => setSuccess(false), 5000);
    } else {
      setError(getClientErrorMessage(ERROR_KEYS.SERVER.CONTACT.SUBMIT_FAILED));
      setTimeout(() => setError(''), 5000);
    }
  };

  return (
    <form
      className="flex w-full flex-col gap-2 md:flex-row"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex grow flex-col gap-2">
        <Input
          label="שם מלא"
          type="text"
          {...register('name')}
          error={errors.name}
          autoComplete="name"
        />
        <Input
          label="מספר טלפון"
          type="tel"
          {...register('phoneNumber')}
          error={errors.phoneNumber}
          autoComplete="tel"
        />
        <Input
          label="כתובת מייל"
          type="email"
          {...register('email')}
          error={errors.email}
          autoComplete="email"
        />
      </div>

      <div className="flex grow flex-col md:gap-2">
        <Input
          as="textarea"
          label="הערות"
          {...register('context')}
          error={errors.context}
          rows={5}
        />
        <Button
          variant={error ? 'danger' : success ? 'success' : 'secondary'}
          type="submit"
          disabled={loading}
        >
          {loading ? 'שולח מייל' : success ? 'ההודעה נשלחה בהצלחה' : error ? error : 'שלח'}
        </Button>
      </div>
    </form>
  );
}
