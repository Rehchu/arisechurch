/* Arise Church - backend/bible.js
   The Bible behind the Bible Search page. One module, several sources, one
   list of Bibles.

   Ported 2026-10-27 from AriseHub (lib/bible.ts, lib/usfm-books.ts,
   lib/versification.ts and the /api/bible routes) to plain JavaScript for
   Velo. Same rules, same tests (sample-site/tests/bible.test.mjs). When one
   side learns something, carry it to the other.

   SOURCES, most preferred first. A source with no key sits out quietly.
     youversion  YouVersion Platform  key YOUVERSION_APP_KEY   NIV, ESV, NLT, AMP ... whatever the app key is approved for
     esv         Crossway ESV API     key ESV_API_KEY          the ESV, with verse numbers
     helloao     AO Lab               no key                   BSB, WEB, NET, KJV, ASV ... and the Greek / Hebrew texts
     api-bible   API.Bible            key API_BIBLE_KEY        (an older secret named APIbible is read too)
     biblia      Biblia / Logos       key BIBLIA_API_KEY       Lexham English Bible
     bible-api   bible-api.com        no key                   public-domain classics
     wldeh       WLDEH on jsDelivr    no key                   public-domain classics
     arisehub    AriseHub itself      key ARISEHUB_API_KEY     every Bible AriseHub can serve, plus the Easton / Smith dictionary
                                      (optional ARISEHUB_URL: another address for the same app, e.g. its workers.dev one)

   KEYS live in the Wix Secrets Manager (Dashboard -> Developer Tools ->
   Secrets Manager), never in this file. Names above, spelled exactly.

   The browser never talks to a Bible source. The page's element calls the
   HTTP functions in backend/http-functions.js (/_functions/bible...), which
   call this module, which holds the keys. */
import { fetch } from 'wix-fetch';
import { getSecret } from 'wix-secrets-backend';

/* =========================================================================
   0. BOOK TABLES
   Every spelling of every book, so "Jn 3:16", "I Cor 13", "First John 1" and
   "Song of Solomon 2" all resolve. Ported from youversion/usfm-references,
   MIT licensed, Copyright (c) 2018 Brad Belyeu - see
   LICENSES/usfm-references-MIT.txt at the repo root. Display names are ours.
   ========================================================================= */
/* Every spelling and abbreviation of a single-name book. */
export const BOOK_ALIASES = {
  "genesis": "GEN",
  "gen": "GEN",
  "gn": "GEN",
  "exodus": "EXO",
  "exod": "EXO",
  "exo": "EXO",
  "ex": "EXO",
  "leviticus": "LEV",
  "lev": "LEV",
  "lv": "LEV",
  "numbers": "NUM",
  "num": "NUM",
  "nm": "NUM",
  "deuteronomy": "DEU",
  "deut": "DEU",
  "deu": "DEU",
  "dt": "DEU",
  "joshua": "JOS",
  "josh": "JOS",
  "jos": "JOS",
  "jsh": "JOS",
  "judges": "JDG",
  "judg": "JDG",
  "jdg": "JDG",
  "jdgs": "JDG",
  "ruth": "RUT",
  "rut": "RUT",
  "rth": "RUT",
  "ezra": "EZR",
  "ezr": "EZR",
  "nehemiah": "NEH",
  "neh": "NEH",
  "esther": "EST",
  "esth": "EST",
  "est": "EST",
  "job": "JOB",
  "jb": "JOB",
  "psalms": "PSA",
  "psalm": "PSA",
  "psa": "PSA",
  "pss": "PSA",
  "psm": "PSA",
  "ps": "PSA",
  "proverbs": "PRO",
  "prov": "PRO",
  "pro": "PRO",
  "prv": "PRO",
  "ecclesiastes": "ECC",
  "eccles": "ECC",
  "eccl": "ECC",
  "ecc": "ECC",
  "qoh": "ECC",
  "qoheleth": "ECC",
  "songofsongs": "SNG",
  "songofsolomon": "SNG",
  "song": "SNG",
  "sng": "SNG",
  "sos": "SNG",
  "canticles": "SNG",
  "cant": "SNG",
  "isaiah": "ISA",
  "isa": "ISA",
  "jeremiah": "JER",
  "jer": "JER",
  "lamentations": "LAM",
  "lam": "LAM",
  "ezekiel": "EZK",
  "ezek": "EZK",
  "ezk": "EZK",
  "eze": "EZK",
  "daniel": "DAN",
  "dan": "DAN",
  "dn": "DAN",
  "hosea": "HOS",
  "hos": "HOS",
  "joel": "JOL",
  "jol": "JOL",
  "jl": "JOL",
  "amos": "AMO",
  "amo": "AMO",
  "obadiah": "OBA",
  "obad": "OBA",
  "oba": "OBA",
  "ob": "OBA",
  "jonah": "JON",
  "jon": "JON",
  "jnh": "JON",
  "micah": "MIC",
  "mic": "MIC",
  "nahum": "NAM",
  "nah": "NAM",
  "nam": "NAM",
  "habakkuk": "HAB",
  "hab": "HAB",
  "hb": "HAB",
  "zephaniah": "ZEP",
  "zeph": "ZEP",
  "zep": "ZEP",
  "haggai": "HAG",
  "hag": "HAG",
  "hg": "HAG",
  "zechariah": "ZEC",
  "zech": "ZEC",
  "zec": "ZEC",
  "malachi": "MAL",
  "mal": "MAL",
  "matthew": "MAT",
  "matt": "MAT",
  "mat": "MAT",
  "mt": "MAT",
  "mark": "MRK",
  "mrk": "MRK",
  "mar": "MRK",
  "mk": "MRK",
  "luke": "LUK",
  "luk": "LUK",
  "lk": "LUK",
  "john": "JHN",
  "jhn": "JHN",
  "jn": "JHN",
  "acts": "ACT",
  "act": "ACT",
  "romans": "ROM",
  "rom": "ROM",
  "galatians": "GAL",
  "gal": "GAL",
  "ephesians": "EPH",
  "eph": "EPH",
  "philippians": "PHP",
  "phil": "PHP",
  "php": "PHP",
  "colossians": "COL",
  "col": "COL",
  "titus": "TIT",
  "tit": "TIT",
  "philemon": "PHM",
  "philem": "PHM",
  "phlm": "PHM",
  "phm": "PHM",
  "hebrews": "HEB",
  "heb": "HEB",
  "james": "JAS",
  "jas": "JAS",
  "jude": "JUD",
  "jud": "JUD",
  "revelation": "REV",
  "rev": "REV",
  "rv": "REV",
  "apocalypse": "REV",
  "apoc": "REV",
  "tobit": "TOB",
  "tob": "TOB",
  "tb": "TOB",
  "judith": "JDT",
  "jdt": "JDT",
  "jdth": "JDT",
  "wisdomofsolomon": "WIS",
  "wisdom": "WIS",
  "wis": "WIS",
  "wissol": "WIS",
  "sirach": "SIR",
  "ecclesiasticus": "SIR",
  "sir": "SIR",
  "bensira": "SIR",
  "baruch": "BAR",
  "bar": "BAR",
  "letterofjeremiah": "LJE",
  "letjer": "LJE",
  "lje": "LJE",
  "epistleofjeremiah": "LJE",
  "songofthethreeyoungmen": "S3Y",
  "songofthree": "S3Y",
  "prayerofazariah": "S3Y",
  "praz": "S3Y",
  "s3y": "S3Y",
  "susanna": "SUS",
  "sus": "SUS",
  "belandthedragon": "BEL",
  "bel": "BEL",
  "prayerofmanasseh": "MAN",
  "prman": "MAN"
};

/**
 * Books that take a leading number, keyed by stem then ordinal.
 *
 * The ordinal is normalized first — arabic (1), roman (II) or word (Third) —
 * then the stem is looked up here. An impossible ordinal such as "4 John"
 * simply finds nothing, which is the wanted answer.
 */
export const NUMBERED_BOOKS = {
  "samuel": {
    "1": "1SA",
    "2": "2SA"
  },
  "sam": {
    "1": "1SA",
    "2": "2SA"
  },
  "sa": {
    "1": "1SA",
    "2": "2SA"
  },
  "sm": {
    "1": "1SA",
    "2": "2SA"
  },
  "kings": {
    "1": "1KI",
    "2": "2KI"
  },
  "kgs": {
    "1": "1KI",
    "2": "2KI"
  },
  "kg": {
    "1": "1KI",
    "2": "2KI"
  },
  "ki": {
    "1": "1KI",
    "2": "2KI"
  },
  "chronicles": {
    "1": "1CH",
    "2": "2CH"
  },
  "chron": {
    "1": "1CH",
    "2": "2CH"
  },
  "chr": {
    "1": "1CH",
    "2": "2CH"
  },
  "ch": {
    "1": "1CH",
    "2": "2CH"
  },
  "corinthians": {
    "1": "1CO",
    "2": "2CO"
  },
  "cor": {
    "1": "1CO",
    "2": "2CO"
  },
  "co": {
    "1": "1CO",
    "2": "2CO"
  },
  "thessalonians": {
    "1": "1TH",
    "2": "2TH"
  },
  "thess": {
    "1": "1TH",
    "2": "2TH"
  },
  "thes": {
    "1": "1TH",
    "2": "2TH"
  },
  "th": {
    "1": "1TH",
    "2": "2TH"
  },
  "timothy": {
    "1": "1TI",
    "2": "2TI"
  },
  "tim": {
    "1": "1TI",
    "2": "2TI"
  },
  "ti": {
    "1": "1TI",
    "2": "2TI"
  },
  "peter": {
    "1": "1PE",
    "2": "2PE"
  },
  "pet": {
    "1": "1PE",
    "2": "2PE"
  },
  "pe": {
    "1": "1PE",
    "2": "2PE"
  },
  "john": {
    "1": "1JN",
    "2": "2JN",
    "3": "3JN"
  },
  "jn": {
    "1": "1JN",
    "2": "2JN",
    "3": "3JN"
  },
  "jhn": {
    "1": "1JN",
    "2": "2JN",
    "3": "3JN"
  },
  "jo": {
    "1": "1JN",
    "2": "2JN",
    "3": "3JN"
  },
  "maccabees": {
    "1": "1MA",
    "2": "2MA"
  },
  "macc": {
    "1": "1MA",
    "2": "2MA"
  },
  "mac": {
    "1": "1MA",
    "2": "2MA"
  },
  "ma": {
    "1": "1MA",
    "2": "2MA"
  },
  "esdras": {
    "1": "1ES",
    "2": "2ES"
  },
  "esd": {
    "1": "1ES",
    "2": "2ES"
  },
  "es": {
    "1": "1ES",
    "2": "2ES"
  }
};

export const ORDINAL_WORDS = {
  "first": 1,
  "second": 2,
  "third": 3
};
export const ROMAN_ORDINALS = {
  "i": 1,
  "ii": 2,
  "iii": 3
};

/** How each book is labelled back to the reader. */
export const BOOK_DISPLAY = {
  "GEN": "Genesis",
  "EXO": "Exodus",
  "LEV": "Leviticus",
  "NUM": "Numbers",
  "DEU": "Deuteronomy",
  "JOS": "Joshua",
  "JDG": "Judges",
  "RUT": "Ruth",
  "EZR": "Ezra",
  "NEH": "Nehemiah",
  "EST": "Esther",
  "JOB": "Job",
  "PSA": "Psalms",
  "PRO": "Proverbs",
  "ECC": "Ecclesiastes",
  "SNG": "Song of Solomon",
  "ISA": "Isaiah",
  "JER": "Jeremiah",
  "LAM": "Lamentations",
  "EZK": "Ezekiel",
  "DAN": "Daniel",
  "HOS": "Hosea",
  "JOL": "Joel",
  "AMO": "Amos",
  "OBA": "Obadiah",
  "JON": "Jonah",
  "MIC": "Micah",
  "NAM": "Nahum",
  "HAB": "Habakkuk",
  "ZEP": "Zephaniah",
  "HAG": "Haggai",
  "ZEC": "Zechariah",
  "MAL": "Malachi",
  "MAT": "Matthew",
  "MRK": "Mark",
  "LUK": "Luke",
  "JHN": "John",
  "ACT": "Acts",
  "ROM": "Romans",
  "GAL": "Galatians",
  "EPH": "Ephesians",
  "PHP": "Philippians",
  "COL": "Colossians",
  "TIT": "Titus",
  "PHM": "Philemon",
  "HEB": "Hebrews",
  "JAS": "James",
  "JUD": "Jude",
  "REV": "Revelation",
  "TOB": "Tobit",
  "JDT": "Judith",
  "WIS": "Wisdom of Solomon",
  "SIR": "Sirach",
  "BAR": "Baruch",
  "LJE": "Epistleofjeremiah",
  "S3Y": "Songofthethreeyoungmen",
  "SUS": "Susanna",
  "BEL": "Belandthedragon",
  "MAN": "Prayer of Manasseh",
  "1SA": "1 Samuel",
  "2SA": "2 Samuel",
  "1KI": "1 Kings",
  "2KI": "2 Kings",
  "1CH": "1 Chronicles",
  "2CH": "2 Chronicles",
  "1CO": "1 Corinthians",
  "2CO": "2 Corinthians",
  "1TH": "1 Thessalonians",
  "2TH": "2 Thessalonians",
  "1TI": "1 Timothy",
  "2TI": "2 Timothy",
  "1PE": "1 Peter",
  "2PE": "2 Peter",
  "1JN": "1 John",
  "2JN": "2 John",
  "3JN": "3 John",
  "1MA": "1 Maccabees",
  "2MA": "2 Maccabees",
  "1ES": "1 Esdras",
  "2ES": "2 Esdras"
};

/* =========================================================================
   1. SMALL HELPERS
   ========================================================================= */
const tidy = (s) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
const stripHtml = (s) => tidy(String(s == null ? '' : s).replace(/<[^>]*>/g, ' '));
const MINUTE = 60 * 1000;

/* fetch with one retry on a 5xx or a thrown connection error. bible-api.com
   and Biblia both answer 525 now and then from a serverless host while
   answering normally from elsewhere; every call here is an idempotent GET, so
   one retry is safe everywhere and keeps the catalogue and the passage halves
   of a source behaving the same way. */
async function fetchOnce(url, init) {
  try {
    const res = await fetch(url, init);
    if (res.status < 500) return res;
  } catch (e) { /* fall through to the single retry */ }
  return fetch(url, init);
}

/* A tiny time-boxed cache. Velo backend instances are warm for a while, so a
   second reader of John 3 within ten minutes costs no network at all. */
function makeCache(ttl, max) {
  const map = new Map();
  max = max || 300;
  return {
    get(k) { const hit = map.get(k); if (hit && hit.until > Date.now()) return hit.value; map.delete(k); return undefined; },
    set(k, v) {
      // Sweep what has expired, then the oldest, so a warm instance never
      // keeps more than `max` chapters in memory.
      const now = Date.now();
      map.forEach((hit, key) => { if (hit.until <= now) map.delete(key); });
      while (map.size >= max) { map.delete(map.keys().next().value); }
      map.set(k, { value: v, until: now + ttl });
      return v;
    },
    clear() { map.clear(); }
  };
}
/* A promise with a deadline. wix-fetch has no timeout of its own, and one slow
   source must not hold every other answer: the late result is dropped, the
   request it belongs to finishes on its own. */
function withDeadline(promise, ms, label) {
  let timer;
  const late = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(label + ' timed out after ' + ms + 'ms')), ms); });
  return Promise.race([promise, late]).then((v) => { clearTimeout(timer); return v; }, (e) => { clearTimeout(timer); throw e; });
}
let SOURCE_DEADLINE = 6000;       // one source's catalogue
let HUB_DEADLINE = 11000;         // AriseHub gathers its own sources first, so it is slower from cold
let PASSAGE_DEADLINE = 12000;     // one passage
/* Test hook only: the suite shortens the deadlines to milliseconds. */
export function __setDeadlines(ms) { SOURCE_DEADLINE = ms; HUB_DEADLINE = ms; PASSAGE_DEADLINE = ms * 4; }

/* =========================================================================
   2. KEYS  (Wix Secrets Manager)
   Read once per warm instance, re-read every ten minutes so a rotated key
   takes effect without a redeploy (bibleStatus re-reads them at once). A missing secret is '' - never an error:
   the source simply sits out. API.Bible has an older secret named
   `APIbible`; it is read as a fallback so nobody has to rename it.
   ========================================================================= */
const SECRET_NAMES = {
  youversion: ['YOUVERSION_APP_KEY'],
  esv: ['ESV_API_KEY'],
  apiBible: ['API_BIBLE_KEY', 'APIbible'],
  biblia: ['BIBLIA_API_KEY'],
  arisehub: ['ARISEHUB_API_KEY'],
  arisehubUrl: ['ARISEHUB_URL']      // optional: another address for the same AriseHub
};
let KEYS = null;          // { youversion, esv, apiBible, biblia, arisehub }
let keysLoadedAt = 0;
let keysLoading = null;

async function readSecret(name) {
  try { const v = await getSecret(name); return tidy(v); }
  catch (e) {
    // A missing secret is the normal case for an unused source. Anything else
    // (permissions, an outage) is worth a line in Site Logs.
    const msg = String((e && e.message) || e || '');
    if (!/not found|does not exist|no secret/i.test(msg)) console.error('Secrets Manager: ' + name + ': ' + msg);
    return '';
  }
}
/* Forget the keys so the next read goes to the Secrets Manager (bibleStatus). */
function forgetKeys() { keysLoadedAt = 0; }
async function loadKeys() {
  if (KEYS && Date.now() - keysLoadedAt < 10 * MINUTE) return KEYS;
  if (keysLoading) return keysLoading;
  keysLoading = (async () => {
    const out = {};
    await Promise.all(Object.keys(SECRET_NAMES).map(async (id) => {
      let v = '';
      for (const name of SECRET_NAMES[id]) { if (!v) v = await readSecret(name); }
      out[id] = v;
    }));
    KEYS = out; keysLoadedAt = Date.now(); keysLoading = null;
    return out;
  })();
  return keysLoading;
}
/* Which keys are set (names only, never values) - for /_functions/bibleStatus. */
export async function keyStatus() {
  const k = await loadKeys();
  const out = {};
  Object.keys(SECRET_NAMES).forEach((id) => { if (id !== 'arisehubUrl') out[id] = !!k[id]; });
  return out;
}

/* =========================================================================
   3. REFERENCE PARSING
   Chapter-based sources (AO Lab, API.Bible, YouVersion) need a book CODE,
   not "John", so a free-typed reference is broken into {book, chapter, verses}.
   ========================================================================= */
const BOOKS = [
  { osis: 'GEN', names: ['genesis', 'gen'] }, { osis: 'EXO', names: ['exodus', 'exo', 'ex'] },
  { osis: 'LEV', names: ['leviticus', 'lev'] }, { osis: 'NUM', names: ['numbers', 'num'] },
  { osis: 'DEU', names: ['deuteronomy', 'deut', 'deu'] }, { osis: 'JOS', names: ['joshua', 'josh', 'jos'] },
  { osis: 'JDG', names: ['judges', 'judg', 'jdg'] }, { osis: 'RUT', names: ['ruth', 'rut'] },
  { osis: '1SA', names: ['1 samuel', '1samuel', '1 sam', '1sam'] }, { osis: '2SA', names: ['2 samuel', '2samuel', '2 sam', '2sam'] },
  { osis: '1KI', names: ['1 kings', '1kings', '1 kgs', '1kgs'] }, { osis: '2KI', names: ['2 kings', '2kings', '2 kgs', '2kgs'] },
  { osis: '1CH', names: ['1 chronicles', '1 chron', '1chr'] }, { osis: '2CH', names: ['2 chronicles', '2 chron', '2chr'] },
  { osis: 'EZR', names: ['ezra', 'ezr'] }, { osis: 'NEH', names: ['nehemiah', 'neh'] },
  { osis: 'EST', names: ['esther', 'est'] }, { osis: 'JOB', names: ['job'] },
  { osis: 'PSA', names: ['psalms', 'psalm', 'psa', 'ps'] }, { osis: 'PRO', names: ['proverbs', 'prov', 'pro'] },
  { osis: 'ECC', names: ['ecclesiastes', 'eccl', 'ecc'] }, { osis: 'SNG', names: ['song of solomon', 'song of songs', 'song', 'sng'] },
  { osis: 'ISA', names: ['isaiah', 'isa'] }, { osis: 'JER', names: ['jeremiah', 'jer'] },
  { osis: 'LAM', names: ['lamentations', 'lam'] }, { osis: 'EZK', names: ['ezekiel', 'ezek', 'ezk'] },
  { osis: 'DAN', names: ['daniel', 'dan'] }, { osis: 'HOS', names: ['hosea', 'hos'] },
  { osis: 'JOL', names: ['joel', 'jol'] }, { osis: 'AMO', names: ['amos', 'amo'] },
  { osis: 'OBA', names: ['obadiah', 'obad', 'oba'] }, { osis: 'JON', names: ['jonah', 'jon'] },
  { osis: 'MIC', names: ['micah', 'mic'] }, { osis: 'NAM', names: ['nahum', 'nam'] },
  { osis: 'HAB', names: ['habakkuk', 'hab'] }, { osis: 'ZEP', names: ['zephaniah', 'zeph', 'zep'] },
  { osis: 'HAG', names: ['haggai', 'hag'] }, { osis: 'ZEC', names: ['zechariah', 'zech', 'zec'] },
  { osis: 'MAL', names: ['malachi', 'mal'] }, { osis: 'MAT', names: ['matthew', 'matt', 'mat'] },
  { osis: 'MRK', names: ['mark', 'mrk', 'mk'] }, { osis: 'LUK', names: ['luke', 'luk', 'lk'] },
  { osis: 'JHN', names: ['john', 'jhn', 'jn'] }, { osis: 'ACT', names: ['acts', 'act'] },
  { osis: 'ROM', names: ['romans', 'rom'] }, { osis: '1CO', names: ['1 corinthians', '1 cor', '1cor'] },
  { osis: '2CO', names: ['2 corinthians', '2 cor', '2cor'] }, { osis: 'GAL', names: ['galatians', 'gal'] },
  { osis: 'EPH', names: ['ephesians', 'eph'] }, { osis: 'PHP', names: ['philippians', 'phil', 'php'] },
  { osis: 'COL', names: ['colossians', 'col'] }, { osis: '1TH', names: ['1 thessalonians', '1 thess', '1th'] },
  { osis: '2TH', names: ['2 thessalonians', '2 thess', '2th'] }, { osis: '1TI', names: ['1 timothy', '1 tim', '1ti'] },
  { osis: '2TI', names: ['2 timothy', '2 tim', '2ti'] }, { osis: 'TIT', names: ['titus', 'tit'] },
  { osis: 'PHM', names: ['philemon', 'phlm', 'phm'] }, { osis: 'HEB', names: ['hebrews', 'heb'] },
  { osis: 'JAS', names: ['james', 'jas'] }, { osis: '1PE', names: ['1 peter', '1 pet', '1pe'] },
  { osis: '2PE', names: ['2 peter', '2 pet', '2pe'] }, { osis: '1JN', names: ['1 john', '1 jn', '1jn'] },
  { osis: '2JN', names: ['2 john', '2 jn', '2jn'] }, { osis: '3JN', names: ['3 john', '3 jn', '3jn'] },
  { osis: 'JUD', names: ['jude', 'jud'] }, { osis: 'REV', names: ['revelation', 'rev'] }
];
const DISPLAY = {};
BOOKS.forEach((b) => { DISPLAY[b.osis] = b.names[0].replace(/\b\w/g, (c) => c.toUpperCase()); });

/* Human label for a parsed reference: "Psalms 23", "John 3:16-17". */
export function refLabel(p) {
  if (p.verseFrom === undefined) return p.bookName + ' ' + p.chapter;
  if (p.chapterTo && p.chapterTo !== p.chapter) {
    return p.bookName + ' ' + p.chapter + ':' + p.verseFrom + '-' + p.chapterTo + ':' + p.verseTo;
  }
  const end = p.verseTo && p.verseTo !== p.verseFrom ? '-' + p.verseTo : '';
  return p.bookName + ' ' + p.chapter + ':' + p.verseFrom + end;
}

/* Resolve a free-typed book name to its USFM code. Handles "1 John",
   "I John" and "First John" by pulling the ordinal off the front and looking
   the stem up separately. "4 John" finds nothing, which is right. */
function resolveBook(raw) {
  // The table keys multi-word books with the spaces removed ("songofsolomon").
  const squash = (s) => s.replace(/\s+/g, '');
  // "St. John", "Saint Matthew" - the Douay-Rheims styles the Gospels this way.
  const bare = raw.replace(/^s(?:t|aint)\s+/, '');
  const direct = BOOK_ALIASES[raw] || BOOK_ALIASES[squash(raw)] || BOOK_ALIASES[squash(bare)];
  if (direct) return direct;
  raw = bare;
  const m = raw.match(/^([123]|i{1,3}|first|second|third)\s+(.+)$/);
  if (!m) return null;
  const ord = m[1], stem = m[2];
  const n = /^[123]$/.test(ord) ? Number(ord) : (ORDINAL_WORDS[ord] || ROMAN_ORDINALS[ord]);
  if (!n) return null;
  const family = NUMBERED_BOOKS[squash(stem)];
  return (family && family[String(n)]) || null;
}

/* "John 3:16-17" / "Ps 23" / "I Cor 13:4" / "Matthew 5:1-7:29" -> structured.
   null if it cannot be understood. */
export function parseReference(input) {
  const s = String(input == null ? '' : input).trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.]/g, '');
  // Book, then chapter[:verse[-[chapter:]verse]]. The optional "chapter:" in
  // the tail is what lets a range cross a chapter break.
  const m = s.match(/^([123]\s*|i{1,3}\s+|first\s+|second\s+|third\s+)?([a-z][a-z ]*?)\s*(\d+)(?::(\d+)(?:\s*[-–]\s*(?:(\d+):)?(\d+))?)?$/);
  if (!m) return null;
  const ordinal = m[1] || '', stem = m[2], chapter = m[3], vFrom = m[4], cTo = m[5], vTo = m[6];
  const osis = resolveBook((ordinal.trim() + ' ' + stem.trim()).trim());
  if (!osis) return null;
  const chapterTo = cTo ? Number(cTo) : undefined;
  // "John 4:2-3:1" is a typo, not a range. Reject rather than silently swap.
  if (chapterTo !== undefined && chapterTo < Number(chapter)) return null;
  const out = {
    osis: osis,
    bookName: BOOK_DISPLAY[osis] || osis,
    chapter: Number(chapter),
    verseFrom: vFrom ? Number(vFrom) : undefined,
    verseTo: vTo ? Number(vTo) : (vFrom ? Number(vFrom) : undefined)
  };
  if (chapterTo !== undefined && chapterTo !== Number(chapter)) out.chapterTo = chapterTo;
  return out;
}

/* =========================================================================
   5. SOURCES
   Each one: { id, label, keyless, configured(), getPassage(ref, translation),
   translations() }. configured() reads KEYS, which loadKeys() fills first.
   ========================================================================= */
const cannot = (ref) => new Error('Couldn\'t understand "' + ref + '" — try e.g. John 3:16');
const sliceVerses = (all, p) => (p.verseFrom === undefined ? all
  : all.filter((v) => v.verse >= p.verseFrom && v.verse <= (p.verseTo === undefined ? p.verseFrom : p.verseTo)));

/* ---- bible-api.com (no key; public-domain classics) ---------------------- */
const bibleApiCom = {
  id: 'bible-api', label: 'bible-api.com', keyless: true,
  configured: () => true,
  async getPassage(ref, translation) {
    translation = translation || 'web';
    const res = await fetchOnce('https://bible-api.com/' + encodeURIComponent(ref) + '?translation=' + encodeURIComponent(translation));
    if (!res.ok) throw new Error('bible-api.com ' + res.status);
    const d = await res.json();
    return {
      reference: d.reference, translation: d.translation_id, translationName: d.translation_name,
      copyright: d.translation_note, providerId: 'bible-api',
      verses: (d.verses || []).map((v) => ({ book: v.book_name, chapter: v.chapter, verse: v.verse, text: tidy(v.text) })),
      text: tidy(d.text)
    };
  },
  async translations() {
    const res = await fetchOnce('https://bible-api.com/data');
    if (!res.ok) throw new Error('bible-api.com ' + res.status);
    const d = await res.json();
    return (d.translations || []).map((t) => ({ id: t.identifier, name: t.name, language: t.language }));
  }
};

/* ---- AO Lab / helloao (no key; the big English catalogue, notes, audio) -- */
/* Serves whole chapters, so a verse range is fetched as its chapter and sliced. */
const helloao = {
  id: 'helloao', label: 'AO Lab', keyless: true,
  configured: () => true,
  async getPassage(ref, translation) {
    translation = translation || 'BSB';
    const p = parseReference(ref);
    if (!p) throw cannot(ref);
    const res = await fetchOnce('https://bible.helloao.org/api/' + encodeURIComponent(translation) + '/' + p.osis + '/' + p.chapter + '.json');
    if (!res.ok) throw new Error('AO Lab ' + res.status);
    const d = await res.json();
    const chapter = d.chapter || {};
    const all = (chapter.content || [])
      .filter((i) => i.type === 'verse' && typeof i.number === 'number')
      .map((i) => ({
        book: p.bookName, chapter: p.chapter, verse: i.number,
        // content is an array of strings and formatting objects; keep the text.
        text: tidy((i.content || []).map((c) => (typeof c === 'string' ? c : ((c && c.text) || ''))).join(' '))
      }))
      .filter((v) => v.text);
    const verses = sliceVerses(all, p);
    if (!verses.length) throw new Error('No verses found for that reference');
    const shown = new Set(verses.map((v) => v.verse));
    const footnotes = (chapter.footnotes || [])
      .filter((f) => f.text && f.reference && f.reference.verse && shown.has(f.reference.verse))
      .map((f) => ({ verse: f.reference.verse, text: tidy(f.text), caller: f.caller }))
      .sort((a, b) => a.verse - b.verse);
    // Recordings are per chapter, so they come back whatever range was asked for.
    const links = d.thisChapterAudioLinks || {};
    const audio = Object.keys(links)
      .filter((k) => typeof links[k] === 'string' && links[k])
      .map((k) => ({ narrator: k.charAt(0).toUpperCase() + k.slice(1), url: links[k] }));
    const t = d.translation || {};
    const out = {
      reference: refLabel(p), translation: t.id || translation,
      translationName: t.englishName || t.name || translation, copyright: t.licenseUrl,
      providerId: 'helloao', verses: verses, text: verses.map((v) => v.text).join(' ')
    };
    if (footnotes.length) out.footnotes = footnotes;
    if (audio.length) out.audio = audio;
    return out;
  },
  async translations() {
    const res = await fetchOnce('https://bible.helloao.org/api/available_translations.json');
    if (!res.ok) throw new Error('AO Lab ' + res.status);
    const d = await res.json();
    return (d.translations || []).map((t) => ({ id: t.id, name: t.englishName || t.name, language: t.languageEnglishName || t.language }));
  }
};

/* ---- WLDEH (no key; chapter JSON on jsDelivr) ---------------------------- */
const WLDEH_CDN = 'https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles';
const wldehBook = (osis) => { const b = BOOKS.find((x) => x.osis === osis); return (b ? b.names[0] : '').replace(/\s+/g, ''); };
const wldeh = {
  id: 'wldeh', label: 'WLDEH', keyless: true,
  configured: () => true,
  async getPassage(ref, translation) {
    translation = translation || 'en-kjv';
    const p = parseReference(ref);
    if (!p) throw cannot(ref);
    const res = await fetchOnce(WLDEH_CDN + '/' + encodeURIComponent(translation) + '/books/' + wldehBook(p.osis) + '/chapters/' + p.chapter + '.json');
    if (!res.ok) throw new Error('WLDEH ' + res.status);
    const d = await res.json();
    // Some chapters list a verse twice; keep the first. Pilcrows are markup.
    const byVerse = new Map();
    (d.data || []).forEach((v) => {
      const n = Number(v.verse);
      if (byVerse.has(n)) return;
      byVerse.set(n, { book: p.bookName, chapter: Number(v.chapter), verse: n, text: tidy(String(v.text || '').replace(/¶/g, '')) });
    });
    const all = Array.from(byVerse.values()).sort((a, b) => a.verse - b.verse);
    const verses = sliceVerses(all, p);
    if (!verses.length) throw new Error('No verses found for that reference');
    return { reference: refLabel(p), translation: translation, translationName: translation, providerId: 'wldeh',
      verses: verses, text: verses.map((v) => v.text).join(' ') };
  },
  async translations() {
    const res = await fetchOnce(WLDEH_CDN + '/bibles.json');
    if (!res.ok) throw new Error('WLDEH ' + res.status);
    const d = await res.json();
    return (d || []).map((t) => ({ id: t.id, name: t.version, language: t.language && t.language.name }));
  }
};

/* ---- YouVersion Platform (key YOUVERSION_APP_KEY) ------------------------ */
/* The licensed route to the modern translations. What the catalogue returns
   is exactly what the app key is approved for. Three documented traps:
   /bibles without language_ranges[] is a 422; passages are HTML unless
   format=text; page_size caps at 99 (100 is a hard 400). */
const YV_BASE = 'https://api.youversion.com/v1';
const yvCopyright = new Map();   // version id -> attribution (licence requires showing it)
const yvTitles = new Map();      // version id -> "New International Version"
const yvBooks = new Map();       // version id -> Set of book codes it carries
const youversion = {
  id: 'youversion', label: 'YouVersion', keyless: false,
  configured: () => !!(KEYS && KEYS.youversion),
  async getPassage(ref, translation) {
    const key = KEYS && KEYS.youversion;
    if (!key) throw new Error('YouVersion key not set');
    if (!translation) throw new Error('YouVersion needs a Bible id');
    const p = parseReference(ref);
    if (!p) throw cannot(ref);
    // Many translations are New Testament only. Name the missing book rather
    // than passing a bare 422 along.
    const carried = yvBooks.get(translation);
    if (carried && !carried.has(p.osis)) throw new Error('This Bible doesn\'t include ' + p.bookName + '.');
    const usfm = p.verseFrom === undefined ? p.osis + '.' + p.chapter
      : (p.verseTo && p.verseTo !== p.verseFrom
        ? p.osis + '.' + p.chapter + '.' + p.verseFrom + '-' + p.osis + '.' + p.chapter + '.' + p.verseTo
        : p.osis + '.' + p.chapter + '.' + p.verseFrom);
    // HTML, not text: the plain-text form has no verse boundaries at all.
    const res = await fetchOnce(YV_BASE + '/bibles/' + encodeURIComponent(translation) + '/passages/' + usfm + '?format=html',
      { headers: { 'X-YVP-App-Key': key } });
    if (!res.ok) throw new Error('YouVersion ' + res.status);
    const d = await res.json();
    const html = d.content || '';
    const content = stripHtml(html);
    if (!content) throw new Error('No text found for that reference');
    // Licence requirement: show the version's attribution wherever its text
    // is shown. The passages endpoint omits it, so it comes from the catalogue.
    let copyright = yvCopyright.get(translation);
    if (copyright === undefined) {
      try {
        const vRes = await fetchOnce(YV_BASE + '/bibles/' + encodeURIComponent(translation), { headers: { 'X-YVP-App-Key': key } });
        if (vRes.ok) { const v = await vRes.json(); copyright = v.copyright || ''; yvCopyright.set(translation, copyright); if (v.title) yvTitles.set(translation, v.title); }
      } catch (e) { /* attribution lookup must not break the reading */ }
    }
    // Split on the verse markers: elements carrying class "yv-v" and v="N".
    const verses = [];
    const marker = /<[^>]*\bclass="[^"]*\byv-v\b[^"]*"[^>]*\bv="(\d+)"[^>]*>|<[^>]*\bv="(\d+)"[^>]*\bclass="[^"]*\byv-v\b[^"]*"[^>]*>/g;
    const hits = [];
    let mm;
    while ((mm = marker.exec(html))) hits.push({ verse: Number(mm[1] || mm[2]), start: mm.index + mm[0].length });
    for (let i = 0; i < hits.length; i++) {
      const slice = html.slice(hits[i].start, hits[i + 1] ? hits[i + 1].start : html.length);
      // The marker also PRINTS the verse number; drop it when it matches.
      const text = stripHtml(slice).replace(new RegExp('^' + hits[i].verse + '(?![0-9])[.)\\s]*'), '');
      if (text) verses.push({ book: p.bookName, chapter: p.chapter, verse: hits[i].verse, text: text });
    }
    if (!verses.length) {
      const re = /\[(\d+)\]\s*([^[]*)/g; let m;
      while ((m = re.exec(content))) { const text = tidy(m[2]); if (text) verses.push({ book: p.bookName, chapter: p.chapter, verse: Number(m[1]), text: text }); }
    }
    if (!verses.length) verses.push({ book: p.bookName, chapter: p.chapter, verse: p.verseFrom === undefined ? 1 : p.verseFrom, text: content });
    return { reference: d.reference || refLabel(p), translation: translation,
      translationName: yvTitles.get(translation) || translation, copyright: copyright || undefined,
      providerId: 'youversion', verses: verses, text: content };
  },
  async translations() {
    const key = KEYS && KEYS.youversion;
    if (!key) return [];
    const out = [];
    let pageToken = null;
    for (let page = 0; page < 6; page++) {
      const url = YV_BASE + '/bibles?language_ranges[]=eng&language_ranges[]=en&page_size=99' +
        (pageToken ? '&page_token=' + encodeURIComponent(pageToken) : '');
      const res = await fetchOnce(url, { headers: { 'X-YVP-App-Key': key } });
      if (!res.ok) { let body = ''; try { body = await res.text(); } catch (e) { /* ignore */ } throw new Error('YouVersion ' + res.status + ': ' + body.slice(0, 200)); }
      const d = await res.json();
      const rows = d.data || [];
      rows.forEach((b) => {
        if (b.id === undefined) return;
        const id = String(b.id);
        const name = b.title || b.localized_title || b.abbreviation || b.localized_abbreviation || id;
        if (b.copyright) yvCopyright.set(id, b.copyright);
        if (Array.isArray(b.books) && b.books.length) yvBooks.set(id, new Set(b.books));
        yvTitles.set(id, name);
        out.push({ id: id, name: name, language: 'English' });
      });
      pageToken = d.next_page_token || null;
      if (!pageToken || !rows.length) break;
    }
    return out;
  }
};

/* ---- Crossway ESV API (key ESV_API_KEY) ---------------------------------- */
/* Verse numbers arrive as [n]. Crossway's terms ask for the copyright line
   wherever the text is shown; it rides on every passage. Not in AriseHub -
   added here because the church website can have its own ESV access. */
const ESV_COPYRIGHT = 'ESV® Bible (The Holy Bible, English Standard Version®), copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.';
const esv = {
  id: 'esv', label: 'ESV API', keyless: false,
  configured: () => !!(KEYS && KEYS.esv),
  async getPassage(ref) {
    const key = KEYS && KEYS.esv;
    if (!key) throw new Error('ESV key not set');
    const p = parseReference(ref);
    if (!p) throw cannot(ref);
    const url = 'https://api.esv.org/v3/passage/text/?q=' + encodeURIComponent(refLabel(p)) +
      '&include-headings=false&include-footnotes=false&include-verse-numbers=true&include-first-verse-numbers=true' +
      '&include-short-copyright=false&include-passage-references=false&include-copyright=false&indent-paragraphs=0&indent-poetry=false';
    const res = await fetchOnce(url, { headers: { Authorization: 'Token ' + key } });
    if (!res.ok) throw new Error('ESV ' + res.status);
    const d = await res.json();
    const content = (d.passages || []).join(' ');
    const verses = [];
    const re = /\[(\d+)\]\s*([^[]*)/g; let m;
    while ((m = re.exec(content))) { const text = tidy(m[2]); if (text) verses.push({ book: p.bookName, chapter: p.chapter, verse: Number(m[1]), text: text }); }
    if (!verses.length && tidy(content)) verses.push({ book: p.bookName, chapter: p.chapter, verse: p.verseFrom === undefined ? 1 : p.verseFrom, text: tidy(content) });
    if (!verses.length) throw new Error('No verses found for that reference');
    return { reference: d.canonical || refLabel(p), translation: 'esv', translationName: 'English Standard Version',
      copyright: ESV_COPYRIGHT, providerId: 'esv', verses: verses, text: verses.map((v) => v.text).join(' ') };
  },
  async translations() {
    return (KEYS && KEYS.esv) ? [{ id: 'esv', name: 'English Standard Version', language: 'English' }] : [];
  }
};

/* ---- API.Bible (key API_BIBLE_KEY, or the older secret APIbible) --------- */
/* Bible ids look like de4e12af7f28f599-01; passages use OSIS ids (JHN.3.16).
   Text comes back with [n] verse markers. */
const API_BIBLE_BASE = 'https://rest.api.bible/v1';
const apiBible = {
  id: 'api-bible', label: 'API.Bible', keyless: false,
  configured: () => !!(KEYS && KEYS.apiBible),
  async getPassage(ref, translation) {
    const key = KEYS && KEYS.apiBible;
    if (!key) throw new Error('API.Bible key not set');
    if (!translation) throw new Error('API.Bible needs a Bible id');
    const p = parseReference(ref);
    if (!p) throw cannot(ref);
    const passageId = p.verseFrom === undefined ? p.osis + '.' + p.chapter
      : p.osis + '.' + p.chapter + '.' + p.verseFrom + '-' + p.osis + '.' + p.chapter + '.' + (p.verseTo === undefined ? p.verseFrom : p.verseTo);
    const url = API_BIBLE_BASE + '/bibles/' + encodeURIComponent(translation) + '/passages/' + passageId +
      '?content-type=text&include-verse-numbers=true&include-notes=true&include-titles=false&include-chapter-numbers=false';
    const res = await fetchOnce(url, { headers: { 'api-key': key } });
    if (!res.ok) throw new Error('API.Bible ' + res.status);
    const d = await res.json();
    const data = d.data || {};
    const content = data.content || '';
    const verses = [];
    const re = /\[(\d+)\]\s*([^[]*)/g; let m;
    while ((m = re.exec(content))) { const text = tidy(m[2]); if (text) verses.push({ book: p.bookName, chapter: p.chapter, verse: Number(m[1]), text: text }); }
    if (!verses.length && tidy(content)) verses.push({ book: p.bookName, chapter: p.chapter, verse: p.verseFrom === undefined ? 1 : p.verseFrom, text: tidy(content) });
    if (!verses.length) throw new Error('No verses found for that reference');
    return { reference: data.reference || refLabel(p), translation: translation, translationName: translation,
      copyright: data.copyright, providerId: 'api-bible', verses: verses, text: verses.map((v) => v.text).join(' ') };
  },
  async translations() {
    const key = KEYS && KEYS.apiBible;
    if (!key) return [];
    const res = await fetchOnce(API_BIBLE_BASE + '/bibles', { headers: { 'api-key': key } });
    if (!res.ok) throw new Error('API.Bible ' + res.status);
    const d = await res.json();
    return (d.data || []).map((t) => ({ id: t.id, name: t.name, language: t.language && t.language.name }));
  }
};

/* ---- Biblia / Faithlife (key BIBLIA_API_KEY) ----------------------------- */
/* Keys are URL-restricted, so calls send the church site as Referer. Terms of
   Use REQUIRE a visible "Powered by Biblia" line - the element shows
   BIBLIA_ATTRIBUTION whenever a passage comes from here. */
const BIBLIA_BASE = 'https://api.biblia.com/v1/bible';
const BIBLIA_REFERER = 'https://www.arisecenla.church';
export const BIBLIA_ATTRIBUTION = 'This site uses the Biblia web services from Logos Bible Software.';
const biblia = {
  id: 'biblia', label: 'Biblia', keyless: false,
  configured: () => !!(KEYS && KEYS.biblia),
  async getPassage(ref, translation) {
    translation = translation || 'LEB';
    const key = KEYS && KEYS.biblia;
    if (!key) throw new Error('Biblia key not set');
    const p = parseReference(ref);
    if (!p) throw cannot(ref);
    const book = p.bookName.replace(/\s+/g, '');
    const passage = p.verseFrom === undefined ? book + p.chapter
      : book + p.chapter + '.' + p.verseFrom + (p.verseTo && p.verseTo !== p.verseFrom ? '-' + p.verseTo : '');
    const url = BIBLIA_BASE + '/content/' + encodeURIComponent(translation) + '.txt?passage=' + encodeURIComponent(passage) + '&key=' + encodeURIComponent(key);
    const res = await fetchOnce(url, { headers: { Referer: BIBLIA_REFERER } });
    if (!res.ok) throw new Error('Biblia ' + res.status);
    const body = tidy(await res.text());
    if (!body) throw new Error('No text found for that reference');
    // The .txt service returns one plain block: kept as one passage rather
    // than invented verse splits.
    return { reference: refLabel(p), translation: translation, translationName: translation, copyright: BIBLIA_ATTRIBUTION,
      providerId: 'biblia', verses: [{ book: p.bookName, chapter: p.chapter, verse: p.verseFrom === undefined ? 1 : p.verseFrom, text: body }], text: body };
  },
  async translations() {
    const key = KEYS && KEYS.biblia;
    if (!key) return [];
    const res = await fetchOnce(BIBLIA_BASE + '/find?key=' + encodeURIComponent(key), { headers: { Referer: BIBLIA_REFERER } });
    if (!res.ok) throw new Error('Biblia ' + res.status);
    const d = await res.json();
    return (d.bibles || []).map((b) => ({ id: b.bible, name: b.title || b.bible, language: (b.languages && b.languages[0]) || 'English' }));
  }
};

/* ---- AriseHub (key ARISEHUB_API_KEY) ------------------------------------- */
/* The church's own app already runs this same module with its own keys. With
   an AriseHub API key (Admin -> API keys) the website gets every Bible
   AriseHub can serve - and the Easton / Smith dictionary - without holding
   those keys itself. The key is traded for a one-hour session
   (docs/agent-access.md in the AriseHub repo); a 401 means trade again.
   AriseHub does its own verse-number shifting, note borrowing and chapter
   spanning, so a reference goes across exactly as typed. */
const HUB_URL_DEFAULT = 'https://arisehub.myfaithtech.com';
/* The secret ARISEHUB_URL, when set, points the bridge at another address for
   the same app (its workers.dev address, say, which sits outside the custom
   domain's firewall). Read with the other keys. */
const hubUrl = () => ((KEYS && KEYS.arisehubUrl) || HUB_URL_DEFAULT).replace(/\/+$/, '');
const HUB_HEADERS = { Accept: 'application/json', 'User-Agent': 'AriseChurchWebsite/1.0 (Wix Velo; +https://www.arisecenla.church)' };
/* What a blocked request was told, in a line: a firewall's block page says
   who blocked it (Cloudflare, Access, a WAF rule), which a bare status cannot. */
function excerpt(text) {
  const t = tidy(String(text || '').replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]*>/g, ' '));
  return t ? ' — ' + t.slice(0, 160) : '';
}
let hubSession = { token: '', until: 0 };
async function hubToken(force) {
  if (!force && hubSession.token && hubSession.until > Date.now()) return hubSession.token;
  const key = KEYS && KEYS.arisehub;
  if (!key) throw new Error('AriseHub key not set');
  const res = await fetchOnce(hubUrl() + '/api/agent/token', { method: 'post', headers: Object.assign({ Authorization: 'Bearer ' + key }, HUB_HEADERS) });
  let text = '';
  try { text = await res.text(); } catch (e) { text = ''; }
  let d = null;
  try { d = JSON.parse(text); } catch (e) { d = null; }
  if (!res.ok) throw new Error('AriseHub token ' + res.status + ((d && d.error) ? ' ' + d.error : excerpt(text)));
  if (!d) throw new Error('AriseHub token: not JSON');
  if (!d.access_token) throw new Error('AriseHub token: no session');
  // Renew two minutes early; expires_at is seconds since the epoch.
  const until = d.expires_at ? d.expires_at * 1000 : Date.now() + 55 * MINUTE;
  hubSession = { token: d.access_token, until: until - 2 * MINUTE };
  return hubSession.token;
}
async function hubGet(path) {
  let token = await hubToken(false);
  const hdrs = (t) => Object.assign({ Authorization: 'Bearer ' + t }, HUB_HEADERS);
  let res = await fetchOnce(hubUrl() + path, { headers: hdrs(token) });
  if (res.status === 401) { token = await hubToken(true); res = await fetchOnce(hubUrl() + path, { headers: hdrs(token) }); }
  let d = null;
  try { d = await res.json(); } catch (e) { d = null; }
  if (!res.ok) {
    // AriseHub already turned its provider's failure into a sentence a reader
    // can act on; pass that through untouched.
    const err = new Error((d && d.error) || ('AriseHub ' + res.status));
    err.friendly = !!(d && d.error);
    throw err;
  }
  return d || {};
}
const arisehub = {
  id: 'arisehub', label: 'AriseHub', keyless: false,
  configured: () => !!(KEYS && KEYS.arisehub),
  async getPassage(ref, translation) {
    const d = await hubGet('/api/bible/passage?ref=' + encodeURIComponent(ref) + (translation ? '&translation=' + encodeURIComponent(translation) : ''));
    return Object.assign({}, d, { providerId: 'arisehub', via: d.providerId });
  },
  async translations() {
    const d = await hubGet('/api/bible/translations');
    return (d.translations || []).map((t) => ({ id: t.id, name: t.name, language: t.language, hasAudio: !!t.hasAudio }));
  }
};

/* Registered sources, most-preferred first. Keyed ones sit out until their key
   is set. The website's own keyed sources outrank AriseHub so a Bible the site
   can read directly is read directly; AriseHub fills in whatever is left. */
const PROVIDERS = [youversion, esv, helloao, apiBible, biblia, bibleApiCom, wldeh, arisehub];

/* =========================================================================
   6. ONE LIST OF BIBLES
   Every source's catalogue, merged, English only, duplicates collapsed, in
   alphabetical order. The page shows Bibles, never sources.
   ========================================================================= */

/* Which of the FREE Bibles to offer. The keyless sources between them carry
   75 English "translations", most of them near-identical editions of the same
   text (five World English Bibles, three ASVs). Scrolling that to find the
   KJV is worse than having fewer choices. Applies ONLY to keyless sources:
   anything from a keyed source (YouVersion, ESV, API.Bible, Biblia, AriseHub)
   was licensed or chosen deliberately and is always kept. */
const KEYLESS_KEEP = new Set([
  'BSB',       // Berean Standard Bible (narrated)
  'ENGWEBP',   // World English Bible
  'eng_net',   // NET Bible
  'eng_lsv',   // Literal Standard Version
  'eng_fbv',   // Free Bible Version
  'eng_kjv',   // King James Version
  'eng_kja',   // King James Version + Apocrypha
  'eng_asv',   // American Standard Version (1901)
  'eng_gnv',   // Geneva Bible 1599
  'eng_dby',   // Darby
  'eng_ylt',   // Young's Literal
  'eng_dra',   // Douay-Rheims 1899
  'eng_bbe',   // Bible in Basic English
  'eng_pev',   // Plain English Version
  'eng_t4t',   // Translation for Translators
  'eng_jps',   // JPS TaNaKH 1917
  'eng_wmb',   // World Messianic Bible
  'AAB'        // Accessible Ancients Bible (the other narrated one)
]);

/* The website is English only (decided 2026-10-27). A MISSING tag keeps a
   Bible: a licensed translation must never vanish over absent metadata -
   only an explicit other-language tag filters anything out. */
const KEEP_LANGUAGE = /english|^eng?(-|_|$)/i;   // "English", "en", "eng", "en-US"
export const languageKept = (t) => {
  const lang = tidy(t && t.language);
  return !lang || KEEP_LANGUAGE.test(lang);
};

/* One work, published under several names. Explicit rather than clever: a
   generic normalizer merged NASB 1995 with NASB 2020 and NIV with NIV
   Anglicized, and a wrong merge is invisible - the Bible just stops being in
   the list. Each rule is anchored tightly enough to exclude its neighbours
   (+ Apocrypha, British Edition, Updated). The canonical name is what the
   page shows. */
const SAME_WORK = [
  { canon: 'American Standard Version', match: /american\s+standard\s+version/i },
  // Brenton's English translation of the Septuagint is listed under several
  // titles. Its Greek companion never reaches this table: other languages are
  // filtered out before de-duplication.
  { canon: "Brenton's English Septuagint", match: /brenton/i },
  // Anchored: must not catch "+ Apocrypha" or "Cambridge Paragraph Bible of the KJV".
  { canon: 'King James Version', match: /^(the\s+)?king\s+james\s+(\(authori[sz]ed\)\s+)?version$/i },
  // Anchored: must not catch "British Edition" or "Updated", which are real variants.
  { canon: 'World English Bible', match: /^world\s+english\s+bible(,\s*american\s+english\s+edition.*)?$/i },
  { canon: 'Geneva Bible', match: /^geneva\s+bible(\s+1599)?$/i },
  // The ESV API serves the current (2016) text; YouVersion lists it as
  // "English Standard Version 2016". Same words, one entry. "Anglicised" and
  // "2011" are different editions and stay apart.
  { canon: 'English Standard Version', match: /^english\s+standard\s+version(\s+2016)?$/i },
  { canon: 'Berean Standard Bible', match: /^berean\s+standard\s+bible$/i },
  // Seen in the live list on 27 Oct 2026: the same work from two sources under
  // two titles. Each rule is anchored so a real variant stays a separate entry.
  { canon: 'King James Version', match: /^the\s+holy\s+bible:\s*king\s+james\s+version$/i },
  { canon: 'King James Version + Apocrypha', match: /^(the\s+)?king\s+james\s+version\s*(\+|with)?\s*apocrypha$/i },
  { canon: 'Darby Translation', match: /^(1890\s+)?darby\s+(bible|translation)$/i },
  { canon: 'Douay-Rheims 1899', match: /^douay-?rheims(\s+american)?(\s+1899)?(\s+american)?(\s+edition)?$/i },
  { canon: 'Literal Standard Version', match: /^(english\s+lsv|literal\s+standard\s+version)$/i },
  { canon: 'Plain English Version', match: /^plain\s+english\s+version(\s+\(aboriginal\))?$/i },
  { canon: 'Lexham English Bible', match: /^(the\s+)?lexham\s+english\s+bible$/i }
];
export const canonicalWork = (t) => SAME_WORK.find((w) => w.match.test((t && t.name) || ''));

/* Normalized key for spotting the same Bible offered by several sources. */
export const dedupeKey = (t) => {
  const work = canonicalWork(t);
  if (work) return 'work:' + work.canon;
  return String((t && (t.name || t.id)) || '').toLowerCase().replace(/[^a-z0-9]/g, '');
};

/* Translations known to publish narrated audio - a snapshot, flagged so
   listeners can find them. The recordings live on the free AO Lab editions;
   matched by NAME so a licensed copy of the same Bible keeps its player. */
const AUDIO_TRANSLATIONS = new Set(['BSB', 'AAB']);
const AUDIO_BY_NAME = new Map([['work:Berean Standard Bible', 'BSB'], ['accessibleancientsbible', 'AAB']]);

const catalogueCache = makeCache(60 * MINUTE);
let catalogueLoading = null;

/* Sources usable right now (keyless, or key present). Loads the keys first. */
export async function bibleProviders() {
  await loadKeys();
  return PROVIDERS.filter((p) => p.configured());
}

/* Every Bible from every configured source as ONE flat list: English, sorted
   by name, duplicates collapsed (the earlier source in PROVIDERS wins). Each
   row remembers which source serves it. One source being down must not empty
   the list - its error is kept for bibleStatus() and the rest carry on. */
export async function allTranslations() {
  const hit = catalogueCache.get('all');
  if (hit) return hit;
  if (catalogueLoading) return catalogueLoading;
  catalogueLoading = (async () => {
    try {
      const providers = await bibleProviders();
      const lists = await Promise.all(providers.map(async (p) => {
        const pending = p.translations();
        try {
          const rows = await withDeadline(pending, p.id === 'arisehub' ? HUB_DEADLINE : SOURCE_DEADLINE, p.label);
          offered[p.id] = rows.length; delete lastErrors[p.id];
          offeredRows[p.id] = rows.filter(languageKept).map((t) => ({ id: t.id, name: t.name }));
          return rows.map((t) => Object.assign({}, t, { providerId: p.id }));
        }
        catch (e) {
          lastErrors[p.id] = (e && e.message) || 'failed'; offered[p.id] = 0;
          // A source that answers after its deadline is not wasted: the list is
          // rebuilt on the next request, when that source is warm and quick.
          pending.then((rows) => { if (rows && rows.length) catalogueCache.clear(); }, () => {});
          return [];
        }
      }));
      const keyless = new Set(PROVIDERS.filter((p) => p.keyless).map((p) => p.id));
      const seen = new Set();
      const merged = [];
      lists.forEach((list) => list.forEach((t) => {
        if (keyless.has(t.providerId) && !KEYLESS_KEEP.has(t.id)) return;
        if (!languageKept(t)) return;
        const k = dedupeKey(t);
        if (seen.has(k)) return;
        seen.add(k);
        const work = canonicalWork(t);
        const row = { id: t.id, name: work ? work.canon : t.name, language: t.language || 'English', providerId: t.providerId };
        if (t.hasAudio || AUDIO_TRANSLATIONS.has(t.id) || AUDIO_BY_NAME.has(k)) row.hasAudio = true;
        merged.push(row);
      }));
      merged.sort((a, b) => a.name.localeCompare(b.name));
      // An empty merge (every source down) is never cached: the next request
      // tries again, and the last good list serves meanwhile.
      if (!merged.length) return lastGood;
      lastGood = merged;
      return catalogueCache.set('all', merged);
    } finally { catalogueLoading = null; }
  })();
  return catalogueLoading;
}
let lastGood = [];
const lastErrors = {};
const offered = {};      // source id -> how many Bibles it listed, before curation and de-duplication
const offeredRows = {};  // source id -> the English rows it listed (id, name), for bibleStatus ?unused=1

/* The catalogue row for a translation id (which source serves it). */
export async function translationFor(id) {
  const all = await allTranslations();
  return all.find((t) => t.id === id) || null;
}

function getProvider(id) {
  if (id) { const p = PROVIDERS.find((x) => x.id === id && x.configured()); if (p) return p; }
  // No source named: AO Lab, which needs no key and no id (its default is the
  // BSB). YouVersion and API.Bible cannot serve a passage without a Bible id.
  return helloao;
}

/* =========================================================================
   7. BOOKS, NOTES, AUDIO
   ========================================================================= */
let bookCache = null;

/* The 66 books with their chapter counts, for the page's book / chapter
   pickers. Falls back to the built-in list (no counts) if the lookup fails. */
export async function bibleBooks() {
  if (bookCache) return bookCache;
  try {
    const res = await fetchOnce('https://bible.helloao.org/api/BSB/books.json');
    if (!res.ok) throw new Error('AO Lab ' + res.status);
    const d = await res.json();
    const books = (d.books || []).filter((b) => b.id && b.numberOfChapters)
      .map((b) => ({ osis: b.id, name: b.commonName || b.name || b.id, chapters: b.numberOfChapters }));
    if (books.length) { bookCache = books; return books; }
  } catch (e) { /* fall through to the static list */ }
  return BOOKS.map((b) => ({ osis: b.osis, name: DISPLAY[b.osis], chapters: 0 }));
}

/* Study notes for a reference, from the BSB, so notes can appear whatever
   Bible is selected. [] rather than a throw - missing notes never break a
   passage. */
const NOTES_SOURCE = { translation: 'BSB', name: 'Berean Standard Bible' };
export async function annotationsFor(ref) {
  try { const p = await helloao.getPassage(ref, NOTES_SOURCE.translation); return { footnotes: p.footnotes || [], from: NOTES_SOURCE.name }; }
  catch (e) { return { footnotes: [], from: NOTES_SOURCE.name }; }
}

/* Narrated chapters for a translation NAME, wherever the recording lives. */
export async function audioForTranslationName(ref, translationName) {
  const id = AUDIO_BY_NAME.get(dedupeKey({ id: '', name: translationName }));
  if (!id) return [];
  try { return (await helloao.getPassage(ref, id)).audio || []; } catch (e) { return []; }
}

/* =========================================================================
   8. A PASSAGE
   ========================================================================= */
const passageCache = makeCache(10 * MINUTE);
const MAX_SPAN = 6;

/* A range crossing a chapter break ("Matthew 5:1-7:29") is asked for as whole
   chapters and trimmed at both ends - every source can serve a plain chapter.
   Capped at MAX_SPAN: "Genesis 1:1-50:26" gets an honest refusal. */
async function spanChapters(provider, p, translation) {
  const from = p.chapter, to = p.chapterTo || p.chapter;
  if (to - from + 1 > MAX_SPAN) {
    throw new Error('That range covers ' + (to - from + 1) + ' chapters — ask for ' + MAX_SPAN + ' or fewer at a time.');
  }
  const chapters = await Promise.all(Array.from({ length: to - from + 1 }, (_, i) => provider.getPassage(p.bookName + ' ' + (from + i), translation)));
  const verses = [];
  chapters.forEach((c, i) => {
    const chapter = from + i;
    c.verses.forEach((v) => {
      if (chapter === from && p.verseFrom !== undefined && v.verse < p.verseFrom) return;
      if (chapter === to && p.verseTo !== undefined && v.verse > p.verseTo) return;
      verses.push(v);
    });
  });
  if (!verses.length) throw new Error('No verses found for that reference');
  // Everything but the verses comes from the first chapter. Audio is dropped
  // on purpose: recordings are per chapter.
  const head = chapters[0];
  const out = Object.assign({}, head, { reference: refLabel(p), verses: verses, text: verses.map((v) => v.text).join(' ') });
  const notes = [];
  chapters.forEach((c) => { (c.footnotes || []).forEach((f) => notes.push(f)); });
  out.footnotes = notes;
  delete out.audio;
  return out;
}

/* Provider errors are for the logs, not the reader. "WLDEH 404" tells a
   visitor nothing; "this Bible doesn't have that passage" tells them what to
   do next. */
export function readerMessage(raw) {
  raw = String(raw || 'lookup failed');
  if (/\b(404|422)\b/.test(raw)) return 'This Bible doesn\'t include that passage — try another translation.';
  if (/\b(5\d\d)\b/.test(raw)) return 'That Bible\'s source is unavailable right now — try another translation.';
  if (/\b(401|403)\b/.test(raw)) return 'That Bible isn\'t available with the current licence.';
  return raw;
}

/* The passage for a free-typed reference in a chosen Bible. Throws with a
   reader-facing message (and .detail for the logs) when it cannot. */
export async function getPassage(ref, translation) {
  ref = tidy(ref);
  translation = tidy(translation);
  if (!ref) { const e = new Error('Type a reference, for example John 3:16'); e.friendly = true; throw e; }
  const cacheKey = translation + '|' + ref.toLowerCase();
  const hit = passageCache.get(cacheKey);
  if (hit) return hit;
  try {
    await loadKeys();
    const record = translation ? await translationFor(translation) : null;
    const provider = record ? getProvider(record.providerId) : getProvider(null);
    // An id no source lists (a key removed, a stale link) falls back to the
    // default Bible rather than asking AO Lab for an id it has never heard of.
    if (!record) translation = '';
    let passage;
    if (provider.id === 'arisehub') {
      // AriseHub spans chapters, borrows notes and attaches audio itself.
      passage = await withDeadline(provider.getPassage(ref, translation), PASSAGE_DEADLINE, 'AriseHub');
    } else {
      const p = parseReference(ref);
      if (!p && provider.id !== 'bible-api') throw cannot(ref);
      const spanned = !!(p && p.chapterTo && p.chapterTo !== p.chapter);
      passage = await withDeadline(spanned
        ? spanChapters(provider, p, translation || undefined)
        : provider.getPassage(ref, translation || undefined), PASSAGE_DEADLINE, provider.label);
      // Study notes should be there whatever Bible was picked. If the selected
      // one carries none, borrow them and say where they came from.
      if (!(passage.footnotes && passage.footnotes.length)) {
        const notes = await annotationsFor(ref);
        if (notes.footnotes.length) { passage.footnotes = notes.footnotes; passage.footnotesFrom = notes.from; }
      }
      // The recordings live on the free copy of a translation; a licensed
      // edition of the SAME Bible gets them too. Never borrowed from a
      // different translation: a listener wants the words on screen.
      if (!spanned && !(passage.audio && passage.audio.length)) {
        const audio = await audioForTranslationName(ref, passage.translationName);
        if (audio.length) passage.audio = audio;
      }
    }
    if (record && record.name) passage.translationName = record.name;
    return passageCache.set(cacheKey, passage);
  } catch (e) {
    const raw = (e && e.message) || 'lookup failed';
    const err = new Error(e && e.friendly ? raw : readerMessage(raw));
    err.detail = raw;
    err.friendly = true;
    throw err;
  }
}

/* =========================================================================
   9. THE DICTIONARIES  (Easton 1897, Smith 1863 - via AriseHub)
   The dataset (neuu-org/bible-dictionary-dataset, CC BY 4.0) is already
   loaded in AriseHub, which answers these two questions for us. Without an
   AriseHub key the page simply has no dictionary.
   ========================================================================= */
export const DICTIONARY_ATTRIBUTION = 'Easton\'s Bible Dictionary (1897) and Smith\'s Bible Dictionary (1863), public domain. Dataset: neuu-org/bible-dictionary-dataset, CC BY 4.0.';
const dictCache = makeCache(60 * MINUTE);

async function dictionaryAvailable() { await loadKeys(); return !!(KEYS && KEYS.arisehub); }
/* No AriseHub key: the page hides the dictionary. A key but a failed call: the
   page keeps the dictionary and says it is unavailable right now. */
const NOT_CONFIGURED = { entries: [], available: false, configured: false };

/* Which dictionary entries discuss the passage on screen. */
export async function dictionaryReference(ref) {
  ref = tidy(ref);
  if (!(await dictionaryAvailable())) return NOT_CONFIGURED;
  if (!ref || !parseReference(ref)) return { entries: [], available: true, configured: true };
  const k = 'ref|' + ref.toLowerCase();
  const hit = dictCache.get(k);
  if (hit) return hit;
  const d = await hubGet('/api/bible/reference?ref=' + encodeURIComponent(ref));
  return dictCache.set(k, { entries: d.entries || [], attribution: DICTIONARY_ATTRIBUTION, available: true, configured: true });
}

/* Search by headword (q), browse a letter, or one full article (slug). */
export async function dictionaryLookup(opts) {
  opts = opts || {};
  if (!(await dictionaryAvailable())) return NOT_CONFIGURED;
  const slug = tidy(opts.slug).toLowerCase().slice(0, 120);
  const q = tidy(opts.q).slice(0, 80);
  const letter = tidy(opts.letter).toLowerCase().slice(0, 1);
  let path;
  if (slug) path = '/api/bible/dictionary?slug=' + encodeURIComponent(slug);
  else if (q) path = '/api/bible/dictionary?q=' + encodeURIComponent(q);
  else if (letter) path = '/api/bible/dictionary?letter=' + encodeURIComponent(letter);
  else return { entries: [], available: true, configured: true };
  const hit = dictCache.get(path);
  if (hit) return hit;
  const d = await hubGet(path);
  const out = slug ? { entry: d.entry || null, attribution: DICTIONARY_ATTRIBUTION, available: true, configured: true }
                   : { entries: d.entries || [], attribution: DICTIONARY_ATTRIBUTION, available: true, configured: true };
  return dictCache.set(path, out);
}

/* =========================================================================
   10. STATUS  (/_functions/bibleStatus)
   Which keys are set (names only), what each source answered, how many Bibles
   survive into the list. For checking the Secrets Manager after a publish.
   ========================================================================= */
export async function bibleStatus(refresh, unused) {
  forgetKeys();
  const keys = await keyStatus();
  if (refresh) catalogueCache.clear();
  const list = await allTranslations();
  const counts = {};
  list.forEach((t) => { counts[t.providerId] = (counts[t.providerId] || 0) + 1; });
  // ?unused=1: every English Bible a source offers that is NOT on the page -
  // the free ones curation left out, and the duplicates of ones already
  // listed under another source. For deciding what to add to KEYLESS_KEEP.
  let unusedOut;
  if (unused) {
    const listed = new Set(list.map(dedupeKey));
    unusedOut = {};
    Object.keys(offeredRows).forEach((id) => {
      const seen = new Set();
      unusedOut[id] = offeredRows[id].filter((t) => {
        const k = dedupeKey(t);
        if (listed.has(k) || seen.has(k)) return false;
        seen.add(k);
        return true;
      }).map((t) => t.id + ' | ' + t.name);
    });
  }
  // The bridge, end to end: trade the key for a session, then one dictionary
  // lookup. Says exactly which step failed and what AriseHub answered.
  let dictionary = { configured: !!keys.arisehub, ok: false, url: hubUrl() };
  if (keys.arisehub) {
    try {
      await hubToken(true);
      dictionary.session = 'ok';
      const d = await hubGet('/api/bible/reference?ref=' + encodeURIComponent('John 3'));
      dictionary.ok = true;
      dictionary.entriesForJohn3 = (d.entries || []).length;
    } catch (e) { dictionary.error = (e && e.message) || 'failed'; }
  }
  return {
    keys: keys,
    sources: PROVIDERS.map((p) => ({ id: p.id, label: p.label, keyless: p.keyless, configured: p.configured(),
      offered: offered[p.id] || 0, listed: counts[p.id] || 0, error: lastErrors[p.id] || undefined })),
    bibles: list.length,
    dictionary: dictionary,
    unused: unusedOut
  };
}
