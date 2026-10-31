// ===== SAMPLE DATA =====  Replace through the admin panel / backend later.
// Every export below becomes one API call in the backend step.

export const settings = {
  siteName: 'Unofficial Trek',
  tagline: 'Treks, rafting and village life of Uttarakhand',
  phone: '+91 90000 00000',
  email: 'hello@unofficialtrek.com',
  address: 'Rishikesh Road, Dehradun, Uttarakhand 248001',
  hours: 'Mon to Sat, 9:30 AM to 7:00 PM',
  banner: 'New season batches are open. Register early for Kedarkantha winter treks.',
  bannerLink: '/treks/season/winter',
  bannerLinkText: 'Register now',
  heroTitle: 'Uttarakhand’s mountains are calling. Walk into them.',
  heroSub: 'Winter snow, summer meadows, monsoon flowers and golden autumn trails, with local guides who know every turn.',
  social: { instagram: '#', facebook: '#', youtube: '#' },
};

export const seasons = [
  { id: 'winter', label: 'Winter', months: 'Dec, Jan, Feb', blurb: 'Snow-draped forests and frozen lakes. Summit climbs while most peaks are shut.', hue: 205 },
  { id: 'summer', label: 'Summer', months: 'March to June', blurb: 'Rhododendrons, green meadows and clear mornings. The widest choice of treks.', hue: 95 },
  { id: 'monsoon', label: 'Monsoon', months: 'July to mid Sept', blurb: 'Valleys in full bloom. Pick treks that stay open in the rains.', hue: 150 },
  { id: 'autumn', label: 'Autumn', months: 'Mid Sept to Nov', blurb: 'Crisp air, golden forests and the clearest mountain views of the year.', hue: 28 },
];

const gen = (days) =>
  Array.from({ length: days }, (_, i) => ({
    day: i + 1,
    title: i === 0 ? 'Drive from Dehradun to base village' : i === days - 1 ? 'Trek down and drive back to Dehradun' : `Trek day ${i}`,
    detail: 'Day-wise route details are added by the admin. Distance, duration and altitude show here.',
    distance: i === 0 || i === days - 1 ? '195 km drive' : '5 to 8 km trek',
  }));

export const treks = [
  { id: 't1', slug: 'kedarkantha', title: 'Kedarkantha', region: 'Uttarkashi', difficulty: 'Easy-Moderate', days: 6, altitude: 12500, price: 11450, seasons: ['winter', 'summer', 'autumn'], hue: 205, isFeatured: true, published: true,
    shortDesc: 'A beginner-friendly summit climb through oak forests and snow clearings.',
    highlights: ['Village stay at the base camp', 'Open clearings and snow campsites', 'Summit view of Swargarohini and Bandarpoonch', 'Best for first-time trekkers'],
    itinerary: [
      { day: 1, title: 'Drive Dehradun to Kotgaon', distance: '195 km drive', detail: 'Leave early morning. The road follows the Yamuna and Tons valleys through Mori and Purola. Rest in the village.' },
      { day: 2, title: 'Kotgaon to Khujaai', distance: '5.5 km, 5 hrs', detail: 'Gradual climb through oak forest to Mohlani meadow, then a short walk to the Khujaai clearing.' },
      { day: 3, title: 'Khujaai to Bhoja Dhadi', distance: '3.5 km, 3.5 hrs', detail: 'Short day through meadows and streams. Sunset views from the high camp.' },
      { day: 4, title: 'Summit and back to Khujaai', distance: '9 km, 7 to 8 hrs', detail: 'Early start. Steep climb to the summit at 12,500 ft, then descend to camp.' },
      { day: 5, title: 'Khujaai to Kotgaon', distance: '5.3 km, 5 hrs', detail: 'Gentle descent through the same oak forest.' },
      { day: 6, title: 'Drive back to Dehradun', distance: '195 km drive', detail: 'Start early. Book onward travel after 8 PM.' },
    ],
    seasonInfo: [
      { season: 'Winter', temp: 'Day 8 to 10 °C, night 0 to -10 °C', snow: 'Snow from base camp', layers: 5 },
      { season: 'Summer', temp: 'Day 18 to 24 °C, night 3 to 8 °C', snow: 'No snow', layers: 2 },
      { season: 'Autumn', temp: 'Day 10 to 15 °C, night 0 to -5 °C', snow: 'No snow', layers: 4 },
    ] },
  { id: 't2', slug: 'brahmatal', title: 'Brahmatal', region: 'Chamoli', difficulty: 'Moderate', days: 6, altitude: 12250, price: 10950, seasons: ['winter', 'summer'], hue: 215, isFeatured: true, published: true,
    shortDesc: 'Frozen lakes, snowy ridges and big views of Trishul and Nanda Ghunti.', highlights: ['Frozen Bekaltal and Brahmatal lakes', 'Ridge walks above the treeline', 'Great solo-friendly winter trek'], itinerary: gen(6) },
  { id: 't3', slug: 'dayara-bugyal', title: 'Dayara Bugyal', region: 'Uttarkashi', difficulty: 'Easy-Moderate', days: 6, altitude: 12000, price: 10450, seasons: ['winter', 'summer', 'autumn'], hue: 190, isFeatured: true, published: true,
    shortDesc: 'One of the largest alpine meadows, white in winter and green in summer.', highlights: ['Vast meadow campsites', 'Old Garhwali villages', 'Easy gradient all the way'], itinerary: gen(6) },
  { id: 't4', slug: 'deoriatal-chandrashila', title: 'Deoriatal Chandrashila', region: 'Rudraprayag', difficulty: 'Easy-Moderate', days: 6, altitude: 13000, price: 10250, seasons: ['winter', 'summer', 'autumn'], hue: 165, isFeatured: false, published: true,
    shortDesc: 'Lake, forest and a summit with views of the western and eastern Garhwal ranges.', highlights: ['Deoria Tal reflection', 'Rhododendron forests in spring', 'Birdwatching trail'], itinerary: gen(6) },
  { id: 't5', slug: 'har-ki-dun', title: 'Har Ki Dun', region: 'Uttarkashi', difficulty: 'Moderate', days: 8, altitude: 11700, price: 13950, seasons: ['winter', 'summer', 'autumn'], hue: 140, isFeatured: true, published: true,
    shortDesc: 'A hanging valley with ancient villages, meadows and Ruinsara Tal.', highlights: ['Culture and mountains together', 'Ruinsara Tal side trip', 'Remote valley camping'], itinerary: gen(8) },
  { id: 't6', slug: 'valley-of-flowers', title: 'Valley of Flowers', region: 'Chamoli', difficulty: 'Moderate', days: 6, altitude: 14100, price: 12450, seasons: ['monsoon'], hue: 320, isFeatured: true, published: true,
    shortDesc: 'A protected valley in bloom, paired with the Hemkund Sahib pilgrimage.', highlights: ['Hundreds of flower species', 'Hemkund Sahib visit', 'Best in July and August'], itinerary: gen(6) },
  { id: 't7', slug: 'phulara-ridge', title: 'Phulara Ridge', region: 'Uttarkashi', difficulty: 'Moderate', days: 6, altitude: 12500, price: 11950, seasons: ['summer', 'autumn'], hue: 40, isFeatured: false, published: true,
    shortDesc: 'Dense forest, Pushtara meadows and over ten Himalayan bird species.', highlights: ['Pushtara meadows', 'Birdlife', 'Quiet, uncrowded trail'], itinerary: gen(6) },
  { id: 't8', slug: 'kedartal', title: 'Kedartal', region: 'Uttarkashi', difficulty: 'Difficult', days: 7, altitude: 15500, price: 15450, seasons: ['summer', 'autumn'], hue: 225, isFeatured: false, published: true,
    shortDesc: 'A glacial lake under Thalaysagar and Bhrigupanth. For experienced trekkers.', highlights: ['Glacial lake camp', 'River crossings', 'Big peak views'], itinerary: gen(7) },
];

export const activities = [
  { id: 'a1', type: 'rafting', slug: 'rishikesh-rafting', title: 'Rishikesh River Rafting', location: 'Rishikesh', duration: '2 to 3 hrs', grade: 'Grade II to IV', price: 1200, hue: 195, shortDesc: 'Ride the Ganga rapids with certified guides and full safety gear.', safety: ['Life jacket and helmet provided', 'Certified river guides', 'Minimum age 14', 'Not for non-swimmers on long stretches'], published: true },
  { id: 'a2', type: 'rafting', slug: 'shivpuri-rafting', title: 'Shivpuri to Rishikesh Rafting', location: 'Shivpuri', duration: '3 to 4 hrs', grade: 'Grade III to IV', price: 1800, hue: 180, shortDesc: 'The classic long stretch with the best rapids of the season.', safety: ['Safety kayaker with each group', 'Briefing before launch', 'Minimum age 14'], published: true },
  { id: 'a3', type: 'bungee', slug: 'rishikesh-bungee', title: 'Bungee Jumping', location: 'Mohan Chatti, Rishikesh', duration: '45 min (jump 1 min)', grade: '83 m jump', price: 3500, hue: 12, shortDesc: 'India’s highest fixed platform jump with trained crew and double harness.', safety: ['Weight check before jump', 'Double harness system', 'Minimum age 12, weight 40 to 110 kg', 'Not allowed with heart or back issues'], published: true },
];

export const villages = [
  { id: 'v1', slug: 'kotgaon', title: 'Kotgaon', district: 'Uttarkashi', hue: 35, shortDesc: 'Carved wooden temple, terraced fields and Koti Banal homes below the Swargarohini peaks.', highlights: ['Someshwar temple', 'Koti Banal architecture', 'Homestay meals'], published: true },
  { id: 'v2', slug: 'gaichawan', title: 'Gaichawan', district: 'Uttarkashi', hue: 20, shortDesc: 'The apple valley of Mori, with a hundred-year-old grain bank.', highlights: ['Apple orchards', 'Kothar grain bank', 'Local siddu and pua'], published: true },
  { id: 'v3', slug: 'sari', title: 'Sari Village', district: 'Rudraprayag', hue: 105, shortDesc: 'Gateway to Deoriatal, with farm life and Himalayan views.', highlights: ['Deoriatal lake', 'Village walks', 'Traditional cooking'], published: true },
];

export const testimonials = [
  { id: 'r1', name: 'Aarav Mehta', designation: 'Software engineer, Pune', headline: 'My first snow trek, and I felt safe all the way.', excerpt: 'The trek leader checked everyone daily and the campsite food was warm and filling. I reached the summit at sunrise and could not stop smiling.', rating: 5, approved: true },
  { id: 'r2', name: 'Neha Kapoor', designation: 'Teacher, Delhi', headline: 'Quiet trails and kind guides.', excerpt: 'We saw very few other groups. The guides pointed out birds and told us village stories at every halt.', rating: 5, approved: true },
  { id: 'r3', name: 'Rohit Sharma', designation: 'Photographer, Jaipur', headline: 'Worth every step.', excerpt: 'Great planning, clean tents and honest advice about the weather. The monsoon flower valley looked unreal.', rating: 4, approved: true },
  { id: 'r4', name: 'Isha Nair', designation: 'Designer, Bengaluru', headline: 'Solo and never alone.', excerpt: 'I joined as a solo traveller and left with new friends. The team made sure nobody was left behind.', rating: 5, approved: true },
  { id: 'r5', name: 'Karan Singh', designation: 'Doctor, Chandigarh', headline: 'Professional and safety first.', excerpt: 'Oxygen levels were checked each evening and the medical kit was complete. Rare to see in group treks.', rating: 5, approved: true },
];

export const weather = [
  { id: 'w1', basecamp: 'Kotgaon', trek: 'Kedarkantha', condition: 'Clear skies', min: -2, max: 9, bullets: ['Group 1 reached the summit this morning', 'Group 2 is travelling from Dehradun', 'Trail is open and snow is hard in the early morning'], updatedAt: '28 Oct 2026, 8:00 AM' },
  { id: 'w2', basecamp: 'Lohajung', trek: 'Brahmatal', condition: 'Light snowfall', min: -4, max: 5, bullets: ['Group 1 is at Bekaltal camp', 'Microspikes in use above the treeline'], updatedAt: '28 Oct 2026, 8:00 AM' },
  { id: 'w3', basecamp: 'Sari', trek: 'Deoriatal Chandrashila', condition: 'Partly cloudy', min: 3, max: 13, bullets: ['Group 1 finished the trek', 'Next group arrives tomorrow'], updatedAt: '28 Oct 2026, 8:00 AM' },
];

export const faqs = [
  { id: 'f1', question: 'Which trek is best for a first-timer?', answer: 'Kedarkantha, Dayara Bugyal and Deoriatal Chandrashila are easy-moderate and have gentle daily gains. Pick by season using the tabs on the home page.' },
  { id: 'f2', question: 'How fit do I need to be?', answer: 'You should be able to walk or jog 5 km in under 40 minutes. Start training at least six weeks before your trek date.' },
  { id: 'f3', question: 'What is included in the trek fee?', answer: 'Stay in tents and village homestays, all meals on the trek, guides and trek leader, safety equipment and permits. Travel to the base camp and personal gear are extra.' },
  { id: 'f4', question: 'Can I cancel or reschedule?', answer: 'Yes. Cancellation terms are shown on every trek page before you pay. Weather cancellations are offered a safe alternative or a voucher.' },
  { id: 'f5', question: 'Do you run treks in other states?', answer: 'No. Unofficial Trek runs only in Uttarakhand, so every trek has local guides and tested campsites.' },
];

export const reasons = [
  { id: 'rs1', title: 'Safety comes first', text: 'Daily health checks, oxygen cylinders and trained leaders on every trek.' },
  { id: 'rs2', title: 'Only Uttarakhand', text: 'We stay in one state so we know every trail, village and weather pattern.' },
  { id: 'rs3', title: 'Leave no trace', text: 'Carry-out waste, small groups and local hiring on every batch.' },
  { id: 'rs4', title: 'Local first', text: 'Guides, cooks and homestays come from the villages we trek through.' },
  { id: 'rs5', title: 'Honest planning', text: 'We tell you the real difficulty and the best months before you book.' },
];

export const advantages = [
  { id: 'ad1', icon: 'ShieldCheck', title: 'Certified leaders', text: 'Trained in mountain first aid and rescue.' },
  { id: 'ad2', icon: 'Stethoscope', title: 'Medical kit and oxygen', text: 'Carried on every trek and kept at high camps.' },
  { id: 'ad3', icon: 'Tent', title: 'Four-season tents', text: 'Warm sleeping bags rated for the season.' },
  { id: 'ad4', icon: 'Utensils', title: 'Fresh meals', text: 'Hot, home-style food cooked on site.' },
  { id: 'ad5', icon: 'Map', title: 'Tested routes', text: 'Every campsite and trail checked each season.' },
  { id: 'ad6', icon: 'HeartHandshake', title: 'Village homestays', text: 'Stay with families and support the local economy.' },
];

export const partners = ['Forest Dept', 'Tourism Board', 'Mountain Rescue', 'Eco Trust', 'Village Council', 'Adventure Assoc.', 'Guide Union', 'Green Camps'];

export const sampleBookings = [
  { id: 'b1', name: 'Aarav Mehta', type: 'trek', item: 'Kedarkantha', date: '2026-12-20', people: 2, amount: 22900, status: 'confirmed' },
  { id: 'b2', name: 'Neha Kapoor', type: 'rafting', item: 'Rishikesh River Rafting', date: '2026-11-05', people: 4, amount: 4800, status: 'pending' },
  { id: 'b3', name: 'Rohit Sharma', type: 'trek', item: 'Brahmatal', date: '2027-01-10', people: 1, amount: 10950, status: 'pending' },
  { id: 'b4', name: 'Isha Nair', type: 'bungee', item: 'Bungee Jumping', date: '2026-11-12', people: 1, amount: 3500, status: 'cancelled' },
];
export const sampleEnquiries = [
  { id: 'e1', name: 'Vikram Rao', email: 'vikram@example.com', phone: '9876500001', message: 'Do you have a December batch for Kedarkantha?', replied: false },
  { id: 'e2', name: 'Sana Khan', email: 'sana@example.com', phone: '9876500002', message: 'Is Valley of Flowers suitable for kids aged 12?', replied: true },
];
export const sampleBatches = [
  { id: 'bt1', trek: 'Kedarkantha', startDate: '2026-12-20', endDate: '2026-12-25', seatsTotal: 20, seatsLeft: 8, status: 'open' },
  { id: 'bt2', trek: 'Brahmatal', startDate: '2027-01-10', endDate: '2027-01-15', seatsTotal: 16, seatsLeft: 3, status: 'open' },
  { id: 'bt3', trek: 'Valley of Flowers', startDate: '2027-07-12', endDate: '2027-07-17', seatsTotal: 20, seatsLeft: 20, status: 'open' },
];
export const sampleUsers = [
  { id: 'u1', name: 'Site Owner', email: 'admin@unofficialtrek.com', role: 'super_admin', active: true },
  { id: 'u2', name: 'Content Editor', email: 'editor@unofficialtrek.com', role: 'content_manager', active: true },
];
