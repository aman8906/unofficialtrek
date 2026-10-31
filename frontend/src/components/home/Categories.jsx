import { Link } from 'react-router-dom';
import { CalendarDays, Gauge, Compass, Sun, Clock, MapPin } from 'lucide-react';
import { seasons } from '../../data/mock';
import { getTreks } from '../../services/api';
import { useAsync } from '../../lib/hooks';
import { HomeHeading } from './primitives';

const MONTHS = [['January', 'winter'], ['February', 'winter'], ['March', 'summer'], ['April', 'summer'], ['May', 'summer'], ['June', 'summer'], ['July', 'monsoon'], ['August', 'monsoon'], ['September', 'monsoon'], ['October', 'autumn'], ['November', 'autumn'], ['December', 'winter']];

function Card({ title, icon: Icon, tone = 'green', children, cols }) {
  const line = tone === 'green' ? 'border-[#e3ead0]' : 'border-[#fff3bf]';
  const faint = tone === 'green' ? 'text-ihfaintgreen' : 'text-ihfaintyellow';
  return (
    <section className="relative min-h-[240px] overflow-hidden rounded-[28px] bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.09)]">
      <h3 className={`mb-3 border-b-2 pb-1 font-head text-[14px] font-bold text-black ${line}`}>{title}</h3>
      <ul className={`relative z-10 space-y-1.5 ${cols ? 'columns-2 gap-4' : ''}`}>{children}</ul>
      <Icon aria-hidden="true" className={`pointer-events-none absolute -bottom-3 -right-3 h-28 w-28 ${faint}`} strokeWidth={1.5} />
    </section>
  );
}
const L = ({ to, children }) => <li className="break-inside-avoid"><Link to={to} className="text-[12.5px] text-black hover:underline">{children}</Link></li>;

export default function Categories() {
  const { data } = useAsync(() => getTreks(), []);
  const regions = [...new Set((data || []).map((t) => t.region).filter(Boolean))];
  return (
    <section className="py-10 sm:py-14">
      <div className="container">
        <HomeHeading title="Treks by Categories" gray />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Card title="Treks by Month" icon={CalendarDays} cols>{MONTHS.map(([m, s]) => <L key={m} to={`/treks/season/${s}`}>{m}</L>)}</Card>
          <Card title="Treks by Difficulty" icon={Gauge}>{['Easy-Moderate', 'Moderate', 'Difficult'].map((d) => <L key={d} to={`/treks?difficulty=${d}`}>{d.replace('-', ' - ')}</L>)}</Card>
          <Card title="Treks by Activity" icon={Compass} tone="yellow">
            <L to="/treks">Trekking</L><L to="/rafting">Rafting</L><L to="/bungee-jumping">Bungee Jumping</L><L to="/villages">Village Culture Treks &amp; Experience</L>
          </Card>
          <Card title="Treks by Season" icon={Sun} tone="yellow">{seasons.map((s) => <L key={s.id} to={`/treks/season/${s.id}`}>{s.label}</L>)}</Card>
          <Card title="Treks by Duration" icon={Clock} tone="yellow">
            <L to="/treks?days=4">4 days</L><L to="/treks?days=5">5 days</L><L to="/treks?days=6">6 days</L><L to="/treks?minDays=7">7+ days</L>
          </Card>
          <Card title="Treks by Region" icon={MapPin} cols>{regions.length ? regions.map((r) => <L key={r} to={`/treks?q=${encodeURIComponent(r)}`}>{r}</L>) : <L to="/treks">Uttarakhand</L>}</Card>
        </div>
      </div>
    </section>
  );
}