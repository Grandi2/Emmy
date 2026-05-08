Bestand 4 — `api/send-sms.js`:

Typ in het naamveld: `api/send-sms.js` en plak dit erin:

```javascript
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { to, message } = req.body;
    if (!to || !message) return res.status(400).json({ error: 'Telefoonnummer en bericht verplicht' });

    const CM_API_KEY = process.env.CM_API_KEY;
    if (!CM_API_KEY) return res.status(500).json({ error: 'SMS niet geconfigureerd' });

    let phone = to.replace(/\s|-/g, '');
    if (phone.startsWith('06')) phone = '+316' + phone.substring(2);
    else if (!phone.startsWith('+')) phone = '+' + phone;

    const cmResponse = await fetch('https://gw.cmtelecom.com/v1.0/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: {
          authentication: { producttoken: CM_API_KEY },
          msg: [{
            from: process.env.CM_SENDER || 'EmmysSalon',
            to: [{ number: phone }],
            body: { content: message }
          }]
        }
      })
    });

    if (cmResponse.ok) {
      return res.status(200).json({ success: true, to: phone });
    } else {
      const err = await cmResponse.text();
      return res.status(400).json({ error: 'SMS fout: ' + err });
    }

  } catch (err) {
    return res.status(500).json({ error: 'Server fout: ' + err.message });
  }
}
```

Commit → dan nog `vercel.json` en `index.html` uploaden. 👇
