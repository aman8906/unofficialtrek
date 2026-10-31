// ============================================================
//  Home page content. Edit the text here. All of it is original copy for
//  Unofficial Trek (not copied from the reference site). Images come from
//  src/data/images.js. Video: paste a YouTube link in `videoUrl` and the
//  red play button appears. Leave it '' and no play button is shown.
// ============================================================
export const heroSlides = [
  { id: 's1', photo: 'snow1', hue: 205, title: 'What If Your Next Trek Changed Everything?',
    text: 'Join us on a trek planned with care, led by people who live in these mountains. You come back a little different every time.',
    cta: { label: 'View Upcoming Treks', to: '/upcoming' }, link: { label: 'Read why trekkers keep coming back to Uttarakhand with us.', to: '/about' } },
  { id: 's2', photo: 'snow3', hue: 215, title: 'Safety Comes First, Always',
    text: 'Daily health checks, oxygen on every trek, trained leaders and tested routes. Safety is not a feature here, it is the plan.',
    cta: { label: 'View Upcoming Treks', to: '/upcoming' }, link: { label: 'See how we keep every group safe.', to: '/about' } },
  { id: 's3', photo: 'snow4', hue: 195, title: 'Winter Is Coming to Uttarakhand',
    text: 'Snow forests, frozen lakes and summit sunrises. Kedarkantha, Brahmatal and Dayara Bugyal batches are filling up.',
    cta: { label: 'View Winter Treks', to: '/treks/season/winter' }, link: { label: 'Limited seats on every batch.', to: '/upcoming' } },
];

export const safety = {
  title: 'What Safety Means To Us',
  right: 'And how that translates to your trek',
  videoUrl: '',            // e.g. 'https://www.youtube.com/watch?v=XXXXXXXXXXX'
  photo: 'snow5',
  founder: 'Founder Name',
  role: 'Founder, Unofficial Trek',
  paragraphs: [
    'Our idea is simple. Everyone should get to walk in the mountains, and everyone should come back home safe and happy.',
    'Safety is not one rule or one checklist. It is the people we hire, the routes we test every season, the equipment we carry and the courage to turn back when the weather says so.',
    'We stay in one state, Uttarakhand, so our guides know every trail, every village and every weather pattern. That local knowledge keeps our groups safe.',
    'We will keep improving, because safety never has a full stop. What it can have is a promise to make every trek a little safer than the last one.',
  ],
};

export const reasons = [
  { id: 'rs1', photo: 'snow3', title: 'Our No-Compromise Safety Promise', videoUrl: '',
    text: 'Daily health and oxygen checks, a full medical kit, trained trek leaders and clear turn-back rules. On the mountain, everyone knows who to look for when something feels wrong. Your safety comes before the summit, always.' },
  { id: 'rs2', photo: 'trail', title: 'Our Promise To The Mountains', videoUrl: '',
    text: 'We carry out every bit of waste, keep our groups small and cook with care. Our camps are chosen to protect the meadows, even when that makes our work harder. We want the trail to look better after we pass.' },
  { id: 'rs3', photo: 'ridge', title: 'We Know Uttarakhand Best', videoUrl: '',
    text: 'We run treks only in Uttarakhand. That focus means our guides, cooks and campsite hosts are local, and every route is tested each season. You get advice from people who actually walked the trail last week.' },
  { id: 'rs4', photo: 'village', title: 'Local Villages Come First', videoUrl: '',
    text: 'Our guides, cooks and homestay hosts come from the villages we trek through. When you trek with us, your money stays in the mountains and supports the families who look after them.' },
  { id: 'rs5', photo: 'snow1', title: 'Our Treks Are Transformative', videoUrl: '',
    text: 'A good trek gives you time to think. Our leaders create room for quiet, for conversation and for small challenges that you solve together. Trekkers often return calmer, more confident and ready for what is next.' },
];

export const advantages = [
  { id: 'ad1', icon: 'ShieldCheck', tone: 'gold', title: 'You’re guarded with every step',
    text: 'Our leaders are trained in mountain first aid and rescue, and every group carries oxygen and a full medical kit.' },
  { id: 'ad2', icon: 'ClipboardList', tone: 'lime', title: 'Expert guidance before you start',
    text: 'Our trek advisors help you pick the right trek, prepare your fitness and pack the right gear before departure.' },
  { id: 'ad3', icon: 'Users', tone: 'lime', title: 'Women-friendly groups, always',
    text: 'Many of our trekkers are women, including those travelling solo. Every group is safe and comfortable for everyone.' },
  { id: 'ad4', icon: 'Handshake', tone: 'lime', title: 'Meet like-minded trekkers',
    text: 'Our treks bring together people who love fitness, simple living and the outdoors. Many friendships start in our tents.' },
  { id: 'ad5', icon: 'Leaf', tone: 'lime', title: 'Leave the mountains better',
    text: 'We carry out all waste and pick up what others left behind, so the trail is cleaner when we leave.' },
  { id: 'ad6', icon: 'Backpack', tone: 'lime', title: 'Trek with good equipment',
    text: 'Warm sleeping bags, strong tents and proper safety gear, checked after every trek, so you stay comfortable.' },
];

// Partner logos. Use { name, logo: '/images/partners/x.png' } once you have permission to show a logo.
export const trustedBy = [
  'Forest Department', 'Tourism Board', 'Mountain Rescue', 'Eco Trust', 'Village Council', 'Adventure Association', 'Guide Union',
  'Green Camps', 'Local Homestays', 'Rafting Operators', 'Medical Partner', 'Gear Partner', 'Travel Partner', 'Community Trust',
];

export const partnerBanner = {
  title: 'Planning a trek for your team, school or family?',
  text: 'Special group pricing and custom dates are available on all Uttarakhand treks.',
  link: { label: 'Talk to us.', to: '/contact' },
};