import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { footerFormSchema, FooterFormInput } from '@shirans/shared';
import useEmailSend from '../hooks/useEmailSend';
import { Input } from '../../ui/Input';
import Button from '../../ui/Button';

export default function FooterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FooterFormInput>({
    resolver: zodResolver(footerFormSchema),
  });
  const { error, sendEmail, loading, success } = useEmailSend();

  const onSubmit = async (data: FooterFormInput) => {
    await sendEmail(data);
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
        <Button variant={error ? 'danger' : success ? 'success' : 'secondary'} type='submit'>
          {loading ? 'שולח מייל' : success ? 'ההודעה נשלחה בהצלחה' : error ? error : 'שלח'}
        </Button>
      </div>
    </form>
  );
}
