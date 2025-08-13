# Square Developer Dashboard Webhook Setup Guide

## Required Configuration for Production Payments

Your Square application needs webhook endpoints configured to properly handle payment events. Here's how to set it up:

### 1. Get Your Webhook URL

Your webhook endpoint is: `https://YOUR_REPLIT_DOMAIN/api/webhooks/square`

Replace `YOUR_REPLIT_DOMAIN` with your actual Replit domain (visible in the browser URL).

### 2. Square Developer Dashboard Setup

1. **Login to Square Developer Dashboard**
   - Go to: https://developer.squareup.com/apps
   - Select your application

2. **Configure Webhooks**
   - Go to "Webhooks" section in your app
   - Click "Add Endpoint"
   - Enter your webhook URL: `https://YOUR_REPLIT_DOMAIN/api/webhooks/square`

3. **Subscribe to Events**
   Select these payment-related events:
   - `payment.created`
   - `payment.updated` 
   - `payment.completed`
   - `payment.failed`

4. **Webhook Signature**
   - Copy the "Signature Key" from Square
   - Add it to your .env file as: `SQUARE_WEBHOOK_SIGNATURE_KEY=your_signature_key_here`

### 3. Production vs Sandbox

**For Production:**
- Use production webhook URL with your production Square app
- Make sure SQUARE_ENVIRONMENT=production in .env

**For Testing:**
- Use the same webhook URL with your sandbox Square app
- Set SQUARE_ENVIRONMENT=sandbox in .env

### 4. Test the Webhook

1. In Square Dashboard, use the "Test Webhook" feature
2. Check your Replit console logs for webhook receipt confirmation
3. You should see: "Square webhook received" in the logs

### 5. Common Issues

**Webhook Not Receiving Events:**
- Check that your Replit app is running and accessible
- Verify the webhook URL is exactly correct
- Ensure your domain is publicly accessible (not behind auth)

**SSL/HTTPS Issues:**
- Square requires HTTPS webhooks
- Replit provides HTTPS by default - no additional setup needed

### 6. Security Notes

- Never expose your Square access tokens in client-side code
- Always verify webhook signatures in production
- Store sensitive keys in environment variables only

## Current Webhook Implementation

The webhook endpoint `/api/webhooks/square` is set up to:
- Log incoming webhook data for debugging
- Acknowledge receipt to Square
- Handle payment state changes (when implemented)

Next steps would be to add proper signature verification and business logic to handle different payment events.