import ClickToCopy from '@/components/ui/ClickToCopy';
import { info as contactInfo } from '@/data/contact-info';
import getIcon from '@/utils/icons.utils';
const linkAriaLabels: Partial<Record<string, string>> = {
  facebook: 'שירן גלעד בפייסבוק',
  instagram: 'שירן גלעד באינסטגרם',
};

export default function ContactInfo() {
  return (
    <div>
      {contactInfo.map(({ icon, text, url }) => (
        <div key={icon} className='mb-2 flex items-center justify-end'>
          {url ? (
            <a
              target='_blank'
              rel='noopener noreferrer'
              href={url}
              aria-label={linkAriaLabels[icon] ?? text}
            >
              <p className='font-semibold text-white'>{text}</p>
            </a>
          ) : (
            <ClickToCopy>
              <p className='font-semibold text-white'>{text}</p>
            </ClickToCopy>
          )}
          <img
            className='mr-2'
            width={30}
            height={30}
            src={getIcon({ icon })}
            alt=""
            aria-hidden
          />
        </div>
      ))}
    </div>
  );
}
