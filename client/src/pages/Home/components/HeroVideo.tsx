import { useScreenContext } from '@/contexts/ScreenProvider';
import { envConfig } from '@/config/env';
import { useCallback, useEffect, useState, type ImgHTMLAttributes } from 'react';
import heroMobilePoster from '@/assets/mobile-video-0-frame.jpg';
import heroDesktopPoster from '@/assets/desktop-video-0-frame.jpg';

export default function HeroVideo() {
  const { isSmallScreen } = useScreenContext();
  const videoSrc = isSmallScreen
    ? envConfig.heroVideos.mobile
    : envConfig.heroVideos.desktop;
  const posterSrc = isSmallScreen ? heroMobilePoster : heroDesktopPoster;
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    setVideoReady(false);
    setVideoFailed(false);
  }, [videoSrc]);

  const handleVideoReady = useCallback(() => {
    setVideoReady(true);
  }, []);

  const handleVideoError = useCallback(() => {
    setVideoFailed(true);
    setVideoReady(false);
  }, []);

  const showPoster = !videoReady || videoFailed;
  const canPlayVideo = Boolean(videoSrc) && !videoFailed;

  return (
    <div className="relative size-full overflow-hidden">
      <img
        src={posterSrc}
        alt=""
        aria-hidden
        {...({ fetchpriority: 'high' } as ImgHTMLAttributes<HTMLImageElement>)}
        loading="eager"
        decoding="async"
        className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${
          showPoster ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      {canPlayVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={posterSrc}
          onCanPlay={handleVideoReady}
          onError={handleVideoError}
          className={`size-full object-cover transition-opacity duration-500 ${
            videoReady ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={videoSrc} />
        </video>
      )}
    </div>
  );
}
