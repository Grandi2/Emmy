Top! Nu de andere 3 bestanden. Ga terug naar je repository en klik op **"creating a new file"**.

**Bestand 2 — `api/check-payment.js`**

Typ in het naamveld: `api/check-payment.js` en plak dit erin:

```javascript
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const paymentId = req.query.id;
    if (!paymentId) return res.status(400).json({ error: 'Payment ID ontbreekt' });

    const MOLLIE_API_KEY = process.env.MOLLIE_API_KEY;
    if (!MOLLIE_API_KEY) return res.status(500).json({ error: 'Mollie niet geconfigureerd' });

    const mollieResponse = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${MOLLIE_API_KEY}` }
    });

    const payment = await mollieResponse.json();
    if (!mollieResponse.ok) return res.status(mollieResponse.status).json({ error: payment.detail });

    return res.status(200).json({
      paymentId: payment.id,
      status: payment.status,
      isPaid: payment.status === 'paid',
      isFailed: ['failed','canceled','expired'].includes(payment.status),
      amount: payment.amount,
      metadata: payment.metadata
    });

  } catch (err) {
    return res.status(500).json({ error: 'Server fout: ' + err.message });
  }
}
```

Commit → dan geef ik je bestand 3. 👇
