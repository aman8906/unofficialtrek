import * as M from '../data/mock';

// Config-driven admin: add a resource here and it gets a sidebar link,
// a table, search, add/edit form, delete and CSV export automatically.
// field types: text | textarea | number | select | checkbox | date | tags
const DIFF = ['Easy', 'Easy-Moderate', 'Moderate', 'Moderate-Difficult', 'Difficult'];
const STATUS = ['pending', 'confirmed', 'cancelled'];

export const resources = [
    { key: 'treks', title: 'Treks', icon: 'Mountain', seed: M.treks,
    columns: [{ key: 'title', label: 'Trek' }, { key: 'difficulty', label: 'Difficulty', badge: true }, { key: 'days', label: 'Days' }, { key: 'price', label: 'Price', money: true }, { key: 'published', label: 'Live', bool: true }],
    fields: [{ key: 'title', label: 'Title', type: 'text', required: true }, { key: 'slug', label: 'URL slug', type: 'text', required: true }, { key: 'region', label: 'Region / district', type: 'text' }, { key: 'difficulty', label: 'Difficulty', type: 'select', options: DIFF }, { key: 'days', label: 'Days', type: 'number' }, { key: 'altitude', label: 'Max altitude (ft)', type: 'number' }, { key: 'price', label: 'Price (₹)', type: 'number' }, { key: 'seasons', label: 'Seasons (winter, summer, monsoon, autumn)', type: 'tags' }, { key: 'image', label: 'Cover image URL (optional)', type: 'text' }, { key: 'badge', label: 'Badge on card (e.g. Most Popular, blank = none)', type: 'text' }, { key: 'shortDesc', label: 'Short description', type: 'textarea' }, { key: 'highlights', label: 'Highlights (comma separated)', type: 'tags' }, { key: 'isFeatured', label: 'Featured on home', type: 'checkbox' }, { key: 'published', label: 'Published', type: 'checkbox' }],
    defaults: { published: true, hue: 160, seasons: [], highlights: [], itinerary: [] } },
  { key: 'batches', title: 'Batches', icon: 'CalendarDays', seed: M.sampleBatches,
    columns: [{ key: 'trek', label: 'Trek' }, { key: 'startDate', label: 'Start' }, { key: 'endDate', label: 'End' }, { key: 'seatsLeft', label: 'Seats left' }, { key: 'status', label: 'Status', badge: true }],
    fields: [{ key: 'trek', label: 'Trek name', type: 'text', required: true }, { key: 'startDate', label: 'Start date', type: 'date' }, { key: 'endDate', label: 'End date', type: 'date' }, { key: 'seatsTotal', label: 'Total seats', type: 'number' }, { key: 'seatsLeft', label: 'Seats left', type: 'number' }, { key: 'status', label: 'Status', type: 'select', options: ['open', 'closed'] }], defaults: { status: 'open' } },
  { key: 'seasons', title: 'Seasons', icon: 'Sun', seed: M.seasons,
    columns: [{ key: 'label', label: 'Season' }, { key: 'months', label: 'Months' }],
    fields: [{ key: 'label', label: 'Name', type: 'text', required: true }, { key: 'months', label: 'Months text', type: 'text' }, { key: 'blurb', label: 'Intro text', type: 'textarea' }], defaults: { hue: 150 } },
  { key: 'activities', title: 'Rafting & Bungee', icon: 'Waves', seed: M.activities,
    columns: [{ key: 'title', label: 'Activity' }, { key: 'type', label: 'Type', badge: true }, { key: 'location', label: 'Location' }, { key: 'price', label: 'Price', money: true }, { key: 'published', label: 'Live', bool: true }],
    fields: [{ key: 'title', label: 'Title', type: 'text', required: true }, { key: 'type', label: 'Type', type: 'select', options: ['rafting', 'bungee'] }, { key: 'location', label: 'Location', type: 'text' }, { key: 'duration', label: 'Duration', type: 'text' }, { key: 'grade', label: 'Grade / height', type: 'text' }, { key: 'price', label: 'Price (₹)', type: 'number' }, { key: 'shortDesc', label: 'Description', type: 'textarea' }, { key: 'safety', label: 'Safety points (comma separated)', type: 'tags' }, { key: 'published', label: 'Published', type: 'checkbox' }], defaults: { published: true, type: 'rafting', hue: 195, safety: [] } },
  { key: 'villages', title: 'Villages & Culture', icon: 'Home', seed: M.villages,
    columns: [{ key: 'title', label: 'Village' }, { key: 'district', label: 'District' }, { key: 'published', label: 'Live', bool: true }],
    fields: [{ key: 'title', label: 'Name', type: 'text', required: true }, { key: 'district', label: 'District', type: 'text' }, { key: 'shortDesc', label: 'Description', type: 'textarea' }, { key: 'highlights', label: 'Highlights (comma separated)', type: 'tags' }, { key: 'published', label: 'Published', type: 'checkbox' }], defaults: { published: true, hue: 40, highlights: [] } },
  { key: 'bookings', title: 'Bookings', icon: 'Ticket', seed: M.sampleBookings,
    columns: [{ key: 'name', label: 'Name' }, { key: 'item', label: 'Item' }, { key: 'date', label: 'Date' }, { key: 'people', label: 'People' }, { key: 'amount', label: 'Amount', money: true }, { key: 'status', label: 'Status', badge: true }],
    fields: [{ key: 'name', label: 'Name', type: 'text', required: true }, { key: 'item', label: 'Trek / activity', type: 'text' }, { key: 'date', label: 'Date', type: 'date' }, { key: 'people', label: 'People', type: 'number' }, { key: 'amount', label: 'Amount (₹)', type: 'number' }, { key: 'status', label: 'Status', type: 'select', options: STATUS }], defaults: { status: 'pending', type: 'trek' } },
  { key: 'enquiries', title: 'Enquiries', icon: 'MessageSquare', seed: M.sampleEnquiries,
    columns: [{ key: 'name', label: 'Name' }, { key: 'phone', label: 'Phone' }, { key: 'message', label: 'Message' }, { key: 'replied', label: 'Replied', bool: true }],
    fields: [{ key: 'name', label: 'Name', type: 'text' }, { key: 'email', label: 'Email', type: 'text' }, { key: 'phone', label: 'Phone', type: 'text' }, { key: 'message', label: 'Message', type: 'textarea' }, { key: 'replied', label: 'Replied', type: 'checkbox' }], defaults: { replied: false } },
  { key: 'weather', title: 'Weather updates', icon: 'CloudSun', seed: M.weather,
    columns: [{ key: 'basecamp', label: 'Basecamp' }, { key: 'trek', label: 'Trek' }, { key: 'condition', label: 'Condition' }, { key: 'updatedAt', label: 'Updated' }],
    fields: [{ key: 'basecamp', label: 'Basecamp', type: 'text', required: true }, { key: 'trek', label: 'Trek', type: 'text' }, { key: 'condition', label: 'Condition', type: 'text' }, { key: 'min', label: 'Min °C', type: 'number' }, { key: 'max', label: 'Max °C', type: 'number' }, { key: 'bullets', label: 'Status lines (comma separated)', type: 'tags' }, { key: 'updatedAt', label: 'Updated at', type: 'text' }], defaults: { bullets: [] } },
  { key: 'testimonials', title: 'Testimonials', icon: 'Star', seed: M.testimonials,
    columns: [{ key: 'name', label: 'Name' }, { key: 'headline', label: 'Headline' }, { key: 'rating', label: 'Rating' }, { key: 'approved', label: 'Shown', bool: true }],
    fields: [{ key: 'name', label: 'Name', type: 'text', required: true }, { key: 'designation', label: 'Designation', type: 'text' }, { key: 'headline', label: 'Headline', type: 'text' }, { key: 'excerpt', label: 'Story', type: 'textarea' }, { key: 'rating', label: 'Rating (1 to 5)', type: 'number' }, { key: 'approved', label: 'Show on site', type: 'checkbox' }], defaults: { approved: true, rating: 5 } },
  { key: 'faqs', title: 'FAQs', icon: 'HelpCircle', seed: M.faqs,
    columns: [{ key: 'question', label: 'Question' }],
    fields: [{ key: 'question', label: 'Question', type: 'text', required: true }, { key: 'answer', label: 'Answer', type: 'textarea' }] },
  { key: 'vouchers', title: 'Trek vouchers', icon: 'Gift', seed: [],
    columns: [{ key: 'code', label: 'Code' }, { key: 'title', label: 'Title' }, { key: 'type', label: 'Type', badge: true }, { key: 'value', label: 'Value' }, { key: 'expiresAt', label: 'Valid till' }, { key: 'active', label: 'Active', bool: true }],
    fields: [{ key: 'code', label: 'Code (e.g. WELCOME500)', type: 'text', required: true }, { key: 'title', label: 'Title', type: 'text' }, { key: 'type', label: 'Type', type: 'select', options: ['flat', 'percent'] }, { key: 'value', label: 'Value (₹ or %)', type: 'number' }, { key: 'expiresAt', label: 'Valid till (blank = no expiry)', type: 'date' }, { key: 'userEmail', label: 'Only for this email (blank = every customer)', type: 'text' }, { key: 'active', label: 'Active', type: 'checkbox' }],
    defaults: { active: true, type: 'flat' } },
  { key: 'users', title: 'Users', icon: 'Users', seed: M.sampleUsers,
    columns: [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role', badge: true }, { key: 'active', label: 'Active', bool: true }],
    fields: [{ key: 'name', label: 'Name', type: 'text', required: true }, { key: 'email', label: 'Email', type: 'text' }, { key: 'role', label: 'Role', type: 'select', options: ['super_admin', 'content_manager', 'booking_manager', 'viewer', 'customer'] }, { key: 'active', label: 'Active', type: 'checkbox' }], defaults: { active: true, role: 'viewer' } },
];