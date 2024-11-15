export default function HeroSection() {
  return (
    <section className='breakout-x-padding relative -z-50 h-[75dvh] overflow-hidden 2xl:-mx-page-2xl'>
      <iframe
        className='size-full'
        src='https://www.youtube.com/embed/0H6n5fXKwXs'
        width='100%'
        title='YouTube video player'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      ></iframe>
      <h1 className='px-page-all absolute inset-0 m-auto size-fit text-center text-5xl font-bold text-white drop-shadow-xl md:text-6xl xl:text-7xl'>
        הבית שתמיד חלמתם עליו
      </h1>
    </section>
  );
}
