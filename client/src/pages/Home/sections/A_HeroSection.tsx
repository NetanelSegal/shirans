export default function HeroSection() {
  return (
    <section className='breakout-x-padding relative -z-50 h-[75dvh] overflow-hidden 2xl:-mx-page-2xl'>
      <div className='size-full overflow-hidden'>
        <img
          className='absolute left-0 top-0 h-full w-full object-cover'
          src='https://images.unsplash.com/photo-1730128459616-4ee4c3b84ed8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          title='YouTube video player'
        />
      </div>
      <h1 className='px-page-all absolute inset-0 m-auto size-fit text-center text-5xl font-bold text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.3)] md:text-6xl xl:text-7xl'>
        שירן גלעד אדריכלות ועיצוב
      </h1>
    </section>
  );
}
