export default function VideoComponent({ src }: { src: string }) {
  return (
    <iframe
      className='mx-auto aspect-[9/16] max-h-[600px] max-w-sm rounded-lg shadow-lg md:max-h-[60vh]'
      src={src}
    />
  );
}
