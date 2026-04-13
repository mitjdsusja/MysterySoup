import { gameState, cases, setCurrentCase, updateProgress } from './data.js';

export class UIController {
    constructor(aiEngine) {
        this.ai = aiEngine;
        this.chatBox = document.getElementById('chat-box');
        this.userInput = document.getElementById('user-input');
        this.sendBtn = document.getElementById('send-btn');
        this.progressBar = document.getElementById('progress-bar');
        this.progressVal = document.getElementById('progress-val');
        this.statusText = document.getElementById('investigation-status');
        this.problemText = document.getElementById('problem-text');
        this.caseBadge = document.getElementById('case-id-badge');
        this.aiLoading = document.getElementById('ai-loading');
        this.loadingStatus = document.getElementById('loading-status');

        this.initEvents();
        // Initialize the first view
        this.resetChat();
    }

    initEvents() {
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.handleSend());
        }
        if (this.userInput) {
            this.userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSend();
            });
        }
    }

    async handleSend() {
        const val = this.userInput.value.trim();
        if (!val) return;

        this.appendMessage('user', val);
        this.userInput.value = '';
        
        if (!this.ai.engine) {
            this.appendMessage('ai', "AI 엔진이 준비 중입니다. 잠시만 기다려 주세요.");
            return;
        }

        this.setLoading(true);
        
        gameState.chatHistory.push({ role: "user", content: val });
        this.updateUIProgress(gameState.progress + 7);

        const reply = await this.ai.getCompletion(this.getFormattedMessages());
        gameState.chatHistory.push({ role: "assistant", content: reply });
        this.appendMessage('ai', reply);

        if (reply.includes("정답") || reply.includes("진실")) {
            this.updateUIProgress(100);
        }

        this.setLoading(false);
    }

    getFormattedMessages() {
        const systemMsg = {
            role: "system",
            content: `너는 바다거북 스프 게임 마스터야. 상황: ${gameState.currentCase.problem} / 진실: ${gameState.currentCase.truth}. 규칙: 1. 질문에 오직 '예', '아니오', '관련 없습니다' 중 하나로만 답하라. 2. 핵심 진실에 도달하면 정답임을 알리고 전체 스토리를 설명하라. 3. 한국어로만 답하라.`
        };
        return [systemMsg, ...gameState.chatHistory];
    }

    appendMessage(role, text) {
        if (!this.chatBox) return;
        const div = document.createElement('div');
        div.className = `flex gap-6 ${role === 'user' ? 'justify-end' : ''} w-full slide-up`;
        const isAI = role === 'ai';
        
        div.innerHTML = isAI ? `
            <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-inner">
                <div class="w-1.5 h-1.5 bg-mystic rounded-full shadow-[0_0_10px_#EAB308]"></div>
            </div>
            <div class="space-y-2">
                <p class="text-[9px] font-black text-mystic uppercase tracking-widest">Bureau Intelligence</p>
                <div class="bubble-ai p-6 rounded-[2rem] rounded-tl-none text-zinc-300 leading-relaxed text-base font-medium shadow-2xl max-w-2xl whitespace-pre-wrap">
                    ${text}
                </div>
            </div>
        ` : `
            <div class="space-y-2 text-right">
                <p class="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Investigator</p>
                <div class="bubble-user p-5 rounded-[1.8rem] rounded-tr-none text-black leading-relaxed text-base shadow-xl max-w-md">
                    ${text}
                </div>
            </div>
        `;
        
        this.chatBox.appendChild(div);
        this.chatBox.scrollTo({ top: this.chatBox.scrollHeight, behavior: 'smooth' });
    }

    updateUIProgress(newVal) {
        const p = updateProgress(newVal);
        if (this.progressBar) this.progressBar.style.width = p + '%';
        if (this.progressVal) this.progressVal.innerText = p + '%';
        
        if (this.statusText) {
            if (p > 80) this.statusText.innerText = "Conclusion Reached";
            else if (p > 50) this.statusText.innerText = "Critical Clue Found";
            else if (p > 20) this.statusText.innerText = "Analyzing Testimonies";
        }
    }

    setLoading(isLoading) {
        const icon = document.getElementById('send-icon');
        const spinner = document.getElementById('typing-indicator');
        if (isLoading) {
            if (icon) icon.classList.add('hidden');
            if (spinner) spinner.classList.remove('hidden');
            this.sendBtn.disabled = true;
        } else {
            if (icon) icon.classList.remove('hidden');
            if (spinner) spinner.classList.add('hidden');
            this.sendBtn.disabled = false;
        }
    }

    randomCase() {
        const otherCases = cases.filter(c => c.id !== gameState.currentCase.id);
        const nextCase = otherCases[Math.floor(Math.random() * otherCases.length)];
        setCurrentCase(nextCase);

        if (this.problemText) {
            this.problemText.style.opacity = '0';
            setTimeout(() => {
                if (this.caseBadge) this.caseBadge.innerText = `Case #${String(nextCase.id).padStart(2, '0')}`;
                this.problemText.innerText = nextCase.problem;
                this.problemText.style.opacity = '1';
                this.resetChat();
            }, 400);
        }
    }

    revealTruth() {
        this.appendMessage('ai', `[수사 종료] 사건의 진실은 다음과 같습니다: \n\n${gameState.currentCase.truth}`);
        this.updateUIProgress(100);
    }

    resetChat() {
        if (this.chatBox) this.chatBox.innerHTML = '';
        this.updateUIProgress(0);
        if (this.statusText) this.statusText.innerText = "Initial Site Survey";
        this.appendMessage('ai', "조사를 시작합니다, 수사관님. 당신의 통찰력으로 진실을 파헤치십시오.");
    }

    showLoading(progress) {
        if (!this.aiLoading) return;
        this.aiLoading.classList.remove('hidden');
        if (this.loadingStatus) {
            this.loadingStatus.innerText = `Establishing Link... ${Math.floor(progress * 100)}%`;
        }
        if (progress >= 1) {
            setTimeout(() => {
                this.aiLoading.style.opacity = '0';
                setTimeout(() => this.aiLoading.classList.add('hidden'), 1000);
            }, 1000);
        }
    }
}
