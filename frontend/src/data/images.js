// ============================================================
//  ALL IMAGES LIVE HERE. Replace any URL with the client's own photo.
//  Sources: Pexels and Unsplash (both free to use, credit is optional).
//  These are GENERIC Himalayan photos, not the exact treks. For real
//  trek photos, set the "Cover image URL" field in the admin panel
//  (trek.image / activity.image / village.image wins over this file).
// ============================================================
const px = (id, slug) => (w) =>
  slug
    ? `https://images.pexels.com/photos/${id}/pexels-photo-${id}/free-photo-of-${slug}.jpeg?auto=compress&cs=tinysrgb&w=${w}`
    : `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
const us = (id) => (w) => `https://unsplash.com/photos/${id}/download?force=true&w=${w}`;

export const PHOTOS = {
  snow1: px(38054110, 'trekkers-ascending-snowy-himalayan-path'),
  snow2: px(34363673, 'group-hiking-on-snowy-mountain-trail'),
  snow3: px(35314292, 'hikers-trekking-through-snowy-mountain-pass'),
  snow4: px(31348067, 'group-trekking-snowy-mountain-in-winter'),
  snow5: px(15995872, 'people-hiking-in-snowy-rocky-mountains'),
  ridge: px(34363661, 'scenic-mountain-hike-in-the-himalayas'),
  peaks: px(5625819),
  trail: px(19877800, 'people-hiking-on-footpath-in-mountains'),
  rocks: px(16526470, 'people-hiking-on-rocks'),
  raft1: px(32651320, 'thrilling-whitewater-rafting-adventure-fun'),
  raft2: px(37097430, 'group-adventure-exciting-white-water-rafting-trip'),
  raft3: px(37097420, 'exciting-white-water-rafting-adventure'),
  village: us('ie9o51fD7Bw'),
  bungee: us('eGHw9cpbJBQ'),
};

const TREK_PHOTO = {
  kedarkantha: 'snow1', brahmatal: 'snow2', 'dayara-bugyal': 'snow3', 'deoriatal-chandrashila': 'ridge',
  'har-ki-dun': 'peaks', 'valley-of-flowers': 'trail', 'phulara-ridge': 'rocks', kedartal: 'snow5',
};
const SEASON_PHOTO = { winter: 'snow4', summer: 'trail', monsoon: 'trail', autumn: 'rocks' };
const ACTIVITY_PHOTO = { 'rishikesh-rafting': 'raft1', 'shivpuri-rafting': 'raft2', 'rishikesh-bungee': 'bungee' };

// Page header photos
export const PAGE = {
  home: 'snow1', treks: 'snow4', upcoming: 'snow3', rafting: 'raft3', bungee: 'bungee',
  villages: 'village', weather: 'ridge', about: 'peaks', contact: 'trail', cta: 'snow2',
};
export const pageImage = (key, w = 1600) => PHOTOS[PAGE[key]]?.(w);
export const seasonImage = (season, w = 1600) => PHOTOS[SEASON_PHOTO[season]]?.(w);

// Admin image wins, then the map above, then a season / type fallback.
export const trekImage = (t, w = 800) =>
  t?.image || PHOTOS[TREK_PHOTO[t?.slug]]?.(w) || seasonImage(t?.seasons?.[0], w);
export const activityImage = (a, w = 800) =>
  a?.image || PHOTOS[ACTIVITY_PHOTO[a?.slug]]?.(w) || PHOTOS[a?.type === 'bungee' ? 'bungee' : 'raft1'](w);
export const villageImage = (v, w = 800) => v?.image || PHOTOS.village(w);