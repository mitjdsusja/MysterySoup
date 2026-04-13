import { AIEngine } from './engine.js';
import { UIController } from './ui.js';
import { loadCases } from './data.js';

const ai = new AIEngine();
const ui = new UIController(ai);

window.addEventListener('load', async () => {
    // 1. 사건 데이터 먼저 로드
    await loadCases();
    // 2. UI 초기 상태 반영
    ui.syncStateToUI();

    // 3. 접속 승인 버튼 이벤트 리스너
    const startBtn = document.getElementById('start-connection-btn');
    const overlay = document.getElementById('connection-overlay');

    if (startBtn) {
        startBtn.onclick = async () => {
            console.log("Establish Link 버튼 클릭됨");
            
            // WebGPU 지원 확인
            if (!navigator.gpu) {
                alert("본 브라우저는 WebGPU를 지원하지 않습니다. 최신 Chrome이나 Safari로 접속해 주세요.");
                return;
            }

            if (overlay) overlay.classList.add('hidden');
            
            // 로딩 화면 즉시 표시
            ui.showLoading({ progress: 0, text: "Initializing Bureau AI Core..." });
            
            console.log("AI 초기화 시작...");
            // 4. AI 엔진 초기화 (사용자 클릭 후 시작)
            const success = await ai.init((report) => {
                console.log("로딩 상태 업데이트:", report.text);
                ui.showLoading(report);
            });

            if (!success) {
                console.error("AI 초기화 최종 실패");
                alert("AI 엔진 초기화에 실패했습니다. 메모리 부족이거나 브라우저 설정 문제일 수 있습니다.");
                if (overlay) overlay.classList.remove('hidden');
            }
        };
    }
});
