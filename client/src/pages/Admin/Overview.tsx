import { Link } from 'react-router-dom';
import { useAdminProjects } from '@/hooks/admin/useAdminProjects';
import { useAdminCategories } from '@/hooks/admin/useAdminCategories';
import { useAdminTestimonials } from '@/hooks/admin/useAdminTestimonials';
import { useAdminContacts } from '@/hooks/admin/useAdminContacts';
import { StatsCard } from '@/components/Admin/StatsCard';
import { ErrorState } from '@/components/DataState';
import Loader from '@/components/Loader/Loader';

export default function Overview() {
  const { projects, isLoading: projectsLoading, error: projectsError } = useAdminProjects();
  const { categories, isLoading: categoriesLoading } = useAdminCategories();
  const { testimonials, isLoading: testimonialsLoading } = useAdminTestimonials();
  const { contacts, isLoading: contactsLoading } = useAdminContacts();

  const isLoading = projectsLoading || categoriesLoading || testimonialsLoading || contactsLoading;
  const unreadContacts = contacts.filter((c) => !c.isRead).length;

  if (projectsError) {
    return (
      <div className="p-6" dir="rtl">
        <ErrorState message={projectsError} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center p-6">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6" dir="rtl">
      <h1 className="mb-6 text-2xl font-bold text-primary">סקירה כללית</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/admin/projects" className="block">
          <StatsCard
            title="פרויקטים"
            count={projects.length}
            icon={<i className="fa-solid fa-folder text-2xl" aria-hidden />}
          />
        </Link>
        <StatsCard
          title="קטגוריות"
          count={categories.length}
          icon={<i className="fa-solid fa-tags text-2xl" aria-hidden />}
        />
        <StatsCard
          title="המלצות"
          count={testimonials.length}
          icon={<i className="fa-solid fa-star text-2xl" aria-hidden />}
        />
        <Link to="/admin/contacts" className="block">
          <StatsCard
            title="פניות שלא נקראו"
            count={unreadContacts}
            icon={<i className="fa-solid fa-envelope text-2xl" aria-hidden />}
          />
        </Link>
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          to="/admin/projects"
          className="rounded-xl bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
        >
          הוסף פרויקט
        </Link>
        <Link
          to="/admin/contacts"
          className="rounded-xl bg-secondary px-4 py-2 text-primary transition-colors hover:bg-secondary/80"
        >
          צפה בפניות
        </Link>
        <Link
          to="/admin/testimonials"
          className="rounded-xl bg-secondary px-4 py-2 text-primary transition-colors hover:bg-secondary/80"
        >
          הוסף המלצה
        </Link>
      </div>
    </div>
  );
}
