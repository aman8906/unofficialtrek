import { Link, useSearchParams } from 'react-router-dom';
import { Phone, Mail, MapPin, CalendarDays } from 'lucide-react';
import { getAllBatches, getTreks } from '../services/api';
import { useAsync } from '../lib/hooks';
import { Badge, Skeleton } from '../components/ui';
import { useSettings } from '../lib/store';
import { WeatherSection, ReasonList, AdvantageGrid, CtaBand } from '../components/sections';
import { EnquiryForm } from '../components/Forms';
import PageHero from './PageHero';
import { pageImage } from '../data/images';
export function WeatherPage() {

  return (<><PageHero
  title="Weather and trek updates"
  sub="Daily notes from our basecamps."
  hue={200}
  image={pageImage('weather')}
  crumbs={[['Weather']]}
/></>);
}
export function About() {
  return (
    <>
      <PageHero
  title="About Unofficial Trek"
  sub="A small team, one state, and a lot of mountain miles."
  image={pageImage('about')}
  crumbs={[['About']]}
/>
      <section className="section"><div className="container max-w-3xl space-y-4 text-lg leading-relaxed">
        <p>We run treks, river rafting, bungee jumping and village stays only in Uttarakhand. Staying in one state lets us know each trail, campsite and weather pattern properly.</p>
        <p>Our guides, cooks and homestay hosts live in the mountains. When you book with us, the money stays in the villages you walk through.</p>
      </div></section>
      <ReasonList /><AdvantageGrid /><CtaBand />
    </>
  );
}

export function Contact() {
  const s = useSettings();

  const phoneLink = `tel:${(s.phone || '').replace(/[^\d+]/g, '')}`;

  return (
    <>
      {/* <PageHero
        title="Contact us"
        sub="Tell us your dates and we will suggest the right trek."
        image={pageImage('contact')}
        crumbs={[['Contact']]}
      /> */}

      <section className="section bg-white">
        <div className="container">

          {/* Section Heading */}
          <div className="mb-10 border-b border-navbar pb-4">
            <h2 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
              Get In Touch With Us
            </h2>
            <p className="mt-2 text-sm text-body sm:text-base">
              Have questions about your next adventure? Our team is here to help.
            </p>
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">

            {/* Left: Contact Information */}
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">

              {/* Request a Callback */}
              <div className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-light text-brand">
                  <Phone className="h-6 w-6" />
                </span>

                <div>
                  <h3 className="font-heading text-lg font-semibold text-ink">
                    Request a Callback
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-body">
                    Have questions? Tell us about your trekking plans.
                    We will help you choose the right trek according to
                    your dates and preferences.
                  </p>

                  <a
  href="#callback-form"
  className="mt-3 inline-block text-sm font-semibold text-brand underline-offset-4 hover:underline"
>
  Click here to request a callback
</a>
                </div>
              </div>

              {/* Call Us */}
              <div className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-light text-brand">
                  <Phone className="h-6 w-6" />
                </span>

                <div>
                  <h3 className="font-heading text-lg font-semibold text-ink">
                    Call Us
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-body">
                    To speak with our team directly, call us at:
                  </p>

                  <a
                    href={phoneLink}
                    className="mt-2 inline-block font-semibold text-brand hover:underline"
                  >
                    {s.phone}
                  </a>

                  <p className="mt-2 text-sm leading-relaxed text-body">
                    {s.hours}
                  </p>
                </div>
              </div>

              {/* Write To Us */}
              <div className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-light text-brand">
                  <Mail className="h-6 w-6" />
                </span>

                <div>
                  <h3 className="font-heading text-lg font-semibold text-ink">
                    Write To Us
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-body">
                    To get in touch via email, write to us at:
                  </p>

                  <a
                    href={`mailto:${s.email}`}
                    className="mt-2 inline-block break-all font-semibold text-brand hover:underline"
                  >
                    {s.email}
                  </a>

                  <p className="mt-2 text-sm text-body">
                    We would be happy to hear from you.
                  </p>
                </div>
              </div>

              {/* Office / Trek Assistance */}
              <div className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-light text-brand">
                  <MapPin className="h-6 w-6" />
                </span>

                <div>
                  <h3 className="font-heading text-lg font-semibold text-ink">
                    Our Office
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-body">
                    Visit or contact our team for information about treks,
                    bookings and other services.
                  </p>

                  <p className="mt-2 font-semibold leading-relaxed text-ink">
                    {s.address}
                  </p>
                </div>
              </div>

            </div>

            {/* Right: Enquiry Form */}
            <div id="contact-enquiry" className="scroll-mt-32">
              <div className="rounded-card border border-line bg-white p-5 shadow-card sm:p-7">

                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
                    Let's plan your adventure
                  </span>

                  <h3 className="mt-2 font-heading text-2xl font-bold text-ink">
                    Request a Callback
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-body">
                    Share your details and trekking requirements.
                    Our team can assist you with your enquiry.
                  </p>
                </div>

                <EnquiryForm title="Send Your Enquiry" />

                <p className="mt-4 text-center text-xs text-body">
                  Your enquiry will be handled through our existing contact form.
                </p>

              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
export function UpcomingPage() {
  const [sp, setSp] = useSearchParams();
  const only = sp.get('trek');
  const { data: all, loading } = useAsync(() => getAllBatches(), []);
  const batches = (all || []).filter((b) => !only || b.trek === only);
  const { data: treks } = useAsync(() => getTreks(), []);
  const slugOf = (title) => treks?.find((t) => t.title === title)?.slug;
  return (
    <>
      <PageHero title="Upcoming treks" sub="Open batches across Uttarakhand. Seats fill fast in winter." hue={205} image={pageImage('upcoming')} crumbs={[['Upcoming treks']]} />
      <section className="section"><div className="container">
        {only && <p className="mb-5 text-sm">Showing dates for <strong className="text-ink">{only}</strong>. <button onClick={() => setSp({})} className="font-semibold text-brand underline">Show all treks</button></p>}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-40" />) : !batches?.length ? <p className="col-span-full rounded-card border border-dashed border-line p-8 text-center">No open batches right now. Check back soon or send an enquiry.</p> : batches.map((b) => (
          <article key={b.id} className="card p-5">
            <div className="mb-3 flex items-center justify-between"><h3>{b.trek}</h3><Badge tone={b.seatsLeft < 5 ? 'red' : 'green'}>{b.seatsLeft} seats left</Badge></div>
            <p className="flex items-center gap-2 text-sm"><CalendarDays className="h-4 w-4 text-brand" />{b.startDate} to {b.endDate}</p>
            {slugOf(b.trek) && <Link to={`/treks/${slugOf(b.trek)}`} className="btn-brand mt-5 w-full">View and book</Link>}
          </article>))}
        </div>
      </div></section>
    </>
  );
}