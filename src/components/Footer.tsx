import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | 'support' | null>(null);

  return (
    <>
      <footer className="w-full bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.02)] border-t border-surface-container-high/40 py-6 mt-auto">
        <div className="w-full px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-body-sm text-body-sm text-on-surface-variant max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3">
            <span>© 2025 Dayflow Technologies. Intentionally Crafted for Deep Work.</span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setModalType('privacy')}
              className="hover:text-on-surface transition-colors cursor-pointer text-body-sm"
              type="button"
            >
              개인정보처리방침
            </button>
            <button
              onClick={() => setModalType('terms')}
              className="hover:text-on-surface transition-colors cursor-pointer text-body-sm"
              type="button"
            >
              이용약관
            </button>
            <button
              onClick={() => setModalType('support')}
              className="hover:text-on-surface transition-colors cursor-pointer text-body-sm"
              type="button"
            >
              지원 센터
            </button>
          </div>
        </div>
      </footer>

      {/* Info Modal */}
      {modalType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm"
          onClick={() => setModalType(null)}
        >
          <div
            className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-6 shadow-2xl border border-surface-container-high/50 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-title-md text-title-md text-on-surface font-bold">
                {modalType === 'privacy' && '개인정보처리방침'}
                {modalType === 'terms' && '서비스 이용약관'}
                {modalType === 'support' && '고객 지원 센터'}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="font-body-sm text-body-sm text-on-surface-variant space-y-2.5 max-h-[60vh] overflow-y-auto leading-relaxed">
              {modalType === 'privacy' && (
                <>
                  <p>Dayflow는 사용자의 프라이버시를 최우선으로 존중합니다.</p>
                  <p>모든 할 일, 일정 및 목표 데이터는 브라우저 로컬 저장소(LocalStorage)에 암호화되어 안전하게 보관되며, 외부 중앙 서버로 임의 전송되지 않습니다.</p>
                  <p>언제든지 JSON 내보내기를 통해 본인의 데이터를 백업하거나 이전할 수 있습니다.</p>
                </>
              )}
              {modalType === 'terms' && (
                <>
                  <p>Dayflow는 딥워크와 생산성 극대화를 위해 설계된 생산성 도구입니다.</p>
                  <p>사용자는 개인 일정 수립, 시간 추적 및 월간 목표 수립 목적으로 본 서비스를 자유롭게 이용할 수 있습니다.</p>
                  <p>상세 문의는 지원 센터를 통해 접수해 주시기 바랍니다.</p>
                </>
              )}
              {modalType === 'support' && (
                <>
                  <p className="font-semibold text-on-surface">도움이 필요하신가요?</p>
                  <p>자주 묻는 질문(FAQ) 및 피드백 제출:</p>
                  <div className="bg-surface-container-low p-3 rounded-xl font-label-sm text-xs space-y-1">
                    <p>• 이메일: support@dayflow.app</p>
                    <p>• 응답 시간: 영업일 기준 24시간 이내</p>
                    <p>• 버전: Dayflow Web v2.4 (Focused Precision)</p>
                  </div>
                  <p>GitHub Pages 및 오프라인 환경에서도 모든 기능이 완전하게 작동합니다.</p>
                </>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all"
                type="button"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
