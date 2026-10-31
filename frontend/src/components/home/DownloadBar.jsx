import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, X } from 'lucide-react';

export default function DownloadBar() {
  const [closed, setClosed] = useState(() => sessionStorage.getItem('bar:closed') === '1');
  if (closed) return null;
  const close = () => { sessionStorage.setItem('bar:closed', '1'); setClosed(true); };
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 bg-ihbar shadow-[0_-3px_10px_rgba(0,0,0,0.12)]">
      <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-3 px-4 py-2.5">
        <Megaphone className="hidden h-8 w-8 shrink-0 text-black sm:block" aria-hidden="true" />
        <p className="font-head text-[14px] font-bold text-black sm:text-[17px]">Not sure which trek is right for you?</p>
        <p className="hidden text-[12.5px] text-black md:block">Compare every Uttarakhand trek in one place. <Link to="/treks" className="text-ihlink underline">Browse all treks</Link></p>
        <Link to="/treks" className="text-[12.5px] text-ihlink underline md:hidden">Browse treks</Link>
        <button onClick={close} aria-label="Close" className="ml-1 shrink-0 text-black/60 hover:text-black"><X className="h-4 w-4" /></button>
      </div>
    </div>
  );
}