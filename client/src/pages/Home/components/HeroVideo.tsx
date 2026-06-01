import { useScreenContext } from '@/contexts/ScreenProvider';
import { envConfig } from '@/config/env';
import {
  useCallback,
  useEffect,
  useState,
  type ImgHTMLAttributes,
} from 'react';
import { Helmet } from 'react-helmet-async';
import heroMobilePoster from '@/assets/mobile-video-0-frame.webp';
import heroDesktopPoster from '@/assets/desktop-video-0-frame.webp';

const IDLE_VIDEO_TIMEOUT_MS = 2000;

export default function HeroVideo() {
  const { isSmallScreen } = useScreenContext();
  const videoSrc = isSmallScreen
    ? envConfig.heroVideos.mobile
    : envConfig.heroVideos.desktop;
  const posterSrc = isSmallScreen ? heroMobilePoster : heroDesktopPoster;
  const [showVideo, setShowVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    setShowVideo(false);
    setVideoReady(false);
    setVideoFailed(false);
  }, [videoSrc]);

  useEffect(() => {
    if (typeof requestIdleCallback === 'undefined') {
      const timeoutId = window.setTimeout(() => setShowVideo(true), 500);
      return () => window.clearTimeout(timeoutId);
    }

    const idleId = requestIdleCallback(() => setShowVideo(true), {
      timeout: IDLE_VIDEO_TIMEOUT_MS,
    });
    return () => cancelIdleCallback(idleId);
  }, [videoSrc]);

  const handleVideoReady = useCallback(() => {
    setVideoReady(true);
  }, []);

  const handleVideoError = useCallback(() => {
    setVideoFailed(true);
    setVideoReady(false);
  }, []);

  const showPoster = !videoReady || videoFailed;
  const canPlayVideo = showVideo && Boolean(videoSrc) && !videoFailed;

  const posterImgProps = {
    alt: '',
    'aria-hidden': true as const,
    width: 1920,
    height: 1080,
    loading: 'eager' as const,
    decoding: 'async' as const,
    ...({ fetchpriority: 'high' } as ImgHTMLAttributes<HTMLImageElement>),
    className: `absolute inset-0 size-full object-cover transition-opacity duration-500 ${
      showPoster ? 'opacity-100' : 'pointer-events-none opacity-0'
    }`,
  };

  return (
    <div className="relative size-full overflow-hidden">
      <Helmet>
        <link rel="preload" as="image" href={posterSrc} fetchPriority="high" />
      </Helmet>
      <picture className="absolute inset-0 size-full">
        <source
          media="(max-width: 767px)"
          srcSet={heroMobilePoster}
          type="image/webp"
        />
        <source
          media="(min-width: 768px)"
          srcSet={heroDesktopPoster}
          type="image/webp"
        />
        <img src={posterSrc} {...posterImgProps} />
      </picture>
      {canPlayVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={posterSrc}
          onCanPlay={handleVideoReady}
          onError={handleVideoError}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${
            videoReady ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={videoSrc} />
        </video>
      )}
    </div>
  );
}
