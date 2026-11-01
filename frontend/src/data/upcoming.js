// ============================================================
//  Upcoming Treks page content. All text is original copy for Unofficial Trek.
//  Section lists below pick treks by slug. Edit the slugs to change which
//  treks appear (a slug that does not exist is simply skipped).
// ============================================================
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
// treks have seasons, not months, so a month matches the season(s) it falls in
export const MONTH_SEASONS = {
  January: ['winter'], February: ['winter'], March: ['summer'], April: ['summer'], May: ['summer'], June: ['summer'],
  July: ['monsoon'], August: ['monsoon'], September: ['monsoon', 'autumn'], October: ['autumn'], November: ['autumn'], December: ['winter'],
};
export const DIFFICULTIES = ['Easy', 'Easy-Moderate', 'Moderate', 'Moderate-Difficult', 'Difficult'];
export const DIFFICULTY_RANK = { Easy: 0, 'Easy-Moderate': 1, Moderate: 2, 'Moderate-Difficult': 3, Difficult: 4 };
export const DURATIONS = ['4', '5', '6', '7+'];

export const viewsSlugs = ['har-ki-dun', 'kedartal', 'valley-of-flowers', 'deoriatal-chandrashila', 'dayara-bugyal', 'kedarkantha'];

export const sectionText = {
  winter: 'Winter trekking in Uttarakhand is an experience like no other. From snow-laden forest trails to frozen lakes and white summit views, here are our top winter treks.',
  views: 'Many Himalayan treks have beautiful views. These are the ones with the grandest mountain panoramas in Uttarakhand.',
  beginners: 'Stepping into the world of trekking for the first time? These treks have gentle climbs, well-paced days and great support, ideal for children, seniors and first-timers.',
  easiest: 'We get this question a lot: “Which is the easiest trek I can do?” These are our easiest treks, perfect for absolute beginners.',
  themed: 'We design treks for every kind of trekker: families, snow lovers and flower-meadow walkers. Tap a tile to see those treks.',
  popular: 'The treks our trekkers talk about the most, and the ones that fill up fast.',
  adventures: 'Go beyond trekking. Raft the Ganga, take a bungee jump or stay with a village family.',
};

// "Explore Our Top Categories" round-corner tiles. `to` = id of the section to scroll to.
export const exploreTiles = [
  { label: 'Top Treks in Winter (Dec, Jan & Feb)', photo: 'snow1', to: 'winter' },
  { label: 'Treks with Greatest Mountain Views', photo: 'peaks', to: 'views' },
  { label: 'Best Treks for Beginners in Winter', photo: 'snow3', to: 'beginners' },
  { label: 'Top 5 Easiest Treks', photo: 'snow2', to: 'easiest' },
  { label: 'Themed Treks', photo: 'snow4', to: 'themed' },
  { label: 'Popular & Trending Treks', photo: 'ridge', to: 'popular' },
  { label: 'Rafting, Bungee & Villages', photo: 'raft1', to: 'adventures' },
];

// Themed tiles apply a filter (see the filters in UpcomingTreks.jsx)
export const themedTiles = [
  { title: 'Family Treks', photo: 'trail', filter: { difficulty: 'Easy-Moderate' } },
  { title: 'Snow Treks', photo: 'snow2', filter: { season: 'winter' } },
  { title: 'Flower & Meadow Treks', photo: 'rocks', filter: { season: 'monsoon' } },
];

export const adventureTiles = [
  { title: 'River Rafting', photo: 'raft1', to: '/rafting' },
  { title: 'Bungee Jumping', photo: 'bungee', to: '/bungee-jumping' },
  { title: 'Village Culture Treks & Experience', photo: 'village', to: '/villages' },
];

export const notices = {
  compare: { lead: 'Which trek should you do?', text: 'We run treks across Uttarakhand almost every month of the year. That is a lot of choices. Put any two or three treks side by side and compare days, difficulty and altitude.', link: 'Compare treks' },
  winter: { lead: 'Winter slots are filling up.', text: 'Check dates for Kedarkantha, Brahmatal and Dayara Bugyal and register early.', link: 'View winter treks', to: '/treks/season/winter' },
  group: { lead: 'Planning with a group?', text: 'Ask us about group dates and pricing for families, schools and offices.', link: 'Talk to us', to: '/contact' },
};