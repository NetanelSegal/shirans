import { CategoryLabel } from '@/components/CategoryLabel';
import FavoriteProjects from '@/components/FavoriteProjects';
import Image from '@/components/Image';
import ImageScaleHover from '@/components/ImageScaleHover';
import { IProject } from '@/data/shiran.projects';
import { categoriesCodeToTitleMap } from '@/data/shiran.categories';
import { useLocation } from 'react-router-dom';

interface ILocationRes {
  state: {
    project: IProject;
  };
}

export default function Project() {
  const {
    state: { project },
  }: ILocationRes = useLocation();

  return (
    <>
      <div className='breakout-x-padding relative mb-10'>
        <h3 className='heading absolute bottom-5 right-5 z-20 font-semibold text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.3)]'>
          {project.title}
        </h3>
        <ImageScaleHover
          containerClassName='w-full h-[75vh] shadow-[0_0_5px_0_rgba(0,0,0,0.2)] grow'
          src={project.mainImage}
        />
      </div>
      <div className='section'>
        {/* info table */}
        <div className='mb-10 flex flex-col items-center'>
          <table className='mb-12 w-full max-w-3xl border-collapse rounded-2xl text-lg'>
            <tbody>
              <tr className='border-b-2 border-secondary'>
                <td className='p-2 text-right'>תגיות: </td>
                <th className='p-2 text-right'>
                  <div className='flex gap-2'>
                    {project.categories.map((catCode) => (
                      <CategoryLabel
                        label={categoriesCodeToTitleMap[catCode]}
                        key={categoriesCodeToTitleMap[catCode]}
                      />
                    ))}
                  </div>
                </th>
              </tr>
              <tr className='border-b-2 border-secondary'>
                <td className='p-2 text-right'>לקוח: </td>
                <th className='p-2 text-right'>{project.client}</th>
              </tr>
              <tr className='border-b-2 border-secondary'>
                <td className='p-2 text-right'>סטטוס:</td>
                <th className='p-2 text-right'>
                  {project.isCompleted ? 'הושלם' : 'בתהליך'}
                </th>
              </tr>
              <tr className='border-b-2 border-secondary'>
                <td className='p-2 text-right'>שטח בנייה:</td>
                <th className='p-2 text-right'> {project.constructionArea}</th>
              </tr>
              <tr className=''>
                <td className='p-2 text-right'>מיקום:</td>
                <th className='p-2 text-right'> {project.location}</th>
              </tr>
            </tbody>
          </table>
          <p className='mt-10 w-full break-words pl-[30%]'>
            {project.description}
          </p>
        </div>

        {/* תוכניות */}
        <h3>תוכניות</h3>
        <div className='my-5 flex w-full flex-col gap-2 md:flex-row'>
          {!project.images.length && <p>אין תוכניות עדיין</p>}

          {project.plans.map((img) => (
            <Image
              key={img}
              src={img}
              alt={`${img}`}
              className='aspect-video shrink grow rounded-xl border-2 border-secondary object-contain p-2 md:w-1/3 md:flex-shrink'
            />
          ))}
        </div>

        {/* תמונות */}
        <h3>תמונות</h3>
        <div className='my-5 mb-10 flex w-full flex-col justify-between gap-2 md:flex-row'>
          {!project.images.length && <p>אין תמונות עדיין</p>}
          {project.images.map((img) => (
            <Image
              key={img}
              src={img}
              alt={`${img}`}
              className='aspect-video min-w-0 grow rounded-xl border-2 border-secondary object-cover md:w-1/3'
            />
          ))}
        </div>
      </div>
      <div className='py-section-all'>
        <FavoriteProjects />
      </div>
    </>
  );
}
