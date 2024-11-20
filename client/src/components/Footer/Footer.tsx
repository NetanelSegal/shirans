import srcShiranLogo from '@/assets/shiran_logo.svg';
import FooterForm from './components/FooterForm';
import ContactInfo from './components/ContactInfo';
import FooterNavigation from './components/FooterNavigation';

export default function Footer() {
  return (
    <footer className='px-page-all py-section-all bg-primary'>
      <div className='mb-5 xl:flex'>
        <h2 className='heading -mt-4 mb-2 pl-5 text-white xl:w-1/3'>
          מתה שנעבוד ביחד
        </h2>
        <FooterForm />
      </div>
      <div className='flex flex-col lg:flex-row-reverse lg:items-end lg:justify-between'>
        <div className='grow sm:flex sm:flex-row-reverse sm:justify-between'>
          <ContactInfo />
          <FooterNavigation />
        </div>
        <img
          className='h-full w-full object-contain p-4 lg:w-1/4'
          src={srcShiranLogo}
          alt='Shiran logo image'
        />
      </div>
    </footer>
  );
}
