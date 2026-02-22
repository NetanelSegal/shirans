import { useEffect, useState } from 'react';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { ERROR_KEYS } from '@shirans/shared';
import { getClientErrorMessage } from '@/constants/errorMessages';

interface IReturnUseEmailSend {
  error: string;
  sendEmail: (data: Record<string, unknown>) => Promise<EmailJSResponseStatus | undefined>;
  loading: boolean;
  success: boolean;
}

export default function useEmailSend(): IReturnUseEmailSend {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const sendEmail = async (data: Record<string, unknown>) => {
    setLoading(true);
    setError('');
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS environment variables are not configured');
      }
      const res = await emailjs.send(serviceId, templateId, data);
      setSuccess(true);
      return res;
    } catch (err) {
      console.error(err);
      setError(getClientErrorMessage(ERROR_KEYS.SERVER.CONTACT.SUBMIT_FAILED));
      setSuccess(false);
    } finally {
      setLoading(false);
      setTimeout(() => setError(''), 5000);
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  useEffect(() => {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      emailjs.init({ publicKey });
    }
  }, []);
  return { error, sendEmail, loading, success };
}
