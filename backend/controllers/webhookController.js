const { nanoid } = require('nanoid');
const WebhookURL = require('../models/WebhookURL');

exports.createWebhook = async (req, res) => {
  try {
    const { description } = req.body;

    const slug = nanoid(12); // e.g. abc123xyz456

    const webhook = await WebhookURL.create({
      url_slug: slug,
      description,
      user_id: req.user.id
    });

    res.status(201).json({
      message: 'Webhook created',
      webhook_url: `/api/webhooks/${slug}`,
      slug: slug
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating webhook', error: err.message });
  }
};
