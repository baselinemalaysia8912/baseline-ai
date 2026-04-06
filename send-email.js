exports.handler = async function(event) {
  const p = event.queryStringParameters || {};
  
  const email    = p.email    || '';
  const name     = p.name     || 'there';
  const concerns = p.concerns || '-';
  const cluster  = p.cluster  || 'Hormonal health assessment';
  const wellbeing= p.wellbeing|| '-';
  const report   = p.report   || '';

  if (!email || !email.includes('@')) {
    return { statusCode: 400, body: JSON.stringify({ error: 'no email' }) };
  }

  // Build report sections HTML
  let sectionsHTML = '';
  if (report) {
    const colors = {
      'WHAT YOUR HORMONES MAY BE DOING': '#f11994',
      'PREDICTIVE HORMONE PICTURE': '#7c3aed',
      'DIET RECOMMENDATIONS FOR YOUR PROFILE': '#10b981',
      'LIFESTYLE ADJUSTMENTS THAT MATTER FOR YOU': '#f59e0b',
      'YOUR NEXT BEST STEP': '#3b82f6'
    };
    const lines = decodeURIComponent(report).split('\n').filter(l => l.trim());
    let currentTitle = '', currentBody = '';
    const flush = () => {
      if (!currentTitle || !currentBody) return;
      const color = colors[currentTitle] || '#f11994';
      sectionsHTML += `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px">
        <tr><td style="border-left:3px solid ${color};padding:12px 16px;background:#fafafa">
        <p style="font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:${color};margin:0 0 8px;font-family:Arial,sans-serif">${currentTitle}</p>
        <p style="font-size:13px;color:#444;line-height:1.7;margin:0;font-family:Arial,sans-serif">${currentBody.trim()}</p>
        </td></tr></table>`;
    };
    for (const line of lines) {
      const upper = line.trim().toUpperCase();
      const isHeader = Object.keys(colors).some(k => upper.includes(k));
      if (isHeader) { flush(); currentTitle = upper; currentBody = ''; }
      else currentBody += line.trim() + ' ';
    }
    flush();
  }

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#fdf0f7;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
<tr><td align="center" style="background:#f11994;padding:32px;border-radius:16px 16px 0 0">
  <p style="font-size:24px;font-weight:bold;color:#fff;margin:0;font-family:Arial,sans-serif">Baseline AI</p>
  <p style="font-size:12px;color:rgba(255,255,255,0.85);margin:6px 0 0;font-family:Arial,sans-serif">Malaysia's First AI-Powered Hormonal Health Platform</p>
</td></tr>
<tr><td style="background:#fff;padding:36px 32px">
  <p style="font-size:20px;font-weight:bold;color:#1a1a1a;margin:0 0 10px;font-family:Arial,sans-serif">Hi ${name},</p>
  <p style="font-size:15px;color:#666;line-height:1.7;margin:0 0 24px;font-family:Arial,sans-serif">Your personalised hormonal health snapshot is ready. Here is your full report.</p>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf0f7;border-radius:14px;margin-bottom:24px">
  <tr><td style="padding:20px 22px">
    <p style="font-size:10px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#f11994;margin:0 0 10px;font-family:Arial,sans-serif">YOUR LIKELY HORMONAL PROFILE</p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:14px"><tr>
    <td style="background:#1a1a1a;padding:8px 18px;border-radius:99px">
      <p style="font-size:13px;font-weight:bold;color:#fff;margin:0;font-family:Arial,sans-serif">${cluster}</p>
    </td></tr></table>
    <p style="font-size:13px;color:#555;margin:0 0 5px;font-family:Arial,sans-serif"><strong>Main concerns:</strong> ${concerns}</p>
    <p style="font-size:13px;color:#555;margin:0;font-family:Arial,sans-serif"><strong>Wellbeing score:</strong> ${wellbeing}/5</p>
  </td></tr></table>
  ${sectionsHTML ? `<p style="font-size:15px;font-weight:bold;color:#1a1a1a;margin:0 0 14px;font-family:Arial,sans-serif">Your full health snapshot</p>${sectionsHTML}` : ''}
  <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 12px"><tr>
  <td style="background:#f11994;border-radius:12px;padding:16px;text-align:center">
    <a href="https://www.baselinemy.com/women-hormone-testing" style="font-size:16px;font-weight:bold;color:#fff;text-decoration:none;font-family:Arial,sans-serif">Book your hormone blood test</a>
  </td></tr></table>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px"><tr>
  <td style="border:1.5px solid #f0e0ec;border-radius:12px;padding:14px;text-align:center">
    <a href="https://www.baselinemy.com/hormone-consultation" style="font-size:14px;font-weight:bold;color:#f11994;text-decoration:none;font-family:Arial,sans-serif">Book a consultation - RM 50</a>
  </td></tr></table>
  <p style="font-size:11px;color:#bbb;text-align:center;margin:0;font-family:Arial,sans-serif">Predictive snapshot — not a medical diagnosis. Confirm with a licensed Baseline practitioner.</p>
</td></tr>
<tr><td style="background:#1a1a1a;padding:22px;border-radius:0 0 16px 16px;text-align:center">
  <p style="font-size:11px;color:rgba(255,255,255,0.4);margin:0;font-family:Arial,sans-serif">Baseline AI · baselinemy.com · @baseline_my · © 2026 Sante Solutions</p>
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
      from: 'Baseline AI <onboarding@resend.dev>',
      to: email,
      subject: 'Your Baseline Health Snapshot - ' + name,
      html: html
    })
  });

  const data = await res.json();
  console.log('Resend response:', JSON.stringify(data));

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ status: 'ok', data })
  };
};
