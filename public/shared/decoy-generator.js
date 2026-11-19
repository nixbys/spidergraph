// Decoy profile values for accounts a service won't delete (Playbook Runbook H).
// Everything is generated here, in the browser, from the small lists below: no API,
// no network request, nothing leaves the page (THREAT_MODEL.md's trust boundary).
//
// The values aim to be plausible, not random strings, because some services reject
// names that look fake. Two fields are kept harmless on purpose:
// - phone numbers use 555-0100 to 555-0199, the range reserved for fiction in every
//   North American area code, so a generated number can't be someone's real phone;
// - there is no email field: the account's email must stay one the user controls.
// A street address can still match a real one by chance; the page says so.
//
// Plain classic script (no import/export), like the other public/shared files, so the
// page can load it with <script src> and the tests can run it in a Node vm.
// `rand` is injectable: the page uses crypto.getRandomValues, the tests a fixed sequence.
/* exported spidergraphDecoy, decoyFields */

const DECOY_FIELDS = [
  { key: 'name', label: 'Full name' },
  { key: 'username', label: 'Username' },
  { key: 'birthDate', label: 'Date of birth' },
  { key: 'phone', label: 'Phone' },
  { key: 'address', label: 'Street address' },
  { key: 'city', label: 'City' },
  { key: 'bio', label: 'Bio' },
];

const DECOY_DATA = {
  first: [
    'Adrian',
    'Alicia',
    'Andre',
    'Anna',
    'Ben',
    'Carla',
    'Caleb',
    'Chloe',
    'Daniel',
    'Dana',
    'Elena',
    'Ethan',
    'Erin',
    'Felix',
    'Grace',
    'Hannah',
    'Isaac',
    'Iris',
    'Jacob',
    'Jenna',
    'Joel',
    'Julia',
    'Kevin',
    'Laura',
    'Leo',
    'Lucy',
    'Marcus',
    'Maya',
    'Nathan',
    'Nina',
    'Owen',
    'Paige',
    'Paul',
    'Rachel',
    'Ryan',
    'Sara',
    'Simon',
    'Tara',
    'Victor',
    'Wendy',
  ],
  last: [
    'Adams',
    'Bailey',
    'Barnes',
    'Bennett',
    'Brooks',
    'Carter',
    'Collins',
    'Cooper',
    'Ellis',
    'Fisher',
    'Foster',
    'Graham',
    'Hayes',
    'Hughes',
    'Jenkins',
    'Keller',
    'Lawson',
    'Marsh',
    'Mitchell',
    'Morgan',
    'Nolan',
    'Parker',
    'Porter',
    'Reed',
    'Russell',
    'Sanders',
    'Shaw',
    'Sullivan',
    'Turner',
    'Walsh',
    'Warren',
    'Wells',
  ],
  adjectives: [
    'amber',
    'brisk',
    'calm',
    'cedar',
    'copper',
    'dusty',
    'early',
    'fern',
    'gentle',
    'hollow',
    'idle',
    'jade',
    'lunar',
    'misty',
    'north',
    'quiet',
    'rapid',
    'rustic',
    'silver',
    'stone',
    'tidal',
    'velvet',
    'windy',
    'yellow',
  ],
  nouns: [
    'badger',
    'canyon',
    'comet',
    'delta',
    'falcon',
    'fjord',
    'harbor',
    'heron',
    'kettle',
    'lantern',
    'maple',
    'meadow',
    'orchid',
    'otter',
    'pebble',
    'pine',
    'quarry',
    'raven',
    'ridge',
    'sparrow',
    'thicket',
    'trail',
    'willow',
    'wren',
  ],
  streets: [
    'Maple',
    'Oak',
    'Cedar',
    'Elm',
    'Willow',
    'Birch',
    'Lake',
    'Hill',
    'River',
    'Park',
    'Sunset',
    'Highland',
    'Meadow',
    'Forest',
    'Spring',
    'Valley',
  ],
  suffixes: ['St', 'Ave', 'Rd', 'Ln', 'Dr', 'Ct', 'Way', 'Pl'],
  // Places with many residents, so a decoy city points to no one in particular.
  cities: [
    'Columbus, OH',
    'Denver, CO',
    'Portland, OR',
    'Austin, TX',
    'Raleigh, NC',
    'Tucson, AZ',
    'Omaha, NE',
    'Madison, WI',
    'Richmond, VA',
    'Boise, ID',
    'Spokane, WA',
    'Albuquerque, NM',
    'Tulsa, OK',
    'Louisville, KY',
  ],
  areaCodes: [
    '206',
    '303',
    '312',
    '404',
    '503',
    '512',
    '614',
    '702',
    '720',
    '919',
  ],
  bios: [
    'Coffee first. Trail runs on weekends.',
    'Amateur cook, slow reader, fan of long walks.',
    'Mostly here to keep up with friends.',
    'Gardening, board games and the occasional road trip.',
    'Collector of maps I will probably never use.',
    'Learning guitar, badly.',
    'Weekend hiker and backyard astronomer.',
    'Here for the photos of other people’s dogs.',
  ],
};

// The fields the ledger offers, in display order. A function rather than a bare const
// so other scripts (and the tests' vm) can read it: top-level const isn't a global.
function decoyFields() {
  return DECOY_FIELDS;
}

// A uniform integer in [0, n) from rand(), which returns a float in [0, 1).
function decoyPick(list, rand) {
  return list[Math.floor(rand() * list.length) % list.length];
}

function decoyInt(min, max, rand) {
  return min + (Math.floor(rand() * (max - min + 1)) % (max - min + 1));
}

function decoyRandom() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 4294967296;
}

// spidergraphDecoy(rand?) -> { name, username, birthDate, phone, address, city, bio }
function spidergraphDecoy(rand) {
  const r = rand || decoyRandom;
  const first = decoyPick(DECOY_DATA.first, r);
  const last = decoyPick(DECOY_DATA.last, r);
  // An adult's date of birth, 1965-2000; day capped at 28 so every month is valid.
  const year = decoyInt(1965, 2000, r);
  const month = String(decoyInt(1, 12, r)).padStart(2, '0');
  const day = String(decoyInt(1, 28, r)).padStart(2, '0');
  return {
    name: `${first} ${last}`,
    username: `${decoyPick(DECOY_DATA.adjectives, r)}_${decoyPick(DECOY_DATA.nouns, r)}${decoyInt(10, 99, r)}`,
    birthDate: `${year}-${month}-${day}`,
    phone: `(${decoyPick(DECOY_DATA.areaCodes, r)}) 555-01${String(decoyInt(0, 99, r)).padStart(2, '0')}`,
    address: `${decoyInt(100, 9899, r)} ${decoyPick(DECOY_DATA.streets, r)} ${decoyPick(DECOY_DATA.suffixes, r)}`,
    city: decoyPick(DECOY_DATA.cities, r),
    bio: decoyPick(DECOY_DATA.bios, r),
  };
}
