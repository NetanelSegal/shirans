import iconTel from '@/assets/icons/tel.svg';
import iconFacebook from '@/assets/icons/facebook.svg';
import iconInstagram from '@/assets/icons/instagram.svg';
import iconMail from '@/assets/icons/mail.svg';

export type IIcon = keyof typeof iconMap;

const iconMap = {
  tel: iconTel,
  facebook: iconFacebook,
  instagram: iconInstagram,
  mail: iconMail,
};

export default function getIcon({ icon }: { icon: IIcon }) {
  return iconMap[icon];
}
