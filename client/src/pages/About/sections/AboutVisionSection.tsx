import { aboutVision } from '@/data/about-content';

export default function AboutVisionSection() {
  return (
    <section
      aria-labelledby="about-vision-heading"
      className="breakout-x-padding bg-secondary py-section-all"
    >
      <div className="px-page-all">
        <h2
          id="about-vision-heading"
          className="heading mb-4 text-center font-semibold"
        >
          {aboutVision.title}
        </h2>
        <p className="paragraph mx-auto mb-12 max-w-3xl text-center text-slate-700">
          {aboutVision.intro}
        </p>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {aboutVision.pillars.map(({ id, icon, title, description }) => (
            <div key={id} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center">
                <i
                  className={`fa-solid ${icon} text-3xl text-[#B5967A]`}
                  aria-hidden
                />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-primary">
                {title}
              </h3>
              <p className="text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
