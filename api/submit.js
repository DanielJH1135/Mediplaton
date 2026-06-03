// api/submit.js
export default async function handler(req, res) {
  // CORS 보안 및 POST 요청만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '허용되지 않는 요청 방식입니다.' });
  }

  // Vercel 서버에 숨겨둔 진짜 구글 주소 가져오기
  const GAS_URL = process.env.GAS_SECRET_URL;

  if (!GAS_URL) {
    return res.status(500).json({ error: '서버 환경 변수 세팅이 누락되었습니다.' });
  }

  try {
    // 사용자가 보낸 데이터를 백엔드가 대신 구글로 안전하게 배달 (주소 은닉)
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: '보안 서버 통신 실패' });
  }
}