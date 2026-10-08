import { ok, badRequest, serverError } from 'wix-http-functions';
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
