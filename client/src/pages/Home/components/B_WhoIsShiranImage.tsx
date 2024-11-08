import Image from '@/components/Image';
import srcShiranImage from '../assets/shiranImage.png';

export default function WhoIsShiranImage() {
  return (
    <div
      className={`max-h-[700px] overflow-hidden rounded-b-[100%] rounded-t-full`}
    >
      <Image
        style={{ clipPath: 'url(#clipPath)' }}
        className='size-full object-cover'
        src={srcShiranImage}
        alt='Image of Shiran'
      />
    </div>
  );
}
