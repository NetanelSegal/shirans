import ClickToCopy from '@/components/ClickToCopy';
import { info as contactInfo } from '@/data/contact-info';
import getIcon from '@/utils/icons.utils';
export default function ContactInfo() {
  return (
    <div>
      {contactInfo.map(({ icon, text, url }) => (
        <div key={icon} className='mb-2 flex items-center justify-end'>
          {url ? (
            <a target='_blank' rel='noopener noreferrer' href={url}>
              <p className='font-semibold text-white'>{text}</p>
            </a>
          ) : (
            <ClickToCopy>
              <p className='font-semibold text-white'>{text}</p>
            </ClickToCopy>
          )}
          <img
            className='mr-2'
            width='30'
            src={getIcon({ icon })}
            alt={`${icon}-icon`}
          />
        </div>
      ))}
    </div>
  );
}
