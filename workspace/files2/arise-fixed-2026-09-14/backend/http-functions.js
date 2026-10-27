import { ok, badRequest, serverError, response } from 'wix-http-functions';
import wixData from 'wix-data';
import { contacts } from 'wix-crm-backend';
import { customTrigger } from '@wix/automations';
import { auth } from '@wix/essentials';

const TRIGGER_ID = '519d3164-8dae-4448-a362-35ff96ed2068';

/* Add a form type here before the element can use it. */
const ALLOWED = ['contact', 'serve', 'prayer', 'connect-host', 'connect-join'];

function clean(v, max) {
  return String(v == null ? '' : v).trim().slice(0, max || 2000);
}

export async function post_ariseForm(request) {
  try {
    const body = await request.body.json();

    const formType = clean(body.formType, 40).toLowerCase();
    if (ALLOWED.indexOf(formType) === -1) {
      return badRequest({ body: { error: 'unknown form' } });
    }

    const name    = clean(body.name, 120);
    const email   = clean(body.email, 200);
    const message = clean(body.message, 4000);

    if (!name || !email) return badRequest({ body: { error: 'name and email required' } });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return badRequest({ body: { error: 'invalid email' } });
    }

    const record = {
      formType: formType,
      name: name,
      email: email,
      phone:    clean(body.phone, 60),
      // connect-host / connect-join use these two for area and preferred day
      subject:  clean(body.subject, 200),
      position: clean(body.position, 120),
      message:  message,
      handled:  false
    };

    // 1. Store it first -- nothing is lost even if everything below fails.
    await wixData.insert('FormSubmissions', record, { suppressAuth: true });

    // 2. Add the sender to Contacts so they appear in your Inbox.
    let contactId = null;
    try {
      const parts = name.split(' ');
      const res = await contacts.appendOrCreateContact({
        name: { first: parts[0] || name, last: parts.slice(1).join(' ') || '' },
        emails: [{ email: email, primary: true, tag: 'MAIN' }],
        phones: record.phone ? [{ phone: record.phone, primary: true, tag: 'MOBILE' }] : []
      });
      contactId = res.contactId;
    } catch (cErr) {
      console.error('Contact create failed (submission still saved):', cErr);
    }

    // 3. Fire the automation.
    try {
      const runTrigger = auth.elevate(customTrigger.runTrigger);
      const payload = {
        formType: formType,
        name: name,
        email: email,
        phone:    record.phone    || '-',
        subject:  record.subject  || '-',
        position: record.position || '-',
        message:  message || '-'
      };
      if (contactId) payload.contactId = contactId;

      await runTrigger({ triggerId: TRIGGER_ID, payload: payload });
      console.log('Automation fired:', formType);
    } catch (tErr) {
      console.error('Automation trigger failed:', tErr);
    }

    return ok({ body: { ok: true } });

  } catch (err) {
    console.error('ariseForm failed:', err);
    return serverError({ body: { error: 'server error' } });
  }
}
/* =========================================================================
   BIBLE SEARCH  (added 2026-10-27)
   The Bible page's element calls these same-origin URLs; the Bible sources
   and their keys stay in backend/bible.js. All GET, all JSON, all public -
   they serve Scripture, not data about people.

     /_functions/bible?ref=John+3:16&translation=BSB   one passage
     /_functions/bibleBibles                            every Bible, one list
     /_functions/bibleBooks                             the 66 books + chapter counts
     /_functions/bibleReference?ref=John+3             dictionary entries citing the passage
     /_functions/bibleDictionary?q=shep | ?letter=s | ?slug=shepherd
     /_functions/bibleStatus[?refresh=1]                which keys are set, what each source answered

   /_functions/ URLs only run on the LIVE site, not in Preview. */
import { getPassage, allTranslations, bibleBooks, dictionaryReference, dictionaryLookup, bibleStatus } from 'backend/bible.js';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' };
function json(body, cacheSeconds) {
  const headers = Object.assign({}, JSON_HEADERS);
  if (cacheSeconds) headers['Cache-Control'] = 'public, max-age=' + cacheSeconds;
  else headers['Cache-Control'] = 'no-store';
  return ok({ headers: headers, body: JSON.stringify(body) });
}
function failed(status, body) {
  const opts = { headers: Object.assign({ 'Cache-Control': 'no-store' }, JSON_HEADERS), body: JSON.stringify(body) };
  if (status === 400) return badRequest(opts);
  if (status === 500) return serverError(opts);
  return response(Object.assign({ status: status }, opts));   // 502: the source failed, not this site
}
const q = (request, name, max) => clean(request && request.query && request.query[name], max || 200);

export async function get_bible(request) {
  const ref = q(request, 'ref', 120);
  const translation = q(request, 'translation', 80);
  if (!ref) return failed(400, { error: 'Type a reference, for example John 3:16' });
  try {
    return json(await getPassage(ref, translation), 300);
  } catch (e) {
    console.error('bible: ' + ref + ' [' + translation + '] -> ' + ((e && e.detail) || (e && e.message)));
    return failed(502, { error: (e && e.message) || 'lookup failed' });
  }
}

export async function get_bibleBibles() {
  try { return json({ translations: await allTranslations() }, 600); }
  catch (e) { console.error('bibleBibles', e); return failed(502, { error: 'The list of Bibles is unavailable right now.' }); }
}

export async function get_bibleBooks() {
  try { return json({ books: await bibleBooks() }, 86400); }
  catch (e) { console.error('bibleBooks', e); return failed(502, { error: 'The book list is unavailable right now.' }); }
}

export async function get_bibleReference(request) {
  const ref = q(request, 'ref', 120);
  if (!ref) return failed(400, { error: 'missing ref' });
  try { return json(await dictionaryReference(ref), 3600); }
  catch (e) { console.error('bibleReference', e); return json({ entries: [], available: false, configured: true, error: (e && e.message) || 'dictionary unavailable' }); }
}

export async function get_bibleDictionary(request) {
  try { return json(await dictionaryLookup({ q: q(request, 'q', 80), letter: q(request, 'letter', 1), slug: q(request, 'slug', 120) }), 3600); }
  catch (e) { console.error('bibleDictionary', e); return json({ entries: [], available: false, configured: true, error: (e && e.message) || 'dictionary unavailable' }); }
}

/* ?refresh=1 also refetches every source's catalogue; without it the counts
   are from the cached list (the keys are re-read either way). */
export async function get_bibleStatus(request) {
  try { return json(await bibleStatus(q(request, 'refresh', 4) === '1')); }
  catch (e) { console.error('bibleStatus', e); return failed(502, { error: (e && e.message) || 'status failed' }); }
}
