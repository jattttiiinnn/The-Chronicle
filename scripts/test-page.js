import http from 'http';

// Quick check if dev server is answering
http.get('http://127.0.0.1:5173/src/pages/StyleguidePage.jsx', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status code for StyleguidePage.jsx:', res.statusCode);
    if (res.statusCode !== 200) {
      console.log('Error content:', data);
    } else {
      console.log('File fetched successfully, size:', data.length);
    }
  });
}).on('error', err => {
  console.error('Fetch error:', err.message);
});
