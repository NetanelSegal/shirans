import Image from '@/components/ui/Image';
import srcShiranImage from '../assets/shiranImage.jpeg';

export default function WhoIsShiranImage() {
  return (
    <div className={`max-h-[700px] overflow-hidden rounded-3xl`}>
      <Image
        className='size-full object-cover'
        src={srcShiranImage}
        alt='שירן גלעד - אדריכלית ומעצבת פנים'
      />
    </div>
  );
}
