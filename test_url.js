const https = require('https');
https.get('https://ui-avatars.com/api/?name=Alex', (res) => {
  console.log('Status:', res.statusCode);
}).on('error', (e) => {
  console.error(e);
});
