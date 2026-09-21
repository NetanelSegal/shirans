import EnterAnimation from '@/components/animations/EnterAnimation';
import Image from '@/components/ui/Image';
import { aboutHero } from '@/data/about-content';
import srcShiranImage from '@/pages/Home/assets/shiranImage.jpeg';

export default function AboutHeroSection() {
  return (
    <section
      aria-labelledby="about-hero-heading"
      className="py-section-all flex w-full flex-col items-start gap-8 md:flex-row"
    >
      <div className="flex basis-1/2 flex-col gap-2 px-5 pb-5 pt-0">
        <EnterAnimation delay={0.1}>
          <h1 id="about-hero-heading" className="text-h2 font-bold">
            {aboutHero.title}
          </h1>
          <div className="mt-4 flex flex-col gap-1">
            {aboutHero.taglines.map((line) => (
              <p key={line} className="text-body font-medium">
                {line}
              </p>
            ))}
          </div>
          <p className="text-body mt-4 text-ink-muted">{aboutHero.intro}</p>
        </EnterAnimation>
      </div>

      <div className="basis-1/2 self-start">
        <EnterAnimation delay={0.1} translateY={false}>
          <div className="max-h-[700px] overflow-hidden rounded-panel">
            <Image
              className="size-full object-cover"
              src={srcShiranImage}
              alt="שירן גלעד - אדריכלית ומעצבת פנים"
            />
          </div>
        </EnterAnimation>
      </div>
    </section>
  );
}
