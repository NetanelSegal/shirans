export default function VideoComponent({ src }: { src: string }) {
  return (
    <video
      className='mx-auto max-h-[600px] max-w-sm rounded-lg shadow-lg md:max-h-[60vh]'
      controls
    >
      <source src={src} type='video/quicktime' />
      Your browser does not support the video tag.
    </video>
  );
}
