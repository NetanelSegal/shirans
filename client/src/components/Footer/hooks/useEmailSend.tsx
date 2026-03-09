import { useEffect, useState } from 'react';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { ERROR_KEYS } from '@shirans/shared';
import { getClientErrorMessage } from '@/constants/errorMessages';
import { envConfig, isEmailJsContactConfigured } from '@/config/env';

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
      const { serviceId, templateId, publicKey } = envConfig.emailjs;
      if (!isEmailJsContactConfigured()) {
        throw new Error('EmailJS environment variables are not configured');
      }
      const res = await emailjs.send(serviceId, templateId, data, { publicKey });
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
    if (envConfig.emailjs.publicKey) {
      emailjs.init({ publicKey: envConfig.emailjs.publicKey });
    }
  }, []);
  return { error, sendEmail, loading, success };
}
