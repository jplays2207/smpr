// SMPR — Application intake proxy
// Receives the apply form (POST) and forwards it to the Google Apps Script,
// which emails jassem@611capital.com and logs the application to the sheet.

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbz7Y3VgOevDk5bgmhUCpCOUQQUq9qtLaR6IXANRMmfB8ZDsF-QnbPnCoLdDLoCFcAEa/exec';

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    return res.status(405).send(JSON.stringify({ ok: false, error: 'method_not_allowed' }));
  }
  try {
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
    const upstream = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {}),
      redirect: 'follow',
    });
    const text = await upstream.text();
    return res.status(200).send(text);
  } catch (err) {
    return res.status(200).send(JSON.stringify({ ok: false, error: 'proxy_error' }));
  }
};
