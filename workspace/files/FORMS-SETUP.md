# Forms — built into the layout

**Yes, the forms can live inside the elements and route themselves.**

I was wrong earlier when I said they couldn't. Custom elements can't call Velo *backend modules* — but they **can** fetch a **Velo HTTP Function**, which is a real URL on your own site. Same origin, no auth, no page code.

One element, three forms, one backend file.

---

## How it works

```
arise-form element  →  POST /_functions/ariseForm  →  http-functions.js
                                                         ├── saves to Form Submissions (CMS)
                                                         └── emails the right address
```

Which form appears is set by an attribute in the Editor:

| Page | Attribute | Fields | Goes to |
|---|---|---|---|
| Contact | `data-form="contact"` | Name, Email, Phone, Subject, Message | arisenow.church@gmail.com |
| Serve | `data-form="serve"` | Name, Email, Phone, Position, Notes | arisenow.church@gmail.com |
| Anywhere | `data-form="prayer"` | Name, Email, Prayer Request | arisechurchprayer@gmail.com |

The **Serve** form's Position dropdown is your five real roles: Children's Department, Outreach, Media/Social Media, Edge/X Edge, Maintenance.

---

## 1. Backend — `backend/http-functions.js`

Velo sidebar → **Backend** → the file must be named exactly `http-functions.js`.

```javascript
import { ok, badRequest, serverError } from 'wix-http-functions';
import wixData from 'wix-data';
import { triggeredEmails } from 'wix-crm-backend';

// Where each form goes. Change these addresses if routing changes.
const ROUTES = {
  contact: 'arisenow.church@gmail.com',
  serve:   'arisenow.church@gmail.com',
  prayer:  'arisechurchprayer@gmail.com'
};

function clean(v, max) {
  return String(v == null ? '' : v).trim().slice(0, max || 2000);
}

export async function post_ariseForm(request) {
  try {
    const body = await request.body.json();

    const formType = clean(body.formType, 40).toLowerCase();
    if (!ROUTES[formType]) return badRequest({ body: { error: 'unknown form' } });

    const name    = clean(body.name, 120);
    const email   = clean(body.email, 200);
    const message = clean(body.message, 4000);

    if (!name || !email) return badRequest({ body: { error: 'name and email required' } });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return badRequest({ body: { error: 'invalid email' } });
    }

    const record = {
      formType,
      name,
      email,
      phone:    clean(body.phone, 60),
      subject:  clean(body.subject, 200),
      position: clean(body.position, 120),
      message,
      handled:  false
    };

    // 1. Always store it — nothing is lost even if email fails.
    await wixData.insert('FormSubmissions', record, { suppressAuth: true });

    // 2. Notify. Requires a triggered email named "formSubmission" — see below.
    try {
      await triggeredEmails.emailContact('formSubmission', ROUTES[formType], {
        variables: {
          formType, name, email,
          phone: record.phone || '-',
          subject: record.subject || '-',
          position: record.position || '-',
          message: message || '-'
        }
      });
    } catch (mailErr) {
      console.error('Form email failed (submission still saved):', mailErr);
    }

    return ok({ body: { ok: true } });

  } catch (err) {
    console.error('ariseForm failed:', err);
    return serverError({ body: { error: 'server error' } });
  }
}
```

---

## 2. The element

Paste `arise-form.js` into `public/custom-elements/`.

Then on each page: **Add → Embed Code → Custom Element → Choose Source → Velo file → `arise-form.js`**, tag name **`arise-form`**.

**Then set the attribute.** In the element's settings there's a place to add custom attributes:

```
name:   data-form
value:  contact        (or serve, or prayer)
```

Stretch it full width. That's the whole setup — same element on every page, different attribute.

---

## 3. Email notifications — one dashboard step

The backend saves every submission to the CMS regardless. For email on top:

**Dashboard → Automations → New Automation**
- Trigger: **Velo code trigger** (or Triggered Email)
- Name the trigger exactly: **`formSubmission`**
- Action: **Send an email**
- Available variables: `formType` `name` `email` `phone` `subject` `position` `message`

**If you skip this**, submissions still save — you'd just check the CMS instead of your inbox. Nothing is lost either way.

---

## Where submissions live

**CMS → Form Submissions.** Every entry has the form type, all fields, and a `handled` checkbox so you can track what's been answered.

That's better than Wix Forms in one respect: **you own the data**, and it's queryable.

---

## What the visitor sees

Required fields marked in red. Inline validation before anything is sent — empty required fields and malformed emails are caught in the browser. The email format is checked again on the server, so it can't be bypassed.

On success, the form is replaced by a thank-you panel. On failure, an error appears **with your email address as a fallback**, so a broken form never means a lost visitor.

---

## Two honest notes

**Test on the published site.** `/_functions/` URLs don't resolve in Preview.

**This replaces the Wix form on Contact.** Once it's working, remove the old one — otherwise you have two forms doing the same job and submissions split between two places.
