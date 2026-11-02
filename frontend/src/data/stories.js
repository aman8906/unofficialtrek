// ============================================================
//  Stories for "Our Explorations". SAMPLE STORIES: replace with the client's real ones.
//  section: 'exploration' | 'iconic' | 'personal'.  photo = key from src/data/images.js
// ============================================================
export const stories = [
  { slug: 'kedarkantha-where-most-trekkers-start', section: 'exploration', tag: 'The Kedarkantha Story', title: 'Kedarkantha: Why So Many Trekkers Start Here', author: 'Unofficial Trek Team', date: '2026-10-12', read: 6, photo: 'snow1',
    body: ['Kedarkantha is often the first Himalayan trek people do. The climb is gradual, the campsites sit in open clearings and the summit gives a wide view of the snow peaks of the Har Ki Dun side.', 'What makes it special is the village at the start. A night in Kotgaon, a walk through oak forest and a snowy summit morning together make a complete first trek.'] },
  { slug: 'brahmatal-frozen-lakes-of-chamoli', section: 'exploration', tag: 'The Brahmatal Story', title: 'Brahmatal: The Frozen Lakes Of Chamoli', author: 'Unofficial Trek Team', date: '2026-09-25', read: 5, photo: 'snow2',
    body: ['Brahmatal is a winter trek of ridges, quiet forest and lakes that freeze in the cold months. The route is moderate and rewards patient walkers with big views of the Garhwal peaks.', 'Trekkers return for the camp on the ridge, where the evening light turns the snow gold and the night sky fills with stars.'] },
  { slug: 'dayara-bugyal-a-meadow-through-the-seasons', section: 'exploration', tag: 'The Dayara Story', title: 'Dayara Bugyal: A Meadow That Changes With The Seasons', author: 'Unofficial Trek Team', date: '2026-09-02', read: 5, photo: 'snow3',
    body: ['Dayara Bugyal is one of the largest alpine meadows in Garhwal. In winter it is a white field, in summer it turns green and in autumn it glows gold.', 'The gradient is easy, which makes it a favourite for families and first-time trekkers who want wide open views.'] },

  { slug: 'har-ki-dun-a-valley-of-villages', section: 'iconic', tag: '', title: 'How Har Ki Dun Became A Favourite Valley', author: 'Unofficial Trek Team', date: '2026-08-18', read: 7, photo: 'peaks',
    body: ['Har Ki Dun is a hanging valley where culture and mountains sit side by side. Old wooden villages, terraced fields and a long river valley lead to a meadow under the snow peaks.', 'It is a trek for people who like slow days, village stories and a camp surrounded by silence.'] },
  { slug: 'valley-of-flowers-why-monsoon', section: 'iconic', tag: '', title: 'Valley Of Flowers: Why Monsoon Is The Season', author: 'Unofficial Trek Team', date: '2026-08-02', read: 6, photo: 'trail',
    body: ['The Valley of Flowers comes alive in July and August, when hundreds of flower species bloom across the valley floor. The rains that make other treks difficult are what make this one beautiful.', 'Pair it with a visit to Hemkund Sahib and you get a trek that is part nature walk and part pilgrimage.'] },
  { slug: 'phulara-ridge-a-quiet-trail', section: 'iconic', tag: '', title: 'The Quiet Ridge Of Phulara', author: 'Unofficial Trek Team', date: '2026-07-20', read: 5, photo: 'rocks',
    body: ['Phulara Ridge is a forest and meadow trek with fewer crowds than the better known routes. Dense forest, open meadows and birdlife make the days pleasant and unhurried.', 'It is a good choice for trekkers who already have one trek behind them and want something quieter.'] },
  { slug: 'kedartal-a-glacial-lake', section: 'iconic', tag: '', title: 'Kedartal: A Glacial Lake For Experienced Trekkers', author: 'Unofficial Trek Team', date: '2026-07-05', read: 6, photo: 'snow5',
    body: ['Kedartal is a high glacial lake that sits under big peaks. The trek is difficult, with river crossings, steep sections and thin air, and it suits trekkers with some experience.', 'The reward is a camp near a still blue lake, with some of the grandest mountain views in the region.'] },

  { slug: 'chai-with-a-guide-on-kedarkantha', section: 'personal', tag: '', title: 'Chai With A Guide: Mornings On The Kedarkantha Trail', author: 'A Trekker', date: '2026-06-14', read: 4, photo: 'snow4',
    body: ['Every morning started the same way: a hot cup of chai and a story from our guide about the trail we were about to walk. By the third day I knew the names of the birds and the families in the village below.', 'It made the trek feel less like a walk and more like a visit to someone’s home.'] },
  { slug: 'how-a-winter-trek-changed-how-i-plan', section: 'personal', tag: '', title: 'How A Winter Trek Changed The Way I Plan My Year', author: 'A Trekker', date: '2026-05-30', read: 4, photo: 'snow2',
    body: ['I used to plan my year around work. After one winter trek I started planning around the mountains instead. A few quiet days in the snow showed me how much I needed the break.', 'Now one trek goes into the calendar before anything else does.'] },
  { slug: 'what-i-packed-and-what-i-carried-back', section: 'personal', tag: '', title: 'What I Packed, And What I Carried Back', author: 'A Trekker', date: '2026-05-12', read: 3, photo: 'rocks',
    body: ['My first pack was far too heavy. By day two I knew exactly which three things I would leave at home next time. Good socks, layers and a headlamp were the heroes of the trip.', 'What I carried back was lighter: a clearer head and a list of things I never need.'] },
  { slug: 'a-village-stay-in-kotgaon', section: 'personal', tag: '', title: 'A Village Stay In Kotgaon: Food, Temple And Stories', author: 'A Trekker', date: '2026-04-22', read: 5, photo: 'village',
    body: ['We reached Kotgaon in the evening and were welcomed with hot food in a wooden home. The old carved temple, the terraced fields and the stories of the elders were as memorable as the summit.', 'Staying with a family is the best way to understand the mountains you are about to climb.'] },
];

export const bySection = (s) => stories.filter((x) => x.section === s);