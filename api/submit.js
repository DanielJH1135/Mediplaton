export default async function handler(req, res) {
  // POST 요청이 아니면 입구 컷
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않는 요청 방식입니다.' });
  }

  // 🔥 사장님이 새로 주신 정확한 주소를 백엔드 코드에 직접 매립 (브라우저 F12에선 절대 안 보임)
  const GAS_URL = "https://script.google.com/macros/s/AKfycbxWcBJJllgTxEolLTIrUPPMhj9WmeiWOXeDzkPbVXKGX-LaeeiW5r_NBOh2J04Y4BSN/exec";

  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const resText = await response.text();
    
    try {
      // 구글이 정상적으로 JSON을 반환한 경우 그대로 토스
      const data = JSON.parse(resText);
      return res.status(200).json(data);
    } catch (parseError) {
      // 구글 스크립트가 성공 후 리다이렉트나 텍스트를 반환하더라도 유연하게 성공 처리
      if (resText.includes('success') || response.ok) {
        return res.status(200).json({ result: 'success' });
      }
      return res.status(500).json({ error: '구글 응답 파싱 실패', details: resText });
    }
  } catch (error) {
    return res.status(500).json({ error: '보안 서버 통신 실패', message: error.message });
  }
}