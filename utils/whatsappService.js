// const fetch = require('node-fetch');
// const dotenv = require('dotenv');

// dotenv.config();

// const sendWhatsAppMessage = async (to, message) => {
//   try {
//     const response = await fetch(process.env.WHATSAPP_API_URL, {
//       method: 'POST',
//       headers: {
//         apikey: process.env.WHATSAPP_API_KEY,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         from: process.env.WHATSAPP_FROM_NUMBER,
//         campaignName: 'api-test',
//         to: to,
//         templateName: 'register',
//         type: 'template',
//         otp: `${message}`,
//       }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to send WhatsApp message');
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error sending WhatsApp message:', error.message);
//     throw new Error('Failed to send WhatsApp message');
//   }
// };

// module.exports = { sendWhatsAppMessage };



const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();

const sendWhatsAppMessage = async (to, templateName, content) => {
  try {
    const response = await fetch(process.env.WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        apikey: process.env.WHATSAPP_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.WHATSAPP_FROM_NUMBER,
        campaignName: 'api-test',
        to: to,
        templateName: templateName,  // Allow different templates to be used
        type: 'template',
        content: content, // Use dynamic content (can be OTP or any other data)
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send WhatsApp message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending WhatsApp message:', error.message);
    throw new Error('Failed to send WhatsApp message');
  }
};

module.exports = { sendWhatsAppMessage };
