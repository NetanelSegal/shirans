import {
  Home,
  Sparkles,
  Crown,
  Droplets,
  Hammer,
  Package,
  Sofa,
  Armchair,
  CircleSlash,
} from 'lucide-react';
import type { SelectOption } from '@/components/ui/Select';

const iconSize = 18;

/** Calculator form option labels (Hebrew) — values match shared schema enums */
export const FINISH_OPTIONS: readonly SelectOption<string>[] = [
  { value: 'standard', label: 'סטנדרט', icon: <Home size={iconSize} /> },
  { value: 'invested', label: 'מושקע', icon: <Sparkles size={iconSize} /> },
  { value: 'premium', label: 'יוקרתי', icon: <Crown size={iconSize} /> },
];

export const POOL_OPTIONS: readonly SelectOption<string>[] = [
  { value: 'none', label: 'ללא', icon: <CircleSlash size={iconSize} /> },
  { value: 'small', label: 'קטנה', icon: <Droplets size={iconSize} /> },
  { value: 'medium', label: 'בינונית', icon: <Droplets size={iconSize} /> },
  { value: 'large', label: 'גדולה', icon: <Droplets size={iconSize} /> },
];

export const CARPENTRY_OPTIONS: readonly SelectOption<string>[] = [
  { value: 'none', label: 'אין', icon: <CircleSlash size={iconSize} /> },
  { value: 'ready', label: 'קנייה מוכנה', icon: <Package size={iconSize} /> },
  { value: 'custom', label: 'ייצור לפי הזמנה', icon: <Hammer size={iconSize} /> },
];

export const FURNITURE_OPTIONS: readonly SelectOption<string>[] = [
  { value: 'none', label: 'אין', icon: <CircleSlash size={iconSize} /> },
  { value: 'basic', label: 'בסיסי', icon: <Sofa size={iconSize} /> },
  { value: 'full', label: 'מלא', icon: <Armchair size={iconSize} /> },
];
