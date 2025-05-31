const testimonials = [
  {
    name: 'שירן כהן',
    message:
      'התוצאה עלתה על כל הציפיות. שירן התייחסה לכל הבקשות שלנו בתשומת לב מיוחדת ויישמה אותן בצורה מושלמת.',
  },
  {
    name: 'דניאל לוי',
    message:
      'התוצאה עלתה על כל הציפיות. שירן התייחסה לכל הבקשות שלנו בתשומת לב מיוחדת ויישמה אותן בצורה מושלמת.',
  },
];

export default function Testimonials() {
  return (
    <div>
      <TestimonialItem {...testimonials[0]} />
    </div>
  );
}

interface ITestimonial {
  name: string;
  message: string;
}

function TestimonialItem({ name, message }: ITestimonial) {
  return (
    <div>
      <h3>{name}</h3>
      <p>{message}</p>
      <TestimonialsStars />
    </div>
  );
}

function TestimonialsStars() {
  return [...Array(5)].map((_, i) => (
    <span key={i} className='material-symbols-outlined'>
      star
    </span>
  ));
}
