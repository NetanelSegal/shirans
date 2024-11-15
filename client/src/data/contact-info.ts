import { IIcon } from '../utils/icons.utils';

interface IContactInfo {
  icon: IIcon;
  text: string;
  url?: string;
}

export const info: IContactInfo[] = [
  {
    icon: 'tel',
    text: '052-5174443',
  },
  {
    icon: 'mail',
    text: 'Studioimpact.shiran@gmail.com',
  },
  {
    icon: 'facebook',
    text: 'Shiran_gilad',
    url: 'https://www.facebook.com/shiran.gilad.94',
  },
  {
    icon: 'instagram',
    text: 'Shiran_gilad',
    url: 'https://www.instagram.com/shiran_gilad/',
  },
];
