const express = require('express');
const router = express.Router();
const { createWebhook } = require('../controllers/webhookController');
const authMiddleware = require('../middleware/authMiddleware');
const WebhookURL = require('../models/WebhookURL');
const WebhookLog = require('../models/WebhookLog');


router.get('/', authMiddleware, async (req, res) => {
  try {
    const webhooks = await WebhookURL.findAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json(webhooks);
  } catch (err) {
    console.error('Error fetching webhooks:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:slug/logs', authMiddleware, async (req, res) => {
    try {
      const { slug } = req.params;
  
      // 1. Find webhook that belongs to the logged-in user
      const webhook = await WebhookURL.findOne({
        where: { url_slug: slug, user_id: req.user.id }
      });
  
      if (!webhook) {
        return res.status(404).json({ message: 'Webhook not found or unauthorized' });
      }
  
      // 2. Get all logs for that webhook
      const logs = await WebhookLog.findAll({
        where: { webhook_id: webhook.id },
        order: [['createdAt', 'DESC']],
      });
  
      res.json({ webhook: webhook.url_slug, logs });
  
    } catch (err) {
      console.error('Error fetching logs:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  });

router.post('/create', authMiddleware, createWebhook);

module.exports = router;