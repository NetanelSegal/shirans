import EnterAnimation from '@/components/animations/EnterAnimation';
import HeroVideo from '../components/HeroVideo';

export default function HeroSection() {
  return (
    <section className='breakout-x-padding relative -z-50 h-[75dvh] overflow-hidden 2xl:-mx-page-2xl'>
      <HeroVideo />
      <EnterAnimation delay={0.5} duration={1.2} translateY={false}>
        <h1 className='px-page-all absolute inset-0 m-auto size-fit text-center text-5xl font-bold text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.3)] md:text-6xl xl:text-7xl'>
          שירן גלעד אדריכלות ועיצוב
        </h1>
      </EnterAnimation>
    </section>
  );
}
