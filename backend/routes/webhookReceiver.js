const express = require('express');
const router = express.Router();
const WebhookURL = require('../models/WebhookURL');
const WebhookLog = require('../models/WebhookLog');


router.post('/:slug', async (req, res) => {
    const { slug } = req.params;
    const payload = req.body;
    const headers = req.headers;
  
    try {
      // 1. Find webhook by slug
      const webhook = await WebhookURL.findOne({ where: { url_slug: slug } });
  
      if (!webhook) {
        return res.status(404).json({ message: 'Invalid Webhook URL' });
      }
  
      // 2. Save log
      await WebhookLog.create({
        webhook_id: webhook.id,
        payload,
        headers,
        status_code: 200,
        received_at: new Date(),
        replayed: false
      });
  
      // 3. Optional Alert if payload contains "error"
      const lowerPayload = JSON.stringify(payload).toLowerCase();
      if (lowerPayload.includes('error')) {
        console.log(`⚠️ Alert: Error detected in webhook payload for ${slug}`);
        // 👉 Add email/Slack integration here if needed
      }
  
      return res.status(200).json({ message: 'Webhook received and logged' });
  
    } catch (err) {
      console.error('Webhook error:', err.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  module.exports = router;