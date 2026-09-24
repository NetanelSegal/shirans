import FavoriteProjects from '@/components/FavoriteProjects';
import { Section } from '@/components/ui/Section';

export default function FavoriteProjectsSection() {
  return (
    <Section aria-label='פרויקטים נבחרים'>
      <FavoriteProjects />
    </Section>
  );
}
