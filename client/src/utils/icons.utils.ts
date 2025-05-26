import iconTel from '@/assets/icons/tel.svg';
import iconFacebook from '@/assets/icons/facebook.svg';
import iconInstagram from '@/assets/icons/instagram.svg';
import iconMail from '@/assets/icons/mail.svg';

import house from '@/assets/icons/house-solid.svg';
import couch from '@/assets/icons/couch-solid.svg';
import newspaper from '@/assets/icons/newspaper-solid.svg';
import archway from '@/assets/icons/archway-solid.svg';
import city from '@/assets/icons/city-solid.svg';
import comments from '@/assets/icons/comments-solid.svg';
import { ServiceName } from '@/pages/Home/sections/E_ServicesSection';

const servicesIcons: Record<ServiceName, string> = {
  'private-construction': house,
  'commercial-design': couch,
  licensing: newspaper,
  'residential-design': city,
  'luxury-design': archway,
  consulting: comments,
} as const;

const iconMap = {
  tel: iconTel,
  facebook: iconFacebook,
  instagram: iconInstagram,
  mail: iconMail,
};

export type IIcon = keyof typeof iconMap | keyof typeof servicesIcons;

export default function getIcon({ icon }: { icon: IIcon }) {
  return icon in iconMap
    ? iconMap[icon as keyof typeof iconMap]
    : servicesIcons[icon as keyof typeof servicesIcons];
}
