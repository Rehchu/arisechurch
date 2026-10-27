/* Sample backend for the Bible Search preview and the element checks.
   Answers the same URLs the live /_functions/ do, with sample data. The verse
   text is the King James Version (public domain) whatever Bible is picked;
   the live site reads each Bible from its own source. */
(function () {
  var BIBLES = [
    ['111', 'New International Version'], ['59', 'English Standard Version'], ['116', 'New Living Translation'],
    ['1588', 'Amplified Bible'], ['1849', 'The Passion Translation'], ['114', 'New King James Version'],
    ['2692', 'New American Standard Bible 2020'], ['1713', 'Christian Standard Bible'], ['97', 'The Message'],
    ['eng_kjv', 'King James Version'], ['BSB', 'Berean Standard Bible', true], ['ENGWEBP', 'World English Bible'],
    ['eng_net', 'NET Bible'], ['eng_lsv', 'Literal Standard Version'], ['eng_fbv', 'Free Bible Version'],
    ['eng_asv', 'American Standard Version'], ['eng_gnv', 'Geneva Bible'], ['eng_dby', 'Darby Translation'],
    ['eng_ylt', "Young's Literal Translation"], ['eng_dra', 'Douay-Rheims 1899 American Edition'],
    ['eng_bbe', 'Bible in Basic English'], ['eng_pev', 'Plain English Version'], ['eng_t4t', 'Translation for Translators'],
    ['eng_jps', 'JPS TaNaKH 1917'], ['eng_wmb', 'World Messianic Bible'], ['AAB', 'Accessible Ancients Bible', true],
    ['LEB', 'Lexham English Bible'], ['eng_kja', 'King James Version + Apocrypha'], ['1171', 'New Revised Standard Version'],
    ['100', 'New American Standard Bible 1995'], ['1932', 'Free Bible Version NT'], ['eng_t4t2', 'Easy-to-Read Version']
  ].map(function (b) { var o = { id: b[0], name: b[1], language: 'English', providerId: 'sample' }; if (b[2]) o.hasAudio = true; return o; })
   .sort(function (a, b) { return a.name.localeCompare(b.name); });

  var BOOKS = [['GEN','Genesis',50],['EXO','Exodus',40],['LEV','Leviticus',27],['NUM','Numbers',36],['DEU','Deuteronomy',34],['JOS','Joshua',24],['JDG','Judges',21],['RUT','Ruth',4],
    ['1SA','1 Samuel',31],['2SA','2 Samuel',24],['1KI','1 Kings',22],['2KI','2 Kings',25],['1CH','1 Chronicles',29],['2CH','2 Chronicles',36],['EZR','Ezra',10],['NEH','Nehemiah',13],
    ['EST','Esther',10],['JOB','Job',42],['PSA','Psalms',150],['PRO','Proverbs',31],['ECC','Ecclesiastes',12],['SNG','Song of Solomon',8],['ISA','Isaiah',66],['JER','Jeremiah',52],
    ['LAM','Lamentations',5],['EZK','Ezekiel',48],['DAN','Daniel',12],['HOS','Hosea',14],['JOL','Joel',3],['AMO','Amos',9],['OBA','Obadiah',1],['JON','Jonah',4],['MIC','Micah',7],
    ['NAM','Nahum',3],['HAB','Habakkuk',3],['ZEP','Zephaniah',3],['HAG','Haggai',2],['ZEC','Zechariah',14],['MAL','Malachi',4],['MAT','Matthew',28],['MRK','Mark',16],['LUK','Luke',24],
    ['JHN','John',21],['ACT','Acts',28],['ROM','Romans',16],['1CO','1 Corinthians',16],['2CO','2 Corinthians',13],['GAL','Galatians',6],['EPH','Ephesians',6],['PHP','Philippians',4],
    ['COL','Colossians',4],['1TH','1 Thessalonians',5],['2TH','2 Thessalonians',3],['1TI','1 Timothy',6],['2TI','2 Timothy',4],['TIT','Titus',3],['PHM','Philemon',1],['HEB','Hebrews',13],
    ['JAS','James',5],['1PE','1 Peter',5],['2PE','2 Peter',3],['1JN','1 John',5],['2JN','2 John',1],['3JN','3 John',1],['JUD','Jude',1],['REV','Revelation',22]]
    .map(function (b) { return { osis: b[0], name: b[1], chapters: b[2] }; });

  var JOHN3 = [
    "There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:",
    "The same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him.",
    "Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.",
    "Nicodemus saith unto him, How can a man be born when he is old? can he enter the second time into his mother's womb, and be born?",
    "Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God.",
    "That which is born of the flesh is flesh; and that which is born of the Spirit is spirit.",
    "Marvel not that I said unto thee, Ye must be born again.",
    "The wind bloweth where it listeth, and thou hearest the sound thereof, but canst not tell whence it cometh, and whither it goeth: so is every one that is born of the Spirit.",
    "Nicodemus answered and said unto him, How can these things be?",
    "Jesus answered and said unto him, Art thou a master of Israel, and knowest not these things?",
    "Verily, verily, I say unto thee, We speak that we do know, and testify that we have seen; and ye receive not our witness.",
    "If I have told you earthly things, and ye believe not, how shall ye believe, if I tell you of heavenly things?",
    "And no man hath ascended up to heaven, but he that came down from heaven, even the Son of man which is in heaven.",
    "And as Moses lifted up the serpent in the wilderness, even so must the Son of man be lifted up:",
    "That whosoever believeth in him should not perish, but have eternal life.",
    "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    "For God sent not his Son into the world to condemn the world; but that the world through him might be saved.",
    "He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God.",
    "And this is the condemnation, that light is come into the world, and men loved darkness rather than light, because their deeds were evil.",
    "For every one that doeth evil hateth the light, neither cometh to the light, lest his deeds should be reproved.",
    "But he that doeth truth cometh to the light, that his deeds may be made manifest, that they are wrought in God.",
    "After these things came Jesus and his disciples into the land of Judaea; and there he tarried with them, and baptized.",
    "And John also was baptizing in Aenon near to Salim, because there was much water there: and they came, and were baptized.",
    "For John was not yet cast into prison.",
    "Then there arose a question between some of John's disciples and the Jews about purifying.",
    "And they came unto John, and said unto him, Rabbi, he that was with thee beyond Jordan, to whom thou barest witness, behold, the same baptizeth, and all men come to him.",
    "John answered and said, A man can receive nothing, except it be given him from heaven.",
    "Ye yourselves bear me witness, that I said, I am not the Christ, but that I am sent before him.",
    "He that hath the bride is the bridegroom: but the friend of the bridegroom, which standeth and heareth him, rejoiceth greatly because of the bridegroom's voice: this my joy therefore is fulfilled.",
    "He must increase, but I must decrease.",
    "He that cometh from above is above all: he that is of the earth is earthly, and speaketh of the earth: he that cometh from heaven is above all.",
    "And what he hath seen and heard, that he testifieth; and no man receiveth his testimony.",
    "He that hath received his testimony hath set to his seal that God is true.",
    "For he whom God hath sent speaketh the words of God: for God giveth not the Spirit by measure unto him.",
    "The Father loveth the Son, and hath given all things into his hand.",
    "He that believeth on the Son hath everlasting life: and he that believeth not the Son shall not see life; but the wrath of God abideth on him."
  ];
  var PSALM23 = [
    "The LORD is my shepherd; I shall not want.",
    "He maketh me to lie down in green pastures: he leadeth me beside the still waters.",
    "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
    "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.",
    "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.",
    "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever."
  ];
  var TEXTS = {
    'JHN|3': JOHN3, 'PSA|23': PSALM23,
    'ROM|8': { 28: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.",
               29: "For whom he did foreknow, he also did predestinate to be conformed to the image of his Son, that he might be the firstborn among many brethren.",
               38: "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come,",
               39: "Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord." },
    '1CO|13': { 4: "Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,",
                5: "Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil;",
                6: "Rejoiceth not in iniquity, but rejoiceth in the truth;",
                7: "Beareth all things, believeth all things, hopeth all things, endureth all things." },
    'PHP|4': { 6: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.",
               7: "And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus." },
    'ISA|40': { 31: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint." }
  };
  var NOTES = { 'JHN|3': [
    { verse: 3, text: 'Or born from above; also in verse 7.', caller: 'a' },
    { verse: 8, text: 'The Greek word for Spirit is also the word for wind.', caller: 'b' },
    { verse: 13, text: 'Some manuscripts include who is in heaven.', caller: 'c' },
    { verse: 16, text: 'Or his one and only Son.', caller: 'd' },
    { verse: 36, text: 'Or disobeys the Son', caller: 'e' } ],
    'PSA|23': [ { verse: 4, text: 'Or the valley of deep darkness', caller: 'a' }, { verse: 6, text: 'Or and I will return to', caller: 'b' } ] };
  var DICT = {
    'JHN|3': [
      { slug: 'nicodemus', name: 'Nicodemus', sources: ['Easton', 'Smith'], verses: [1, 4, 9], excerpt: "The victory of the people, a Pharisee and ruler of the Jews, and a teacher of Israel (John 3:1, 10), whose timidity would not allow him to come to Jesus by day. He afterwards spoke on his behalf before the Sanhedrin (John 7:50-52), and after the crucifixion brought a mixture of myrrh and aloes to embalm his body (John 19:39)." },
      { slug: 'pharisees', name: 'Pharisees', sources: ['Easton', 'Smith'], verses: [1], excerpt: "Separatists (Heb. persahin, from parash, to separate). They were probably the successors of the Assideans (i.e., the pious), a party that originated in the time of Antiochus Epiphanes in revolt against his heathenizing policy. The first mention of them is in a description by Josephus of the three sects or schools into which the Jews were divided." },
      { slug: 'regeneration', name: 'Regeneration', sources: ['Easton'], verses: [3, 5, 7], excerpt: "Only found in Matt. 19:28 and Titus 3:5. This word literally means a new birth. The Greek word so rendered (palingenesia) is used by classical writers with reference to the changes produced by the return of spring. In Matt. 19:28 the word is equivalent to the establishing of the kingdom of God." },
      { slug: 'serpent-brazen', name: 'Serpent, Brazen', sources: ['Easton', 'Smith'], verses: [14], excerpt: "The symbol of healing which Moses set up in the wilderness (Num. 21:4-9). Our Lord refers to it in John 3:14, 15, as a type of his being lifted up on the cross." },
      { slug: 'aenon', name: 'Aenon', sources: ['Easton', 'Smith'], verses: [23], excerpt: "Springs, a place near Salim where John baptized (John 3:23). It was probably near the upper source of the Wady Far'ah, an open valley extending from Mount Ebal to the Jordan." }
    ],
    'PSA|23': [
      { slug: 'shepherd', name: 'Shepherd', sources: ['Easton', 'Smith'], verses: [1], excerpt: "A word naturally of frequent occurrence in Scripture. Sometimes the word shepherd is used figuratively to denote a civil ruler, and a spiritual guide. The duties of a shepherd in an unenclosed country like Palestine were very onerous." },
      { slug: 'rod', name: 'Rod', sources: ['Easton'], verses: [4], excerpt: "(Heb. matteh), a staff or wand used by travellers and shepherds, as a weapon and a support. Used figuratively of the authority of a ruler, and of the shepherd's care." }
    ]
  };
  var FULL = {
    nicodemus: [{ source: 'Easton', text: "The victory of the people, a Pharisee and ruler of the Jews, and a teacher of Israel (John 3:1, 10), whose timidity would not allow him to come to Jesus by day. He afterwards spoke on his behalf before the Sanhedrin (John 7:50-52), and after the crucifixion brought a mixture of myrrh and aloes to embalm his body (John 19:39). Tradition says he became a follower of Christ and was baptized by Peter and John." },
                { source: 'Smith', text: "A Pharisee, a ruler of the Jews and a teacher of Israel, whose secret visit to our Lord was the occasion of the discourse recorded only by St. John. In Nicodemus a noble candor and a simple love of truth shine out in the midst of hesitation and fear of man." }]
  };
  function silence() {
    var rate = 8000, secs = 2, n = rate * secs, buf = new ArrayBuffer(44 + n), v = new DataView(buf);
    var w = function (o, s) { for (var i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); w(36, 'data'); v.setUint32(40, n, true);
    for (var i = 0; i < n; i++) v.setUint8(44 + i, 128);
    var bytes = new Uint8Array(buf), s = ''; for (var j = 0; j < bytes.length; j++) s += String.fromCharCode(bytes[j]);
    return 'data:audio/wav;base64,' + btoa(s);
  }
  var SILENCE = null;

  var ALIAS = { john: 'JHN', jn: 'JHN', psalm: 'PSA', psalms: 'PSA', ps: 'PSA', romans: 'ROM', rom: 'ROM', '1 corinthians': '1CO', '1 cor': '1CO', philippians: 'PHP', phil: 'PHP', isaiah: 'ISA', isa: 'ISA',
                matthew: 'MAT', matt: 'MAT', genesis: 'GEN', gen: 'GEN', luke: 'LUK', acts: 'ACT', mark: 'MRK', revelation: 'REV', hebrews: 'HEB', james: 'JAS', ephesians: 'EPH', galatians: 'GAL' };
  function parse(ref) {
    var m = String(ref).trim().toLowerCase().match(/^([123]?\s*[a-z ]+?)\s*(\d+)(?::(\d+)(?:-(\d+))?)?$/);
    if (!m) return null;
    var name = m[1].trim().replace(/\s+/g, ' ');
    var osis = ALIAS[name];
    if (!osis) { var b = BOOKS.filter(function (x) { return x.name.toLowerCase() === name; })[0]; if (b) osis = b.osis; }
    if (!osis) return null;
    var book = BOOKS.filter(function (x) { return x.osis === osis; })[0];
    return { osis: osis, book: book, chapter: Number(m[2]), from: m[3] ? Number(m[3]) : undefined, to: m[4] ? Number(m[4]) : (m[3] ? Number(m[3]) : undefined) };
  }
  function query(path) { var out = {}; (path.split('?')[1] || '').split('&').forEach(function (kv) { var p = kv.split('='); if (p[0]) out[decodeURIComponent(p[0])] = decodeURIComponent((p[1] || '').replace(/\+/g, ' ')); }); return out; }
  var delay = function (v, ms) { return new Promise(function (r) { setTimeout(function () { r(v); }, ms || 350); }); };
  var fail = function (msg) { return new Promise(function (_, rej) { setTimeout(function () { rej(new Error(msg)); }, 350); }); };

  window.__abiMock = function (path) {
    var fn = path.split('?')[0], qs = query(path);
    if (fn === 'bibleBibles') return delay({ translations: BIBLES }, 500);
    if (fn === 'bibleBooks') return delay({ books: BOOKS }, 300);
    if (fn === 'bible') {
      var p = parse(qs.ref || '');
      if (!p) return fail('Couldn’t understand “' + qs.ref + '” — try e.g. John 3:16');
      if (p.chapter > p.book.chapters) return fail('This Bible doesn’t include that passage — try another translation.');
      var bible = BIBLES.filter(function (b) { return b.id === qs.translation; })[0] || BIBLES.filter(function (b) { return b.id === 'eng_kjv'; })[0];
      var key = p.osis + '|' + p.chapter, src = TEXTS[key], verses = [];
      if (Array.isArray(src)) src.forEach(function (t, i) { verses.push({ book: p.book.name, chapter: p.chapter, verse: i + 1, text: t }); });
      else if (src) Object.keys(src).forEach(function (n) { verses.push({ book: p.book.name, chapter: p.chapter, verse: Number(n), text: src[n] }); });
      else for (var i = 1; i <= 12; i++) verses.push({ book: p.book.name, chapter: p.chapter, verse: i, text: '(Preview) The live site reads ' + p.book.name + ' ' + p.chapter + ':' + i + ' from the ' + bible.name + ' here.' });
      if (p.from !== undefined) verses = verses.filter(function (v) { return v.verse >= p.from && v.verse <= p.to; });
      if (!verses.length) return fail('No verses found for that reference');
      var label = p.book.name + ' ' + p.chapter + (p.from !== undefined ? ':' + p.from + (p.to !== p.from ? '-' + p.to : '') : '');
      var out = { reference: label, translation: bible.id, translationName: bible.name, providerId: 'sample', verses: verses, text: verses.map(function (v) { return v.text; }).join(' '),
        copyright: bible.id === 'eng_kjv' ? 'Public domain.' : 'Preview: sample text shown is the King James Version. The live site shows the ' + bible.name + ' from its licensed source, with its own copyright line.' };
      var notes = (NOTES[key] || []).filter(function (f) { return verses.some(function (v) { return v.verse === f.verse; }); });
      if (notes.length) { out.footnotes = notes; if (bible.id !== 'BSB') out.footnotesFrom = 'Berean Standard Bible'; }
      if (bible.hasAudio) { SILENCE = SILENCE || silence(); out.audio = [{ narrator: 'Hays', url: SILENCE }, { narrator: 'Souer', url: SILENCE + '#2' }]; }
      return delay(out, 450);
    }
    if (fn === 'bibleReference') {
      var pr = parse(qs.ref || '');
      var list = pr ? (DICT[pr.osis + '|' + pr.chapter] || []) : [];
      if (pr && pr.from !== undefined) list = list.filter(function (e) { return e.verses.some(function (v) { return v >= pr.from && v <= pr.to; }); });
      return delay({ entries: list, available: true, attribution: "Easton's Bible Dictionary (1897) and Smith's Bible Dictionary (1863), public domain. Dataset: neuu-org/bible-dictionary-dataset, CC BY 4.0." }, 500);
    }
    if (fn === 'bibleDictionary') {
      if (qs.slug) { var e = Object.keys(DICT).reduce(function (acc, k) { return acc || DICT[k].filter(function (x) { return x.slug === qs.slug; })[0]; }, null);
        return delay({ entry: e ? { slug: e.slug, name: e.name, sources: e.sources, definitions: FULL[e.slug] || [{ source: e.sources[0], text: e.excerpt + ' (Preview: the full entry loads on the live site.)' }] } : null, available: true }, 400); }
      var q = String(qs.q || '').toLowerCase(), all = [];
      Object.keys(DICT).forEach(function (k) { DICT[k].forEach(function (e) { if (!all.some(function (x) { return x.slug === e.slug; })) all.push(e); }); });
      return delay({ entries: all.filter(function (e) { return e.name.toLowerCase().indexOf(q) === 0; }), available: true }, 400);
    }
    return fail('unknown');
  };
})();
