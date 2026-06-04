import React, { useState, useEffect } from 'react';

export default function LandingPage() {
  // 폼 간소화: 이탈률을 최소화하기 위해 필수 정보 3개만 수집
  const [formData, setFormData] = useState({
    hospital_name: '',
    manager_name: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Q&A 아코디언 상태 관리
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

    // 🔒 외부 추적이 원천 차단된 실서버 내부 보안 릴레이 API 호출
    const GAS_WEB_APP_URL = "/api/submit";

    // 구글 시트 및 디스코드 봇 규격 유지를 위한 데이터 매립
    const payload = {
      ...formData,
      asset_type: '상담 시 확인',
      funds: '상담 시 확인'
    };

    try {
      const response = await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const resData = await response.json();
      
      if (resData.result === 'success') {
        // 2. 광고 매체사 전환(Lead) 스크립트 발사
        if (window.gtag) window.gtag('event', 'generate_lead', { currency: 'KRW', value: 0 });
        if (window.fbq) window.fbq('track', 'Lead');
        if (window.dv) window.dv('track', 'CompleteRegistration');

        alert('자금 조달 방안 사전 진단 신청이 정상 접수되었습니다. 전담 매니저가 신속하게 연락드리겠습니다.');
        setFormData({ hospital_name: '', manager_name: '', phone: '' });
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

  const faqData = [
    {
      q: "단순 사전 진단만으로도 신용도에 변동이 생기나요?",
      a: "아니요, 전혀 변동이 없습니다. 본 서비스는 정식 가이드라인을 준수하는 안심 사전 심사 방식을 채택하여 공식 금융권 조회 이력이 남지 않으므로 원장님의 신용도나 기존 대출 평가에 어떠한 영향도 주지 않습니다."
    },
    {
      q: "기존 가계 대출이나 닥터론 부채 비율(DSR)이 높은데도 진행이 가능한가요?",
      a: "네, 가능성이 높습니다. 일반 신용 대출 방식과 달리, 의료 장비 리스 및 맞춤형 유동화 구조를 복합 설계하기 때문에 기존 DSR 부채 한도 압박에서 비교적 자유롭게 자금을 유연하게 배정할 수 있습니다."
    },
    {
      q: "종합소득세 손비처리와 매입세액공제 혜택은 어떤 원리인가요?",
      a: "도입 자금 구조에 맞춰 정식 세금계산서가 발행되므로 종합소득세 신고 시 전액 합법적인 필요경비 처리가 인정되어 원장님의 고소득 최고 세율 구간을 완화할 수 있습니다. 부가세 환급 관련 세무 가이드 역시 전담 프로세스로 함께 지원됩니다."
    },
    {
      q: "상담 및 구조 분석 과정에서 금융 중개 수수료를 지불해야 하나요?",
      a: "아니요, 절대 요구하지 않습니다. 저희 메디컬 파이낸셜 프로그램은 정식 금융사 및 여신전문금융기관과의 포괄 업무 협약을 기반으로 가동되므로, 원장님께 별도의 수수료나 선입금을 요구하는 행위는 일절 없으며 이는 법적으로도 엄격히 금지되어 있습니다."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      
      {/* GNB (헤더 상단 바) */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 px-4 py-3.5 md:px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-lg tracking-tight text-slate-900">메디플라톤</span>
            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded">금융사업부</span>
          </div>
          <a href="#diagnostic-form" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors">
            자금 조달 방안 무상 진단
          </a>
        </div>
      </header>

      {/* 1. 히어로 섹션 + 상단 고전환 폼 배치 */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-12 px-4 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.06),transparent_50%)]" />
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* 가치 제안 섹션 (좌측 7칸) */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <span className="inline-block bg-indigo-600/20 text-indigo-400 text-[11px] font-bold tracking-wider px-2.5 py-1 rounded mb-4">
              ✓ 현재 병·의원 전용 금융 프로그램 사전 한도 조회 진행 중
            </span>
            
            <h1 className="text-2xl md:text-5xl font-black tracking-tight mb-4 md:mb-6 leading-tight text-white break-keep">
              개원 · 장비도입 · 확장자금<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
                현재 상황에서 가능한 조달 방안을
              </span> 확인해보세요
            </h1>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5 mb-6 md:mb-0 inline-block text-left w-full max-w-xl">
              <div className="space-y-2 text-xs md:text-sm text-slate-300 font-medium">
                <p className="flex items-center gap-2"><span className="text-indigo-400 font-bold">✓</span> 면허 보유 의료인 대상 전용 맞춤 프로그램</p>
                <p className="flex items-center gap-2"><span className="text-indigo-400 font-bold">✓</span> 신용도 하락 우려 없는 안심 사전 구조 조회</p>
                <p className="flex items-center gap-2"><span className="text-indigo-400 font-bold">✓</span> 의료 장비 · 인테리어 · 운전자금 포괄 매칭</p>
              </div>
            </div>
          </div>

          {/* 첫 화면 우측 고전환 입력 폼 */}
          <div id="diagnostic-form" className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="bg-white text-slate-900 rounded-3xl p-5 md:p-8 shadow-2xl border border-slate-100">
              <div className="text-center mb-4">
                <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">의료인 전용 자금 조달 진단</h2>
                <p className="text-slate-500 text-[11px] mt-0.5">병원 상황에 맞는 최적의 포트폴리오 사전 검토 리포트를 발송해 드립니다.</p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">병·의원명 / 진료과목</label>
                  <input type="text" required value={formData.hospital_name} onChange={(e) => setFormData({...formData, hospital_name: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-indigo-500 text-sm font-medium" placeholder="예: OO의원 (피부과)" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">원장님 성함</label>
                  <input type="text" required value={formData.manager_name} onChange={(e) => setFormData({...formData, manager_name: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-indigo-500 text-sm font-medium" placeholder="원장님 성함 입력" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">연락처</label>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-indigo-500 text-sm font-medium" placeholder="010-XXXX-XXXX" />
                </div>

                <div className="space-y-1.5 pt-1 text-xs text-slate-600 border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" required className="h-3.5 w-3.5 accent-indigo-600 cursor-pointer rounded" />
                    <span className="select-none text-[11px] text-slate-500"><span className="text-red-500 font-bold">[필수]</span> 개인정보 수집 및 이용 동의</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" required className="h-3.5 w-3.5 accent-indigo-600 cursor-pointer rounded" />
                    <span className="select-none text-[11px] text-slate-500"><span className="text-red-500 font-bold">[필수]</span> 금융기관 연체 및 세금 체납 사실이 없습니다.</span>
                  </label>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 text-white font-black py-4 rounded-xl shadow-lg shadow-indigo-600/10 transition-transform active:scale-[0.98] text-sm tracking-wide">
                  {isSubmitting ? '보안 서버 시스템 분석 중...' : '병원 상황에 맞는 자금 조달 방안 알아보기'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* 2. 🔄 수정 완료: 실적 지표 섹션 (불확실한 약속 문구 삭제 및 완벽한 수치 시각화 통일) */}
      <section className="py-10 bg-white border-b border-slate-100 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
          <div className="p-2 border-r border-slate-100 last:border-none">
            <p className="text-2xl md:text-3xl font-black text-indigo-600">1,700건+</p>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">누적 상담 검토</p>
          </div>
          <div className="p-2 md:border-r border-slate-100 last:border-none">
            <p className="text-2xl md:text-3xl font-black text-indigo-600">전담 담당자</p>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">1:1 상담</p>
          </div>
          <div className="p-2 border-r border-slate-100 last:border-none">
            <p className="text-2xl md:text-3xl font-black text-indigo-600">무료</p>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">사전 검토</p>
          </div>
          <div className="p-2 last:border-none">
            <p className="text-2xl md:text-3xl font-black text-indigo-600">병원별</p>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">맞춤 안내</p>
          </div>
        </div>
      </section>

      {/* 3. 거울 효과 섹션 (이런 병원에서 문의하고 있습니다) */}
      <section className="py-14 bg-slate-100/60 px-4 border-b border-slate-200/40">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-center font-bold text-slate-500 text-xs md:text-sm tracking-wider uppercase mb-6">
            📍 현재 대구·경북 지역 다양한 진료과에서 문의를 통해 최적화 방안을 검토 중입니다
          </h3>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
              <p className="text-base font-bold text-slate-900">🏥 피부과</p>
              <p className="text-slate-500 text-xs mt-1">신규 개원 준비 자금 조달</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
              <p className="text-base font-bold text-slate-900">🩺 정형외과</p>
              <p className="text-slate-500 text-xs mt-1">고가 첨단 MRI 장비 추가 도입</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
              <p className="text-base font-bold text-slate-900">🦷 치과</p>
              <p className="text-slate-500 text-xs mt-1">네트워크 확장 및 대규모 이전</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
              <p className="text-base font-bold text-slate-900">🩺 내과</p>
              <p className="text-slate-500 text-xs mt-1">인테리어 리모델링 및 운전자금</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 브랜드 에셋 비주얼 배너 */}
      <section className="py-16 px-4 max-w-4xl mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">원장님을 위한 1:1 포트폴리오 케어</h2>
        <p className="text-slate-500 text-xs md:text-sm mb-8">안전한 리스크 방어망 구축과 합법적인 소득세 절세 프로세스 수립</p>
        <div className="flex justify-center">
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-md bg-slate-200 aspect-[4/3]">
            <img 
              src="/images/hero-doctor.jpg" 
              alt="메디컬 금융 전문가 리포트 가이드" 
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => { 
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80'; 
              }}
            />
          </div>
        </div>
      </section>

      {/* 5. 원장님 다이렉트 의문 해결 Q&A 아코디언 섹션 */}
      <section className="py-16 bg-white border-t border-b border-slate-100 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-center text-slate-900 mb-2">가장 자주 묻는 질문</h2>
          <p className="text-center text-xs text-slate-500 mb-8">금융 구조 분석 신청 전 원장님들께서 가장 우려하시는 핵심 사항을 사실 그대로 안내합니다.</p>
          
          <div className="space-y-3.5">
            {faqData.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 transition-all duration-300">
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-4 md:p-5 font-bold text-sm flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-slate-900 break-keep"><span className="text-indigo-600 mr-1">Q.</span> {faq.q}</span>
                    <span className={`text-indigo-500 font-bold text-base transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  
                  <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-60 border-t border-slate-150' : 'max-h-0'}`}>
                    <p className="p-4 md:p-5 text-xs md:text-sm leading-relaxed text-slate-600 bg-slate-50 break-keep">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. 푸터 영역 */}
      <footer className="bg-slate-900 text-slate-400 text-[11px] py-10 px-4 border-t border-slate-800">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-slate-300 font-semibold text-xs justify-center md:justify-start">
            <span>상호명: 노네임</span>
            <span>대표자: 이정현</span>
            <span>사업자등록번호: 635-67-00527</span>
          </div>
          
          <div className="space-y-1 text-slate-500 text-center md:text-left">
            <p>주소: 대구 북구 동북로291 901-a97</p>
            <p>고객상담센터: 050-6553-1135 | 이메일: leezdb88@gmail.com</p>
          </div>
          
          <hr className="border-slate-800" />
          
          <div className="text-[10px] text-slate-500 space-y-2 leading-relaxed text-justify md:text-left">
            <p>
              ※ 본 사이체서 안내하는 금융 상품 및 프로그램은 플라톤마케팅과의 가맹 계약 체결을 기반으로 정식 지원 및 운영됩니다. 개별 병원·약국의 신용도, 재무 안정성 및 카드매출 이력 등의 심사 결과에 따라 최종 승인 여부, 금리 및 한도 조건은 상이하거나 부결될 수 있습니다.
            </p>
            <p>
              ※ 본 사전 한도 조회 서비스는 간이 조회 방식으로 진행되어 원장님의 개인 신용등급에 어떠한 영향도 주지 않으며, 신청 및 상담 과정에서 별도의 불법 중개 수수료나 취급 수수료의 선입금을 절대 요구하지 않습니다.
            </p>
            <p className="pt-2 text-slate-600 font-medium text-center md:text-left">
              © 2026 Platon Marketing. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}