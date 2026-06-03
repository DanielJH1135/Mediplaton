import React, { useState, useEffect } from 'react';

export default function LandingPage() {
  const [formData, setFormData] = useState({
    hospital_name: '',
    manager_name: '',
    phone: '',
    asset_type: '카드매출 (월 5천 이상)',
    funds: '1억원 내외'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 🔥 Q&A 아코디언 상태 관리 토글 (클릭 시 열리고 닫히는 기능)
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  // 1. 매체사 광고 추적 픽셀 엔진 (PageView)
  useEffect(() => {
    const gaId = import.meta.env.VITE_GA_TRACKING_ID;
    const metaId = import.meta.env.VITE_META_PIXEL_ID;
    const daangnId = import.meta.env.VITE_DAANGN_PIXEL_ID;

    if (window.gtag && gaId) window.gtag('config', gaId);
    if (window.fbq && metaId) {
      window.fbq('init', metaId);
      window.fbq('track', 'PageView');
    }
    if (window.dv && daangnId) {
      window.dv('init', daangnId);
      window.dv('track', 'ViewContent');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 🔒 내부 보안 릴레이 서버리스 주소
    const GAS_WEB_APP_URL = "/api/submit";

    try {
      const response = await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const resData = await response.json();
      
      if (resData.result === 'success') {
        // 2. 광고 매체사 전환(Lead) 스크립트 발사
        if (window.gtag) window.gtag('event', 'generate_lead', { currency: 'KRW', value: 0 });
        if (window.fbq) window.fbq('track', 'Lead');
        if (window.dv) window.dv('track', 'CompleteRegistration');

        alert('한도 조회가 정상적으로 접수되었습니다. 담당 매니저가 곧 연락드립니다.');
        setFormData({ hospital_name: '', manager_name: '', phone: '', asset_type: '카드매출 (월 5천 이상)', funds: '1억원 내외' });
      } else {
        alert('접수 중 오류가 발생했습니다: ' + JSON.stringify(resData));
      }
    } catch (error) {
      console.error(error);
      alert('서버 연결 실패. 네트워크 상태를 확인해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // FAQ 데이터 구조 정의
  const faqData = [
    {
      q: "단순 한도 조회만 해도 신용점수에 영향이 가나요?",
      a: "아니요, 전혀 영향이 없습니다. 본 서비스는 정식 금융권 가이드라인을 준수하는 간이 사전 심사 방식으로 진행되므로, 단순 한도 확인만으로는 신용점수 하락이나 타 금융권 조회 이력이 남지 않으니 안심하고 조회하셔도 됩니다."
    },
    {
      q: "DSR 규제 제약 제로가 정말 합법적으로 가능한가요?",
      a: "네, 100% 합법적인 금융 구조입니다. 일반 가계 대출이나 시설 자금 대출과 달리, 의료기기 리스 운용 및 자산 유동화 방식을 채택하기 때문에 개인 DSR 부채 비율 산정에서 전면 제외됩니다. 이미 1금융권 기대출 한도가 꽉 차 있으신 원장님들께서도 추가 자금을 대규모로 확보하실 수 있는 핵심 비결입니다."
    },
    {
      q: "종합소득세 비용처리와 부가세 환급 혜택의 원리가 무엇인가요?",
      a: "매월 발행되는 리스료 세금계산서를 통해 종합소득세 신고 시 전액 합법적인 필요경비(손비) 처리가 인정되어 원장님의 최고 세율 소득 구간 자체를 하향 안정화할 수 있습니다. 또한, 장비 도입 시 발생하는 부가세는 매입세액공제 전담 프로세스를 통해 안전하게 전액 환급받으실 수 있도록 세무 가이드를 함께 지원합니다."
    },
    {
      q: "진행 과정에서 별도의 컨설팅 수수료나 중개 비용 요구가 있나요?",
      a: "절대 없습니다. 저희 솔루션은 금융사 및 여신전문금융기관과의 정식 업무 가맹 계약에 의해 운영되므로, 원장님께 어떠한 명목의 수수료, 취급 수수료, 진행비 명목의 선입금도 요구하지 않으며 이는 법적으로 전면 금지되어 있습니다."
    },
    {
      q: "신청 후 실제 승인 및 집행까지 기간이 얼마나 걸리나요?",
      a: "무료 접수 완료 후 영업일 기준 24시간 이내에 전담 메디컬 금융 매니저가 배정되어 1차 비대면 가이드를 드립니다. 이후 정식 심사 승인은 평균 2~3일 내에 완료되며, 최종 계약 조율 후 의료기기 대금 지급 및 자금 집행까지는 평균 1주일 이내에 신속하게 마무리됩니다."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      
      {/* 1. Hero 섹션 */}
      <section className="relative bg-gradient-to-br from-slate-900 to-indigo-950 text-white py-20 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="md:w-1/2 space-y-6">
            <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              메디컬 금융 솔루션
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight break-keep">
              의료기기 · 인테리어 비용,<br />
              <span className="text-indigo-400">그냥 리스</span>로 하십니까?
            </h1>
            <p className="text-slate-300 text-lg">
              DSR 규제 제약 제로! 의사 면허 보유 시 최대 3억 무담보 지원. 100% 부가세 환급과 전액 비용처리로 종합소득세 구간을 낮추십시오.
            </p>
          </div>
          
          <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center relative">
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <img 
                src="/images/hero-doctor.jpg" 
                alt="메디컬 파이낸스 가이드" 
                className="w-full h-full object-cover"
                onError={(e) => { 
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80'; 
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. 핵심 요약 실적 지표 섹션 */}
      <section className="py-12 bg-white border-b border-slate-100 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4">
            <p className="text-3xl md:text-4xl font-black text-indigo-600">1,080억+</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">누적 매출 성과</p>
          </div>
          <div className="p-4">
            <p className="text-3xl md:text-4xl font-black text-indigo-600">83%</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">심사 승인율</p>
          </div>
          <div className="p-4">
            <p className="text-3xl md:text-4xl font-black text-indigo-600">1,700건+</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">누적 신청 건수</p>
          </div>
          <div className="p-4">
            <p className="text-3xl md:text-4xl font-black text-indigo-600">97%</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">고객 만족도</p>
          </div>
        </div>
      </section>

      {/* 3. 리드 수집 신청 폼 섹션 */}
      <section className="py-16 px-4 max-w-xl mx-auto">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 transition-all duration-300 hover:shadow-2xl">
          <h3 className="text-2xl font-bold text-center mb-2">원장님 전용 무료 한도 조회</h3>
          <p className="text-center text-sm text-slate-500 mb-8">입력하신 정보는 암호화 처리되며, 단순 조회는 신용도에 무해합니다.</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700">병·의원명 / 진료과목</label>
              <input 
                type="text" required placeholder="예: OO의원" 
                className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.hospital_name} onChange={(e) => setFormData({...formData, hospital_name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">원장님 성함</label>
                <input 
                  type="text" required placeholder="홍길동" 
                  className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={formData.manager_name} onChange={(e) => setFormData({...formData, manager_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">연락처</label>
                <input 
                  type="tel" required placeholder="010-XXXX-XXXX" 
                  className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700">활용 가능 자산 선택</label>
              <select 
                className="w-full border border-slate-200 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.asset_type} onChange={(e) => setFormData({...formData, asset_type: e.target.value})}
              >
                <option value="카드매출 (월 5천 이상)">월 카드매출 5,000만 이상</option>
                <option value="임차보증금 유동화">병원 임차보증금 활용</option>
                <option value="의료기기 (신규/중고)">보유 또는 신규 의료기기</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-slate-700">희망 자금 규모</label>
              <select 
                className="w-full border border-slate-200 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={formData.funds} onChange={(e) => setFormData({...formData, funds: e.target.value})}
              >
                <option value="5천만원 이하">5,000만 원 이하</option>
                <option value="1억원 내외">1억 원 내외</option>
                <option value="2억원~3억원">2억 원 ~ 3억 원</option>
                <option value="3억원 이상 대규모">3억 원 이상 대규모 자금</option>
              </select>
            </div>

            <div className="space-y-2 pt-2 text-xs text-slate-600 border-t border-slate-100">
              <label className="flex items-center gap-2.5 cursor-pointer p-1 rounded hover:bg-slate-50 transition-colors">
                <input type="checkbox" required className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                <span className="select-none"><span className="text-red-500 font-bold">[필수]</span> 개인정보 수집 및 이용 동의</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer p-1 rounded hover:bg-slate-50 transition-colors">
                <input type="checkbox" required className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
                <span className="select-none"><span className="text-red-500 font-bold">[필수]</span> 현재 금융기관 연체 및 세금 체납 사실이 전혀 없습니다.</span>
              </label>
            </div>

            <div className="pt-2">
              <button 
                type="submit" disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white font-bold p-4 rounded-xl shadow-lg hover:bg-indigo-700 active:scale-95 transition-all disabled:bg-slate-300"
              >
                {isSubmitting ? '보안 서버 시스템 전송 중...' : '실시간 한도 조회 신청하기'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 🔥 4. [신설] 원장님 다이렉트 의문 해결 Q&A 섹션 */}
      <section className="py-16 bg-white border-t border-b border-slate-100 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">가장 자주 묻는 질문</h2>
          <p className="text-center text-sm text-slate-500 mb-10">금융 솔루션 신청 전 원장님들께서 가장 우려하시는 사실을 명확히 대답해 드립니다.</p>
          
          <div className="space-y-4">
            {faqData.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 transition-all duration-300">
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-5 font-bold text-sm md:text-base flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-slate-900 break-keep"><span className="text-indigo-600 mr-2">Q.</span> {faq.q}</span>
                    <span className={`text-indigo-500 font-bold text-xl transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  
                  <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-60 border-t border-slate-150' : 'max-h-0'}`}>
                    <p className="p-5 text-sm leading-relaxed text-slate-600 bg-slate-50 break-keep">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. 푸터 섹션 */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-300 font-semibold">
            <span>상호명: 광고대행사 노네임</span>
            <span>대표자: 이정현</span>
            <span>사업자등록번호: 635-67-00527</span>
          </div>
          
          <div className="space-y-1 text-slate-500">
            <p>주소: 대구 북구 동북로291 901-a97</p>
            <p>고객상담센터: 050-6553-1135 | 이메일: leezdb88@gmail.com</p>
          </div>
          
          <hr className="border-slate-800" />
          
          <div className="text-[11px] text-slate-500 space-y-2 leading-relaxed">
            <p>
              ※ 본 사이트에서 안내하는 금융 상품 및 프로그램은 플라톤마케팅과의 독점 총판 가맹 계약 체결을 기반으로 정식 지원 및 운영됩니다. 개별 병원·약국의 신용도, 재무 안정성 및 카드매출 이력 등의 심사 결과에 따라 최종 승인 여부, 금리 및 한도 조건은 상이하거나 부결될 수 있습니다.
            </p>
            <p>
              ※ 본 사전 한도 조회 서비스는 간이 조회 방식으로 진행되어 원장님의 개인 신용등급에 어떠한 영향도 주지 않으며, 신청 및 상담 과정에서 별도의 불법 중개 수수료나 취급 수수료의 선입금을 절대 요구하지 않습니다.
            </p>
            <p className="pt-2 text-slate-600 font-medium">
              © 2026 Platon Marketing. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}