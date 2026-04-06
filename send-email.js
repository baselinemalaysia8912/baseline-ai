export default {
  async fetch(request) {
    const url = new URL(request.url);
    const email = url.searchParams.get('email') || '';
    const name = url.searchParams.get('name') || 'there';
    const concerns = url.searchParams.get('concerns') || '-';
    const cluster = url.searchParams.get('cluster') || 'Hormonal health';
    const wellbeing = url.searchParams.get('wellbeing') || '-';
    const report = url.searchParams.get('report') || '';

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({error:'no email'}), {
        headers: {'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}
      });
    }

    const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#f11994;padding:28px;border-radius:12px 12px 0 0;text-align:center">
        <p style="font-size:22px;font-weight:bold;color:#fff;margin:0">Baseline AI</p>
      </div>
      <div style="background:#fff;padding:28px">
        <p style="font-size:18px;font-weight:bold;color:#1a1a1a">Hi ${name},</p>
        <p style="color:#666;line-height:1.7">Your personalised hormonal health snapshot is ready.</p>
        <div style="background:#fdf0f7;border-radius:12px;padding:16px;margin:16px 0">
          <p style="color:#f11994;font-weight:bold;font-size:10px;text-transform:uppercase;letter-spacing:1px">YOUR LIKELY HORMONAL PROFILE</p>
          <p style="font-weight:bold;color:#1a1a1a">${cluster}</p>
          <p style="color:#555;font-size:13px"><strong>Concerns:</strong> ${concerns}</p>
          <p style="color:#555;font-size:13px"><strong>Wellbeing:</strong> ${wellbeing}/5</p>
        </div>
        <p style="color:#555;font-size:13px;line-height:1.7">${report.replace(/\n/g,'<br/>')}</p>
        <a href="https://www.baselinemy.com/women-hormone-testing" style="display:block;background:#f11994;color:#fff;text-align:center;padding:14px;border-radius:12px;font-weight:bold;text-decoration:none;margin-top:20px">Book your hormone blood test</a>
        <a href="https://www.baselinemy.com/hormone-consultation" style="display:block;background:#1a1a1a;color:#fff;text-align:center;padding:13px;border-radius:12px;font-weight:bold;text-decoration:none;margin-top:8px">Book a consultation - RM 50</a>
      </div>
      <div style="background:#1a1a1a;padding:16px;border-radius:0 0 12px 12px;text-align:center">
        <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0">Baseline AI · baselinemy.com · © 2026 Sante Solutions</p>
      </div>
    </div>`;

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

    return new Response(JSON.stringify({status:'ok', data}), {
      headers: {'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}
    });
  }
};
