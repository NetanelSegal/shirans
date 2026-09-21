import Testimonials from '../../components/Testimonials';

const TestimonialsSection = () => {
  return (
    <section className={`breakout-x-padding relative overflow-hidden py-12`}>
      <h2 className='text-h2 my-6 text-center font-semibold'>
        מה אומרים עלינו
      </h2>

      <Testimonials />
    </section>
  );
};

export default TestimonialsSection;
