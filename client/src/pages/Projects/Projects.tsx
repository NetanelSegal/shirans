import { IProject, projects as projectsData } from '@/data/shiran.projects';
import Project from './components/Project';
import EnterAnimation from '@/components/animations/EnterAnimation';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '@/constants/urls';

export default function Projects() {
  // Get first project's main image for OG
  const getFirstProjectImage = (): string => {
    if (projectsData.length === 0) {
      return `${BASE_URL}/assets/shiranImage-28AXxNS6.jpeg`;
    }
    const mainImage = projectsData[0].mainImage;
    if (typeof mainImage === 'string') {
      return mainImage.startsWith('http') ? mainImage : `${BASE_URL}/assets/${mainImage}`;
    }
    return mainImage.desktop.startsWith('http')
      ? mainImage.desktop
      : `${BASE_URL}/assets/${mainImage.desktop}`;
  };

  const ogImage = getFirstProjectImage();

  return (
    <>
      <Helmet>
        <title>פרויקטים - שירן גלעד אדריכלות ועיצוב פנים</title>
        <meta name="description" content="גלריית פרויקטים מרשימה של בתים פרטיים, דירות יוקרה,נטהאוזים. כל פרויקט מתוכנן בקפידה בהתאמה אישית ללקוח." />
        <meta property="og:title" content="פרויקטים - שירן גלעד אדריכלות ועיצוב פנים" />
        <meta property="og:description" content="גלריית פרויקטים מרשימה של בתים פרטיים, דירות יוקרה,נטהאוזים. כל פרויקט מתוכנן בקפידה בהתאמה אישית ללקוח." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${BASE_URL}/projects`} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="פרויקטים - שירן גלעד אדריכלות ועיצוב פנים" />
        <meta name="twitter:description" content="גלריית פרויקטים מרשימה של בתים פרטיים, דירות יוקרה,נטהאוזים. כל פרויקט מתוכנן בקפידה בהתאמה אישית ללקוח." />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>
      <div className='py-10 text-center'>
        <h1 className='heading mb-4 font-bold'>פרוייקטים</h1>
        <p className='paragraph px-[10vw] font-semibold'>
          "אדריכלות היא תהליך שמחבר בין חזון אישי לתכנון מקצועי, במטרה ליצור
          חללים יפים ומותאמים בדיוק לצרכים שלכם"
        </p>
      </div>
      {projectsData.map((e: IProject, i) => (
        <EnterAnimation key={e._id}>
          <div className={`${i !== 0 ? 'py-5 lg:py-10' : 'py-5 lg:pb-10'}`}>
            <Project project={e} i={i} />
          </div>
        </EnterAnimation>
      ))}
    </>
  );
}
