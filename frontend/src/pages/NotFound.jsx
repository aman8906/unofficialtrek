import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <section className="section"><div className="container text-center">
      <p className="font-heading text-6xl font-bold text-brand">404</p>
      <h1 className="mt-3 text-3xl">This trail does not exist</h1>
      <p className="mt-3">The page may have moved. Go back to the treks.</p>
      <div className="mt-6 flex justify-center gap-3"><Link to="/" className="btn-brand">Home</Link><Link to="/treks" className="btn-outline">All treks</Link></div>
    </div></section>
  );
}
