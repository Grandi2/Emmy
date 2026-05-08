Top! Nu bestand 3 — `api/payment-webhook.js`:

Typ in het naamveld: `api/payment-webhook.js` en plak dit erin:

```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const paymentId = req.body?.id;
    if (!paymentId) return res.status(400).send('Missing payment ID');

    const MOLLIE_API_KEY = process.env.MOLLIE_API_KEY;
    const mollieResponse = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${MOLLIE_API_KEY}` }
    });

    const payment = await mollieResponse.json();
    console.log(`Webhook: payment ${paymentId} status = ${payment.status}`);

    return res.status(200).send('OK');
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(500).send('Server error');
  }
}
```

Commit → dan geef ik je bestand 4. 👇
