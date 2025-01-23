import { CategoryLabel } from '@/components/CategoryLabel';
import FavoriteProjects from '@/components/FavoriteProjects';
import Image from '@/components/Image';
import ImageScaleHover from '@/components/ImageScaleHover';
import { IProject } from '@/data/shiran.projects';
import { categoriesCodeToTitleMap } from '@/data/shiran.categories';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from '@/components/Modal';
import { useEffect, useState } from 'react';

export default function Project() {
  const { state } = useLocation();

  const nav = useNavigate();

  useEffect(() => {
    if (!state) {
      nav('/projects');
    }
  }, []);

  if (!state) {
    return null;
  }

  const { project } = state as { project: IProject };

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
            {project.description.split('\n').map((line, i) => (
              <>
                {line}
                <br />
              </>
            ))}
          </p>
        </div>

        {/* תוכניות */}
        <h3>תוכניות</h3>
        <div className='my-5 flex w-full flex-col gap-2 md:flex-row'>
          {!project.images.length && <p>אין תוכניות עדיין</p>}

          {project.plans.map((img) => (
            <ImageClickModal img={img} key={img} />
          ))}
        </div>

        {/* תמונות */}
        <h3>תמונות</h3>
        <div className='my-5 mb-10 flex w-full flex-col justify-between gap-2 md:flex-row'>
          {!project.images.length && <p>אין תמונות עדיין</p>}
          {project.images.map((img) => (
            <ImageClickModal img={img} key={img} />
          ))}
        </div>
      </div>
      <div className='py-section-all'>
        <h2 className='heading mb-10 font-semibold'>פרוייקטים נבחרים</h2>
        <FavoriteProjects />
      </div>
    </>
  );
}

const ImageClickModal = ({ img }: { img: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Image
        onClick={() => setIsOpen(true)}
        key={img}
        src={img}
        alt={`${img}`}
        className='aspect-video min-w-0 grow cursor-pointer rounded-xl border-2 border-secondary object-cover md:w-1/3'
      />
      <Modal
        containerClassName='aspect-video w-4/5 max-h-[80vh] md:w-4/6'
        open={isOpen}
        onBackdropClick={() => setIsOpen(false)}
        center
      >
        <Image
          key={img}
          src={img}
          alt={`${img}`}
          className='size-full rounded-xl border-2 border-secondary object-cover'
        />
      </Modal>
    </>
  );
};
