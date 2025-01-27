const data = [
  'בנייה פרטית רישוי מלא תכנון ואדריכלות',
  'אדריכלות ועיצוב פנים לחללים מסחרים ללא תהליך רישוי',
  'תהליך רישוי מלא ללגליזציה',
  'עיצוב פנים ליווי מלא לבתים פרטיים',
  'עיצוב פנים ליווי מלא לדירות יוקרה ופנטהאוזים',
];
export default function E_ServicesSection() {
  return (
    <div className='py-section-all breakout-x-padding bg-secondary text-center'>
      <div className='px-page-all'>
        <h2 className='heading mb-10 font-semibold'>השירותים שלי</h2>
        <div className='flex flex-col items-center justify-center gap-5 sm:flex-row sm:flex-wrap sm:items-stretch'>
          {data.map((item) => (
            <div
              key={item}
              className='h-[100px] w-[300px] content-center rounded-2xl bg-primary p-5 text-white'
            >
              <p className='paragraph'>{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
