import { aboutVision } from '@/data/about-content';

export default function AboutVisionSection() {
  return (
    <section
      aria-labelledby="about-vision-heading"
      className="breakout-x-padding bg-surface-sunken py-section-all"
    >
      <div className="px-page-all">
        <h2
          id="about-vision-heading"
          className="text-h2 mb-4 text-center font-semibold"
        >
          {aboutVision.title}
        </h2>
        <p className="text-body mx-auto mb-12 max-w-3xl text-center text-ink-muted">
          {aboutVision.intro}
        </p>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {aboutVision.pillars.map(({ id, icon, title, description }) => (
            <div key={id} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center">
                <i
                  className={`fa-solid ${icon} text-3xl text-accent`}
                  aria-hidden
                />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-ink">
                {title}
              </h3>
              <p className="text-ink-muted">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
