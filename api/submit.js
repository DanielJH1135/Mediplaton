export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;

    // 1. [구글 시트 전송] 배포하신 구글 웹앱 주소를 여기에 넣어주세요
    const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxWcBJJllgTxEolLTIrUPPMhj9WmeiWOXeDzkPbVXKGX-LaeeiW5r_NBOh2J04Y4BSN/exec";

    const googleResponse = await fetch(GAS_WEB_APP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const googleData = await googleResponse.json();

    // 2. [디스코드 전송] 이제 안전한 Vercel 인프라 서버에서 직접 디스코드로 로켓 발사!
    const discordWebhookUrl = "https://discord.com/api/webhooks/1511709116035502150/qooURmb7DKbGkvGIO2LF26kNKri1_1I_CSF89Y6M3HCRjkj5rW5jnrZgd3jrY7xnKUdR";
    
    const discordPayload = {
      username: "메디플라톤 알림봇",
      embeds: [{
        title: "🏥 CPA 신규 병원장 DB 인입 (Vercel 안전 적재)",
        color: 3447003,
        fields: [
          { name: "병 의원명", value: formData.hospital_name || "상담 시 확인", inline: true },
          { name: "원장 약사명", value: formData.manager_name || "상담 시 확인", inline: true },
          { name: "연락처", value: formData.phone || "상담 시 확인", inline: false },
          { name: "보유 자산을 활용한 자금조달 유형", value: "상담 시 확인", inline: true },
          { name: "필요 자금 규모", value: "상담 시 확인", inline: true }
        ],
        footer: { text: "KS 대구지사 데이터 센터" }
      }]
    };

    // 디스코드로 동시 발사 (차단될 확률 0%)
    await fetch(discordWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload),
    }).catch(err => console.error("디스코드 전송 실패:", err));

    // 구글 시트 결과 리턴
    return res.status(200).json(googleData);

  } catch (error) {
    console.error("서버 내부 에러:", error);
    return res.status(500).json({ result: 'error', message: error.toString() });
  }
}
