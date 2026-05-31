import { useNavigate } from 'react-router-dom';
import EnterAnimation from '@/components/animations/EnterAnimation';
import Button from '@/components/ui/Button';
import Image from '@/components/ui/Image';
import { aboutCta } from '@/data/about-content';
import houseExteriorImage from '@/data/project5/images/main_desktop.webp';

export default function AboutCtaSection() {
  const navigate = useNavigate();

  return (
    <section
      aria-labelledby="about-cta-heading"
      className="breakout-x-padding bg-secondary py-section-all"
    >
      <div className="px-page-all flex flex-col items-end justify-center gap-8 md:flex-row">
        <div className="basis-1/2 self-center">
          <EnterAnimation delay={0.1} translateY={false}>
            <div className="max-h-[500px] overflow-hidden rounded-3xl md:max-h-[400px]">
              <Image
                className="size-full object-cover"
                src={houseExteriorImage}
                alt="בית פרטי - חזית חיצונית"
              />
            </div>
          </EnterAnimation>
        </div>

        <div className="flex basis-1/2 flex-col gap-2 p-5">
          <EnterAnimation delay={0.2}>
            <h2 id="about-cta-heading" className="heading font-semibold">
              {aboutCta.title}
            </h2>
            <p className="paragraph mt-4 text-slate-700">{aboutCta.description}</p>
            <div className="mt-6">
              <Button
                variant="primary"
                className="inline-flex items-center gap-2 bg-[#B5967A] px-8 py-3 text-lg hover-capable:hover:bg-[#a3856b]"
                onClick={() => navigate('/contact')}
              >
                {aboutCta.buttonText}
                <i className="fa-solid fa-arrow-left" aria-hidden />
              </Button>
            </div>
          </EnterAnimation>
        </div>
      </div>
    </section>
  );
}
