import { useScreenContext } from '@/contexts/ScreenProvider';
import { envConfig } from '@/config/env';

export default function HeroVideo() {
    const { isSmallScreen } = useScreenContext();
    const videoSrc = isSmallScreen
        ? envConfig.heroVideos.mobile
        : envConfig.heroVideos.desktop;
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
