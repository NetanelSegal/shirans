import EnterAnimation from '@/components/animations/EnterAnimation';
import Image from '@/components/ui/Image';
import { aboutStory } from '@/data/about-content';
import livingRoomImageMobile from '@/data/project2/images/1_desktop.webp';
import livingRoomImageDesktop from '@/data/project2/images/12_desktop.webp';

export default function AboutStorySection() {
  return (
    <section
      aria-labelledby="about-story-heading"
      className="py-section-all flex w-full flex-col items-start gap-8 md:flex-row"
    >
      <div className="w-full shrink-0 md:w-[380px] lg:w-[440px]">
        <EnterAnimation delay={0.1} translateY={false}>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl md:aspect-[2/3]">
            <Image
              className="absolute inset-0 block h-full w-full object-cover md:hidden"
              src={livingRoomImageMobile}
              alt="עיצוב פנים - סלון מודרני"
            />
            <Image
              className="absolute inset-0 hidden h-full w-full object-cover md:block"
              src={livingRoomImageDesktop}
              alt="עיצוב פנים - סלון מודרני"
            />
          </div>
        </EnterAnimation>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-5">
        <EnterAnimation delay={0.2}>
          <h2 id="about-story-heading" className="heading font-semibold">
            {aboutStory.title}
          </h2>
          <div className="mt-4 flex flex-col gap-4">
            {aboutStory.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="paragraph text-slate-700">
                {paragraph}
              </p>
            ))}
          </div>
        </EnterAnimation>
      </div>
    </section>
  );
}
