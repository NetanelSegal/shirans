import { useScreenContext } from '@/contexts/ScreenProvider';

const videoSrcMobile = '/assets/hero-vid-mobile.mov';
const videoSrcDesktop = '/assets/hero-vid-desktop.mov';

export default function HeroVideo() {
    const { isSmallScreen } = useScreenContext();
    const videoSrc = isSmallScreen ? videoSrcMobile : videoSrcDesktop;
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
