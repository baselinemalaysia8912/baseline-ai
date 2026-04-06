export default {
  async fetch(request) {
    const url = new URL(request.url);
    const email    = url.searchParams.get('email') || '';
    const name     = url.searchParams.get('name') || 'there';
    const concerns = url.searchParams.get('concerns') || '-';
    const cluster  = url.searchParams.get('cluster') || 'Hormonal health';
    const wellbeing= url.searchParams.get('wellbeing') || '-';
    const report   = url.searchParams.get('report') || '';

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({error:'no email'}), {
        headers: {'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}
      });
    }

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#fdf0f7;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
<tr><td align="center" style="background:#f11994;padding:32px;border-radius:16px 16px 0 0">
  <p style="font-size:24px;font-weight:bold;color:#fff;margin:0">Baseline AI</p>
  <p style="font-size:12px;color:rgba(255,255,255,0.85);margin:6px 0 0">Malaysia's First AI-Powered Hormonal Health Platform</p>
</td></tr>
<tr><td style="background:#fff;padding:36px 32px">
  <p style="font-size:20px;font-weight:bold;color:#1a1a1a;margin:0 0 10px">Hi ${name},</p>
  <p style="font-size:15px;color:#666;line-height:1.7;margin:0 0 24px">Your personalised hormonal health snapshot is ready.</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf0f7;border-radius:14px;margin-bottom:24px">
  <tr><td style="padding:20px 22px">
    <p style="font-size:10px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#f11994;margin:0 0 10px">YOUR LIKELY HORMONAL PROFILE</p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:14px"><tr>
    <td style="background:#1a1a1a;padding:8px 18px;border-radius:99px">
      <p style="font-size:13px;font-weight:bold;color:#fff;margin:0">${cluster}</p>
    </td></tr></table>
    <p style="font-size:13px;color:#555;margin:0 0 5px"><strong>Main concerns:</strong> ${concerns}</p>
    <p style="font-size:13px;color:#555;margin:0"><strong>Wellbeing score:</strong> ${wellbeing}/5</p>
  </td></tr></table>
  <p style="font-size:13px;color:#444;line-height:1.7;margin:0 0 20px">${report.replace(/\n/g,'<br/>')}</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px"><tr>
  <td style="background:#f11994;border-radius:12px;padding:16px;text-align:center">
    <a href="https://www.baselinemy.com/women-hormone-testing" style="font-size:16px;font-weight:bold;color:#fff;text-decoration:none">Book your hormone blood test</a>
  </td></tr></table>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px"><tr>
  <td style="border:1.5px solid #f0e0ec;border-radius:12px;padding:14px;text-align:center">
    <a href="https://www.baselinemy.com/hormone-consultation" style="font-size:14px;font-weight:bold;color:#f11994;text-decoration:none">Book a consultation - RM 50</a>
  </td></tr></table>
  <p style="font-size:11px;color:#bbb;text-align:center;margin:0">Predictive snapshot - not a medical diagnosis.</p>
</td></tr>
<tr><td style="background:#1a1a1a;padding:22px;border-radius:0 0 16px 16px;text-align:center">
  <p style="font-size:11px;color:rgba(255,255,255,0.4);margin:0">Baseline AI · baselinemy.com · © 2026 Sante Solutions</p>
</td></tr>
</table></td></tr></table>
</body></html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer re_TcXSEVSx_9RqdXy2arrtL3JpifMi65viz',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Baseline AI <hello@baselinemy.com>',
        to: email,
        subject: 'Your Baseline Health Snapshot - ' + name,
        html: html
      })
    });

    const data = await res.json();

    return new Response(JSON.stringify({status:'ok', data}), {
      headers: {'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}
    });
  }
};
