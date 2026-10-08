/* ===========================================================================
   SAMPLE FIXTURES — what the Velo page code would hand each element.
   Shapes follow the backend functions in the setup docs (CMS-SETUP.md,
   CONNECT-SETUP.md, CREATIVES-SETUP.md, SERVE-SETUP.md, CLASSES-SETUP.md,
   GALLERY-SETUP.md, EVENTS-SETUP.md, HOME-VIDEO-SETUP.md).

   Where the real CMS content is known from the docs it is used verbatim.
   Anything the docs don't contain (connect groups, class rows, gallery
   captions, past-event images) is clearly marked "Sample" in the text so it
   cannot be mistaken for real church content.
   =========================================================================== */
'use strict';
const M = 'https://static.wixstatic.com/media/';
const PHOTO = {
  worship:  M + 'c3b2d0_df139d07e67d499993dc5818894f91d1~mv2.jpg',
  service:  M + 'c3b2d0_f30b31e02f5c43cd8f33555c4ab08705~mv2.jpg',
  kids:     M + '1f9fa2_a5448e514cc14ea08cb657e4f1a9cec4~mv2.jpg',
  youth:    M + '1f9fa2_89a44a65090b488ea33de3157f4f3490~mv2.png',
  youthBanner: M + 'c3b2d0_c1f923bf8bb745849bb220060de02a39~mv2.jpg',
  outreach: M + '1f9fa2_2aea5b909f5e467b9d6aa1c30e513ce4~mv2.png',
  supplies: M + '1f9fa2_ef28ad94288a4068ac9c2974b4d4d545~mv2.jpg',
  thrive:   M + '1f9fa2_deb5664679744b2ab198359ec71b4c0d~mv2.jpg',
  mvmt:     M + 'c3b2d0_d18e07d364724ff2b5f01b9f17d78cba~mv2.png',
  leadLogo: M + 'c3b2d0_1c539649f39f48cbb157d4e27efeb843~mv2.png',
  welcome:  M + 'c3b2d0_418deb3b5dbb44d0a443dfd47e8ce6c5~mv2.png',
  superkid: M + '1f9fa2_8c21ef4200d44594bcec41ac5680c2c0~mv2.jpg',
  outpour:  M + '1f9fa2_35234420e1e74e65948de03315c3003a~mv2.png',
  campusPineville:  '/assets/campus-pineville@2x.jpg',
  campusAlexandria: '/assets/campus-alexandria@2x.jpg'
};

function gallery(items) {
  return items.map((it, i) => ({
    src: it[0], alt: it[1], caption: 'Sample gallery item ' + (i + 1) + ' — ' + it[1]
  }));
}

module.exports = {
  /* CMS -> Leaders (6 rows per CMS-SETUP.md). Shape: getLeaders(). */
  leaders: [
    { name: 'Bryant & Vanessa Sanders', role: 'Apostle · Pastor & Prophet', featured: true,
      photo: M + '1f9fa2_e137cc6737284d6694200ea8feda5552~mv2.png',
      bio: 'Apostle Bryant Sanders leads Arise Church and the Lead Network. Pastor Vanessa Sanders serves as Prophet, offering insight and guidance to our community.' },
    { name: 'Norman and Margie Youngblood', role: 'Elder · Pastoral Team', featured: false,
      photo: M + '1f9fa2_b3cdea954391493eba6f3f63878bf2d4~mv2.png',
      bio: 'Norman serves as one of our elders and is an integral part of our pastoral team. Margie serves on the praise and worship team.' },
    { name: 'Chad and Tabitha Kerik', role: 'Elders · Youth Ministers', featured: false,
      photo: M + '1f9fa2_4fb0f121cb08443a8ca1f72286449c12~mv2.png',
      bio: 'Elders, Youth Ministers, and Leaders of Thrive for young adults.' },
    { name: 'Herbert and Erica Perry', role: 'Minister', featured: false,
      photo: M + '1f9fa2_4b62ef589ff047009574fdceb6c39e18~mv2.png',
      bio: 'Herbert serves as one of our ministers, leading with passion and grace.' },
    { name: 'Will Robertson', role: 'Pastor', featured: false,
      photo: M + '1f9fa2_76391dad01a64c3ba6df7e2e76c77ba8~mv2.png',
      bio: 'An essential member of our Pastoral Team, serving our community with kindness and compassion.' },
    { name: 'Ethan Mayes', role: 'Minister · Worship', featured: false,
      photo: M + '1f9fa2_32361ebeaf7d4f2095bdb7383421ad6d~mv2.png',
      bio: 'A committed member of our praise and worship team and one of our ministers.' }
  ],

  /* CMS -> Ministries (8 rows). Shape: getMinistries() -> {title, cat, link, img, soon}. */
  ministries: [
    { title: 'Lead Network',            cat: 'Learn More', link: '/lead-network', img: PHOTO.leadLogo, soon: false },
    { title: "Children's Ministry",     cat: 'Learn More', link: '/childrens',    img: PHOTO.kids,     soon: false },
    { title: 'Youth Ministry',          cat: 'Learn More', link: '/youth',        img: PHOTO.youth,    soon: false },
    { title: 'Outreach',                cat: 'Learn More', link: '/outreach',     img: PHOTO.outreach, soon: false },
    { title: 'Thrive For Young Adults', cat: '', link: '', img: PHOTO.thrive,  soon: true },
    { title: 'Mvmt 6:14',               cat: '', link: '', img: PHOTO.mvmt,    soon: true },
    { title: 'Worship Team',            cat: '', link: '', img: PHOTO.worship, soon: true },
    { title: 'In Edge/ X Edge',         cat: '', link: '', img: PHOTO.service, soon: true }
  ],

  /* Wix Events via getEvents(). The upcoming event is the real one from the
     element's own FALLBACK; the past events are real past event NAMES from the
     Aug 17 audit with placeholder images. */
  events: {
    upcoming: [{
      title: 'The Lead Network 2026 Camp Meeting: The Outpour',
      shortDescription: 'Impartation and Activation of Spiritual Gifts by the Holy Spirit',
      image: PHOTO.outpour,
      dateLine: 'October 30, 2026 at 10:00 AM – November 1, 2026 at 12:30 PM',
      startMonth: 'Oct', startDay: '30', startDate: 'October 30, 2026',
      location: 'Arise Church, 501 Ates Rd, Pineville, LA 71360, USA',
      url: '/events-1/the-lead-network-2026-camp-meeting-the-outpour',
      cta: 'RSVP', ctaEnabled: true
    }],
    past: [
      { title: 'Kidz Kamp (sample past event)',            image: PHOTO.kids,     url: '/events-1/kidz-kamp',            startDate: 'June 2026',   cta: 'View Event', ctaEnabled: true },
      { title: 'Father Figure Brunch (sample past event)', image: PHOTO.service,  url: '/events-1/father-figure-brunch', startDate: 'June 2026',   cta: 'View Event', ctaEnabled: true },
      { title: "Men's Retreat (sample past event)",        image: PHOTO.worship,  url: '/events-1/mens-retreat',         startDate: 'April 2026',  cta: 'View Event', ctaEnabled: true },
      { title: 'Women Rising (sample past event)',         image: PHOTO.service,  url: '/events-1/women-rising',         startDate: 'March 2026',  cta: 'View Event', ctaEnabled: true },
      { title: 'Thrive Lake Day (sample past event)',      image: PHOTO.thrive,   url: '/events-1/thrive-lake-day',      startDate: 'August 2025', cta: 'View Event', ctaEnabled: true }
    ]
  },

  /* CMS -> ServePositions (7 rows per SERVE-SETUP.md). */
  servePositions: [
    { title: "Children's Department", description: 'Teach, assist, or nurture our youngest members.', team: "Children's Ministry", image: '', urgent: true },
    { title: 'Outreach', description: "Share God's love through community service and evangelism.", team: 'Outreach', image: '', urgent: true },
    { title: 'Media / Social Media', description: 'Manage online presence, create content, and spread the word.', team: 'Arise Creative Arts', image: '', urgent: false },
    { title: 'Edge / X Edge', description: 'Support youth and young adult programs with energy and creativity.', team: 'Youth & Young Adults', image: '', urgent: false },
    { title: 'Maintenance', description: 'Keep our facilities safe, clean, and welcoming.', team: 'Facilities', image: '', urgent: false },
    { title: 'Praise & Worship', description: '(Sample description) Vocalists for Sunday services and Glory Night.', team: 'Arise Creative Arts', image: '', urgent: false },
    { title: 'Production & Sound', description: '(Sample description) Lights, screens, and sound on Sunday mornings.', team: 'Arise Creative Arts', image: '', urgent: false }
  ],

  /* CMS -> ConnectGroups. The live collection is empty ("Groups are forming").
     Two SAMPLE groups so the card layout and Join pre-fill can be seen. */
  connectGroups: [
    { title: 'Sample Group — Tuesday Night in Tioga', hostName: 'Sample Host', day: 'Tuesday', time: '7:00 PM',
      location: 'A home in Tioga', dates: 'Sept 16 – Nov 18', audience: 'Families',
      description: 'Sample group listing. Real groups are added in CMS → ConnectGroups.', flyer: PHOTO.service, isFull: false },
    { title: 'Sample Group — Thursday at the Main Campus', hostName: 'Sample Host', day: 'Thursday', time: '6:30 PM',
      location: 'Arise Church, Main Campus', dates: 'Sept 18 – Nov 20', audience: 'Men',
      description: 'Sample group listing marked full, to show the Full badge and disabled button.', flyer: PHOTO.worship, isFull: true }
  ],

  /* CMS -> CreativeDepartments / CreativeMembers (CREATIVES-SETUP.md). */
  creativeDepts: [
    { name: 'Praise & Worship',       slug: 'praise-worship', tagline: 'Vocalists',                 description: '', groupPhoto: '', pageLink: '/praise-worship' },
    { name: 'Musicians',              slug: 'musicians',      tagline: 'The band',                  description: '', groupPhoto: '', pageLink: '/musicians' },
    { name: 'Production',             slug: 'production',     tagline: 'Lights, screens, stage',    description: '', groupPhoto: '', pageLink: '/production' },
    { name: 'Sound',                  slug: 'sound',          tagline: 'Front of house',            description: '', groupPhoto: '', pageLink: '/sound' },
    { name: 'Media',                  slug: 'media-team',     tagline: 'Photo, video, livestream',  description: '', groupPhoto: '', pageLink: '/media-team' },
    { name: 'Social Media & Content', slug: 'content',        tagline: 'Social media and content',  description: '', groupPhoto: '', pageLink: '/content' }
  ],
  creativeMembers: [
    { name: 'Kristina Robinson', department: 'Praise & Worship', role: 'Praise Team Leader', bio: '', photo: '/assets/kristina-robinson-arise.jpg', isLeader: true },
    { name: 'Ethan Mayes', department: 'Praise & Worship', role: '', bio: '', photo: '', isLeader: false },
    { name: 'Linda',       department: 'Praise & Worship', role: '', bio: '', photo: '', isLeader: false },
    { name: 'Yolanda',     department: 'Praise & Worship', role: '', bio: '', photo: '', isLeader: false },
    { name: 'Brandis',     department: 'Praise & Worship', role: '', bio: '', photo: '', isLeader: false },
    { name: 'Cailey',      department: 'Praise & Worship', role: '', bio: '', photo: '', isLeader: false },
    { name: 'Margie Youngblood', department: 'Praise & Worship', role: '', bio: '', photo: '', isLeader: false },
    { name: 'Thelma',      department: 'Praise & Worship', role: '', bio: '', photo: '', isLeader: false },
    { name: 'Nick',        department: 'Musicians',  role: '', bio: '', photo: '', isLeader: false },
    { name: 'Geremiah',    department: 'Musicians',  role: '', bio: '', photo: '', isLeader: false },
    { name: 'Darek',       department: 'Production', role: '', bio: '', photo: '', isLeader: false },
    { name: 'Ronnie',      department: 'Production', role: '', bio: '', photo: '', isLeader: false },
    { name: 'Brandon',     department: 'Production', role: '', bio: '', photo: '', isLeader: false },
    { name: 'Ty',          department: 'Sound',      role: '', bio: '', photo: '', isLeader: false },
    { name: 'Bradly',      department: 'Media',      role: '', bio: '', photo: '', isLeader: false }
  ],

  /* Wix Online Programs via getPrograms(). The live site has no published
     program (CLASSES-SETUP.md), so these two are SAMPLE rows. */
  classes: [
    { id: 'sample-1', title: 'Sample Class — Pathway to Discipleship (In Person)', details: 'Sample class card. Real classes come from Wix Online Programs once one is published.',
      image: PHOTO.service, price: 'Free', steps: 6, sections: 2, selfPaced: false, duration: '6 weeks', url: '/classes/sample-in-person' },
    { id: 'sample-2', title: 'Sample Class — Pathway to Discipleship (Online)', details: 'Sample self-paced class card.',
      image: PHOTO.worship, price: 'Free', steps: 6, sections: 2, selfPaced: true, url: '/classes/sample-online' }
  ],

  /* Portfolio galleries via the GALLERY-SETUP.md page code -> data-photos. */
  galleryChildrens:   gallery([[PHOTO.kids, "Children's ministry"], [PHOTO.welcome, 'Welcome graphic'], [PHOTO.superkid, 'Superkid Academy'], [PHOTO.service, 'Sunday service'], [PHOTO.campusPineville, 'Main Campus, Pineville'], [PHOTO.worship, 'Worship'], [PHOTO.kids, "Children's ministry"]]),
  galleryYouth:       gallery([[PHOTO.youthBanner, 'Youth banner'], [PHOTO.youth, 'Youth ministry'], [PHOTO.service, 'Sunday service'], [PHOTO.worship, 'Worship'], [PHOTO.thrive, 'Thrive'], [PHOTO.campusPineville, 'Main Campus, Pineville'], [PHOTO.youth, 'Youth ministry']]),
  galleryOutreach:    gallery([[PHOTO.outreach, 'Outreach'], [PHOTO.supplies, 'Supplies'], [PHOTO.service, 'Sunday service'], [PHOTO.campusAlexandria, 'Second Campus, Alexandria'], [PHOTO.worship, 'Worship'], [PHOTO.outreach, 'Outreach'], [PHOTO.campusPineville, 'Main Campus, Pineville']]),
  galleryLeadNetwork: gallery([[PHOTO.outpour, 'The Outpour'], [PHOTO.leadLogo, 'Lead Network'], [PHOTO.service, 'Sunday service'], [PHOTO.worship, 'Worship'], [PHOTO.campusPineville, 'Main Campus, Pineville'], [PHOTO.mvmt, 'Mvmt 6:14'], [PHOTO.outpour, 'The Outpour']]),
  homePhotos:         gallery([[PHOTO.worship, 'Worship'], [PHOTO.service, 'Sunday service'], [PHOTO.kids, "Children's ministry"], [PHOTO.campusPineville, 'Main Campus, Pineville'], [PHOTO.youth, 'Youth ministry'], [PHOTO.outreach, 'Outreach'], [PHOTO.campusAlexandria, 'Second Campus, Alexandria'], [PHOTO.thrive, 'Thrive']]),

  /* Portfolio "Exciting News" project -> data-news on the home hero. */
  homeNews: [
    { title: 'Sample news item — The Outpour, Oct 30 – Nov 1', src: PHOTO.outpour, alt: 'The Outpour camp meeting poster', link: '/events' },
    { title: 'Sample news item — Fall Connect Groups are forming', src: PHOTO.service, alt: 'Sunday service', link: '/connect-groups' }
  ],

  /* CMS -> HomeSettings (HOME-VIDEO-SETUP.md). No video uploaded yet, so the
     element falls back to the photo collage, exactly as on the live site. */
  homeCulture: { videoId: '', poster: '', heading: 'This Is Arise', kicker: 'Church Culture', active: false }
};
