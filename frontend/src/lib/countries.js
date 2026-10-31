const flag = (cc) => String.fromCodePoint(...[...cc].map((c) => 127397 + c.charCodeAt(0)));

export const PHONE_CODES = [['IN', '+91'], ['NP', '+977'], ['BD', '+880'], ['LK', '+94'], ['BT', '+975'], ['US', '+1'], ['GB', '+44'], ['AE', '+971'], ['SG', '+65'], ['AU', '+61'], ['DE', '+49'], ['FR', '+33']]
  .map(([cc, dial]) => ({ cc, dial, label: `${flag(cc)} ${cc} ${dial}` }));

// "+919876543210" -> { dial: '+91', number: '9876543210' }
export const splitPhone = (p = '') => {
  const hit = [...PHONE_CODES].sort((a, b) => b.dial.length - a.dial.length).find((c) => p.startsWith(c.dial));
  return hit ? { dial: hit.dial, number: p.slice(hit.dial.length) } : { dial: '+91', number: p.replace(/\D/g, '') };
};

export const NATIONALITIES = ['Indian', 'Nepali', 'Bangladeshi', 'Sri Lankan', 'Bhutanese', 'American', 'British', 'Canadian', 'Australian', 'German', 'French', 'Singaporean', 'Emirati', 'Other'];
export const GENDERS = [['male', 'Male'], ['female', 'Female'], ['other', 'Other'], ['prefer_not_to_say', 'Prefer not to say']];