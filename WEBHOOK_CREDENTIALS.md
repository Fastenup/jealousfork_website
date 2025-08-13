# Square Webhook Credentials Storage

## Where to Store Square Webhook Secrets

### Environment Variables (.env file)
Add these to your `.env` file after setting up webhooks in Square Developer Dashboard:

```bash
# Square Webhook Signature Keys
SQUARE_WEBHOOK_SIGNATURE_KEY=your_payment_webhook_signature_key_here
SQUARE_SUBSCRIPTION_WEBHOOK_SIGNATURE_KEY=your_subscription_webhook_signature_key_here

# Square Application IDs (if different for webhooks)
SQUARE_WEBHOOK_APP_ID=your_webhook_app_id_here
```

## How to Get These Values

### 1. Payment Webhook Signature Key
1. Go to Square Developer Dashboard → Your App → Webhooks
2. Click on your "Jealous Fork Payment Webhook" endpoint
3. Copy the "Signature Key" 
4. Add to `.env` as `SQUARE_WEBHOOK_SIGNATURE_KEY`

### 2. Subscription Webhook Signature Key  
1. Click on your "Jealous Fork Subscription Webhook" endpoint
2. Copy the "Signature Key"
3. Add to `.env` as `SQUARE_SUBSCRIPTION_WEBHOOK_SIGNATURE_KEY`

### 3. Application/Subscription IDs
- These are usually the same as your main Square Application ID
- Only add separate webhook app ID if Square generates different ones for webhooks

## Security Notes

- Never commit `.env` file to version control
- Keep signature keys secure - they verify webhook authenticity
- Each webhook endpoint has its own unique signature key
- Use different keys for production vs sandbox environments

## Testing Webhook Security

Once configured, you can verify signatures in the webhook endpoints:

```javascript
const crypto = require('crypto');
const signature = req.headers['x-square-signature'];
const body = req.body;
const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;

// Verify signature matches
const expectedSignature = crypto
  .createHmac('sha256', signatureKey)
  .update(body)
  .digest('base64');
```

This ensures webhooks are actually coming from Square, not malicious sources.