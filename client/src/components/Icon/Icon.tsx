import iconTel from '@/assets/icons/tel.svg';
import iconFacebook from '@/assets/icons/facebook.svg';
import iconInstagram from '@/assets/icons/instagram.svg';
import iconMail from '@/assets/icons/mail.svg';

const iconMap = {
  tel: iconTel,
  facebook: iconFacebook,
  instagram: iconInstagram,
  mail: iconMail,
};

export default function Icon({ icon }: { icon: keyof typeof iconMap }) {
  return iconMap[icon];
}
