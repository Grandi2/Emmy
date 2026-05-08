Klik in het witte tekstvak waar **"Enter file contents here"** staat en plak dit erin:

```javascript
// CREATE PAYMENT — Vercel API Function

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { amount, description, bookingId, returnUrl } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Ongeldig bedrag' });
    }

    const MOLLIE_API_KEY = process.env.MOLLIE_API_KEY;
    if (!MOLLIE_API_KEY) {
      return res.status(500).json({ error: 'Mollie API key niet geconfigureerd' });
    }

    const mollieResponse = await fetch('https://api.mollie.com/v2/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MOLLIE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: { currency: 'EUR', value: parseFloat(amount).toFixed(2) },
        description: description || "Aanbetaling Emmy's Beauty Salon",
        redirectUrl: returnUrl || 'https://emmys-beauty-salon.vercel.app/?status=paid',
        webhookUrl: `${process.env.VERCEL_URL ? 'https://'+process.env.VERCEL_URL : 'https://emmys-beauty-salon.vercel.app'}/api/payment-webhook`,
        metadata: { bookingId: bookingId || 'no-id' }
      })
    });

    const payment = await mollieResponse.json();

    if (!mollieResponse.ok) {
      return res.status(mollieResponse.status).json({ error: payment.detail || payment.title });
    }

    return res.status(200).json({
      paymentId: payment.id,
      checkoutUrl: payment._links.checkout.href,
      status: payment.status
    });

  } catch (err) {
    return res.status(500).json({ error: 'Server fout: ' + err.message });
  }
}
```

Klik daarna **"Commit changes"** → **"Commit changes"** in het popup. 👍
