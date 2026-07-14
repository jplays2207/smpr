// SMPR — Member Portal proxy
// Forwards read-only requests to the Google Apps Script that reads the
// "SMPR Members" sheet, so the browser calls a same-origin endpoint and the
// script URL / member codes never touch the client. Read-only (GET) only.

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbz7Y3VgOevDk5bgmhUCpCOUQQUq9qtLaR6IXANRMmfB8ZDsF-QnbPnCoLdDLoCFcAEa/exec';

module.exports = async (req, res) => {
  try {
    const q = req.query || {};
    const params = new URLSearchParams();
    params.set('action', String(q.action || ''));
    if (q.no) params.set('no', String(q.no));
    if (q.code) params.set('code', String(q.code));

    const upstream = await fetch(APPS_SCRIPT_URL + '?' + params.toString(), {
      redirect: 'follow',
    });
    const text = await upstream.text();

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(text);
  } catch (err) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({ ok: false, error: 'proxy_error' }));
  }
};
