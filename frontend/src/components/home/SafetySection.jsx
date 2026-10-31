import { useState } from 'react';
import { ImageBox } from '../ui';
import { PHOTOS } from '../../data/images';
import { safety } from '../../data/home';
import { HomeHeading, PlayButton, VideoModal } from './primitives';

export default function SafetySection() {
  const [video, setVideo] = useState(false);
  return (
    <section className="py-10 sm:py-14">
      <div className="container">
        <HomeHeading title={safety.title} right={safety.right} />
        <div className="grid gap-8 lg:grid-cols-2">
          <ImageBox src={PHOTOS[safety.photo]?.(1000)} hue={205} alt={safety.title} className="aspect-video rounded border border-[#d9d9d9]">
            <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex max-w-[60%] flex-col justify-center p-5 text-white sm:p-8">
              <span className="mb-2 h-1 w-10 rounded bg-ihyellow" />
              <p className="font-head text-[15px] font-extrabold uppercase leading-none sm:text-[22px]">What</p>
              <p className="font-head text-[34px] font-black uppercase leading-none sm:text-[56px]">Safety</p>
              <p className="font-head text-[15px] font-extrabold uppercase leading-tight sm:text-[22px]">Means to us</p>
            </div>
            {safety.videoUrl && <PlayButton onClick={() => setVideo(true)} label="Play safety video" />}
          </ImageBox>
          <div className="font-serif text-[14.5px] leading-snug text-black">
            {safety.paragraphs.map((p, k) => (
              <p key={k} className={`mb-4 ${k === 0 ? 'first-letter:float-left first-letter:mr-1 first-letter:font-serif first-letter:text-[46px] first-letter:font-bold first-letter:leading-[0.8]' : ''}`}>{p}</p>
            ))}
            <p className="font-bold">{safety.founder}<br />{safety.role}</p>
          </div>
        </div>
      </div>
      {video && <VideoModal url={safety.videoUrl} onClose={() => setVideo(false)} />}
    </section>
  );
}