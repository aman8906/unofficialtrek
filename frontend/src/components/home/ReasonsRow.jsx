import { useState } from 'react';
import { ImageBox } from '../ui';
import { PHOTOS } from '../../data/images';
import { reasons } from '../../data/home';
import { HomeHeading, PlayButton, VideoModal } from './primitives';

export default function ReasonsRow() {
  const [video, setVideo] = useState('');
  return (
    <section className="bg-ihcream py-10 sm:py-14">
      <div className="container">
        <HomeHeading title="5 Reasons Why Unofficial Trek" />
        <div className="grid gap-y-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-y-0 lg:divide-x lg:divide-[#ffcc00]">
          {reasons.map((r) => (
            <article key={r.id} className="lg:px-5 lg:first:pl-2 lg:last:pr-2">
              <h3 className="min-h-[2.6em] font-head text-[17px] font-extrabold leading-tight tracking-[-0.01em] text-black">{r.title}</h3>
              <ImageBox src={PHOTOS[r.photo]?.(600)} hue={200} alt={r.title} className="mt-3 aspect-video w-full">
                <div className="absolute inset-0 bg-black/30" />
                <p className="absolute inset-x-2 bottom-2 font-head text-[13px] font-extrabold leading-tight text-white">{r.title}</p>
                {r.videoUrl && <PlayButton onClick={() => setVideo(r.videoUrl)} label={`Play video: ${r.title}`} />}
              </ImageBox>
              <p className="mt-3 font-serif text-[12.5px] leading-snug text-black">{r.text}</p>
            </article>
          ))}
        </div>
      </div>
      {video && <VideoModal url={video} onClose={() => setVideo('')} />}
    </section>
  );
}