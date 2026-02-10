import { useEffect, useState } from 'react';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

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
      const res = await emailjs.send(
        'service_qowi0kn',
        'shiran_contact_form',
        data,
      );
      setSuccess(true);
      return res;
    } catch (error) {
      console.error(error);
      setError('שגיאה - נא נסה שוב מאוחר יותר');
      setSuccess(false);
    } finally {
      setLoading(false);
      setTimeout(() => setError(''), 5000);
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  useEffect(() => {
    emailjs.init({
      publicKey: '6CI1z7b1xE3KIliQo',
    });
  }, []);
  return { error, sendEmail, loading, success };
}
