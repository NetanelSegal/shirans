import Testimonials from '../../components/Testimonials';

const TestimonialsSection = () => {
  return (
    <section
      className={`py-section-all breakout-x-padding relative overflow-hidden`}
    >
      <h2 className='heading mb-4 text-center font-semibold'>
        מה אומרים עלינו
      </h2>

      <Testimonials />
    </section>
  );
};

export default TestimonialsSection;
