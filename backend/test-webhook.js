const axios = require('axios');

// Replace with your webhook slug
const webhookSlug = 'SFOzgoj3dWuN';

// Sample payload
const payload = {
  event: 'test_event',
  data: {
    message: 'Hello from the test script!',
    timestamp: new Date().toISOString()
  }
};

// Send the webhook
async function sendWebhook() {
  try {
    console.log(`Sending webhook to: http://localhost:5001/api/receive/${webhookSlug}`);
    const response = await axios.post(`http://localhost:5001/api/receive/${webhookSlug}`, payload);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error sending webhook:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

sendWebhook(); 