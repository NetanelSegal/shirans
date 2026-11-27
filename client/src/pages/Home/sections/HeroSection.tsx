import { motion, useReducedMotion } from 'motion/react';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Section';
import { FeatureStrip } from '@/components/ui/FeatureStrip';
import { Eyebrow } from '@/components/ui/SectionHeading';
import HeroVideo from '../components/HeroVideo';
import { EXPERIENCE_STATS, homeHero, homePromises } from '@/data/home-content';

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
              {homeHero.eyebrow}
            </Eyebrow>
          </motion.div>
          <motion.h1 {...rise(0.3)} id='home-hero-title' className='text-display text-balance text-on-dark'>
            {homeHero.title}
          </motion.h1>
          <motion.p {...rise(0.45)} className='max-w-measure text-lead text-on-dark/85'>
            {homeHero.subtitle}
          </motion.p>
          {/* Proof on the first screen, the same numbers as the service pages. */}
          <motion.ul {...rise(0.52)} className='flex flex-wrap gap-x-8 gap-y-2'>
            {EXPERIENCE_STATS.map((stat) => (
              <li key={stat.label} className='flex items-baseline gap-2 text-on-dark'>
                <span className='text-h2 font-semibold' dir='ltr'>
                  {stat.value}
                </span>
                <span className='text-small text-on-dark/85'>{stat.label}</span>
              </li>
            ))}
          </motion.ul>
          <motion.div {...rise(0.6)}>
            <ButtonLink to='/contact' variant='light' size='lg' arrow>
              {homeHero.cta}
            </ButtonLink>
          </motion.div>
        </div>
      </Container>

      <div className='border-t border-on-dark/15 bg-primary-deep/55 backdrop-blur-sm'>
        <Container>
          <FeatureStrip items={homePromises} tone='dark' size='sm' />
        </Container>
      </div>
    </section>
  );
}
