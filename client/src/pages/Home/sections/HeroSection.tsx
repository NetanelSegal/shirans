import { motion, useReducedMotion } from 'motion/react';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Section';
import { FeatureStrip, Feature } from '@/components/ui/FeatureStrip';
import { Eyebrow } from '@/components/ui/SectionHeading';
import HeroVideo from '../components/HeroVideo';

const PROMISES: Feature[] = [
  { icon: 'home', title: 'ליווי אישי ומקצועי' },
  { icon: 'gem', title: 'תכנון חכם וחיסכון בעלויות' },
  { icon: 'heart', title: 'עיצוב שמתאים לאנשים' },
  { icon: 'leaf', title: 'בתים שמרגישים נכון' },
];

export default function HeroSection() {
  const reduceMotion = useReducedMotion();
  const rise = (delay: number) => ({
    initial: { opacity: 0, transform: reduceMotion ? 'none' : 'translateY(16px)' },
    animate: { opacity: 1, transform: 'translateY(0px)' },
    transition: { duration: 0.9, delay, ease: [0.23, 1, 0.32, 1] as const },
  });

  return (
    <section
      aria-labelledby='home-hero-title'
      className='relative isolate flex min-h-[92svh] flex-col justify-end overflow-hidden bg-primary-deep text-on-dark'
    >
      <div className='absolute inset-0 -z-20'>
        <HeroVideo />
      </div>
      <div
        aria-hidden
        className='absolute inset-0 -z-10 bg-gradient-to-l from-primary-deep/90 via-primary-deep/50 to-primary-deep/10'
      />
      <div
        aria-hidden
        className='absolute inset-x-0 top-0 -z-10 h-48 bg-gradient-to-b from-primary-deep/70 to-transparent'
      />

      <Container className='flex flex-1 items-center pb-10 pt-[calc(var(--nav-height)+2rem)]'>
        <div className='flex max-w-2xl flex-col items-start gap-6'>
          <motion.div {...rise(0.2)}>
            <Eyebrow tone='dark' rule>
              שירן גלעד · אדריכלות ועיצוב פנים
            </Eyebrow>
          </motion.div>
          <motion.h1 {...rise(0.3)} id='home-hero-title' className='text-display text-balance text-on-dark'>
            בית יפה מתחיל בתכנון נכון
          </motion.h1>
          <motion.p {...rise(0.45)} className='max-w-measure text-lead text-on-dark/85'>
            אדריכלות ועיצוב פנים בהתאמה אישית — לאנשים, למקום ולסיפור שלהם.
          </motion.p>
          <motion.div {...rise(0.6)}>
            <ButtonLink to='/contact' variant='light' size='lg' arrow>
              בואו נתחיל יחד
            </ButtonLink>
          </motion.div>
        </div>
      </Container>

      <div className='border-t border-on-dark/15 bg-primary-deep/55 backdrop-blur-sm'>
        <Container>
          <FeatureStrip items={PROMISES} tone='dark' size='sm' />
        </Container>
      </div>
    </section>
  );
}
