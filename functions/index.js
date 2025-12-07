const functions = require('firebase-functions');
const https = require('https');

// CORS-enabled proxy for Bored API
exports.getActivity = functions.https.onRequest((req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const key = req.query.key;
  const apiUrl = key && !isNaN(key) 
    ? `https://bored-api.appbrewery.com/activity/${key}`
    : 'https://bored-api.appbrewery.com/random';

  https.get(apiUrl, (apiRes) => {
    let data = '';
    
    apiRes.on('data', (chunk) => {
      data += chunk;
    });
    
    apiRes.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        res.status(200).json(jsonData);
      } catch (err) {
        res.status(500).json({ error: 'Failed to parse API response' });
      }
    });
  }).on('error', (err) => {
    res.status(500).json({ error: 'Failed to fetch from Bored API', message: err.message });
  });
});


