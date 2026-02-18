import videoDesktop from '@/assets/hero-vid-desktop.mov';
import videoMobile from '@/assets/hero-vid-mobile.mov';
import { useScreenContext } from '@/contexts/ScreenProvider';

export default function HeroVideo() {
    const { isSmallScreen } = useScreenContext();
    const videoSrc = isSmallScreen ? videoMobile : videoDesktop;
    return (
        <div className='size-full overflow-hidden'>
            <video
                autoPlay
                muted
                loop
                playsInline
                className='size-full object-cover'
            >
                <source src={videoSrc} />
            </video>
        </div>
    )
}
