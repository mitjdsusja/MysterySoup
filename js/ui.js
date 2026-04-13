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
        this.syncStateToUI();
    }

    initEvents() {
        if (this.sendBtn) this.sendBtn.onclick = () => this.handleSend();
        if (this.userInput) {
            this.userInput.onkeypress = (e) => { if (e.key === 'Enter') this.handleSend(); };
        }
        const randomBtn = document.getElementById('random-case-btn');
        const revealBtn = document.getElementById('reveal-truth-btn');
        if (randomBtn) randomBtn.onclick = () => this.randomCase();
        if (revealBtn) revealBtn.onclick = () => this.revealTruth();
    }

    async handleSend() {
        const val = this.userInput.value.trim();
        if (!val) return;

        this.appendMessage('user', val);
        this.userInput.value = '';
        
        if (!this.ai.engine) {
            this.appendMessage('ai', "AI 시스템 초기화 중... 잠시만 기다려 주십시오.");
            return;
        }

        this.setLoading(true);
        gameState.chatHistory.push({ role: "user", content: val });
        this.updateUIProgress(gameState.progress + 7);

        try {
            const systemMsg = {
                role: "system",
                content: `너는 바다거북 스프 게임 마스터야. 상황: ${gameState.currentCase.problem} / 진실: ${gameState.currentCase.truth}. 규칙: 1. 오직 '예', '아니오', '관련 없습니다' 중 하나로만 답하라. 2. 핵심 진실에 도달하면 정답임을 알리고 전체 스토리를 설명하라. 3. 한국어로만 답하라. 말투는 짧고 명료하게 하라.`
            };
            const reply = await this.ai.getCompletion([systemMsg, ...gameState.chatHistory]);
            gameState.chatHistory.push({ role: "assistant", content: reply });
            this.appendMessage('ai', reply);
            if (reply.includes("정답") || reply.includes("진실")) this.updateUIProgress(100);
        } catch (err) {
            this.appendMessage('ai', "데이터 오류: " + err.message);
        } finally {
            this.setLoading(false);
        }
    }

    appendMessage(role, text) {
        if (!this.chatBox) return;
        const div = document.createElement('div');
        div.className = `flex gap-6 ${role === 'user' ? 'justify-end' : 'justify-start'} w-full fade-in`;
        const isAI = role === 'ai';
        
        div.innerHTML = isAI ? `
            <div class="w-10 h-10 rounded-sm bg-blood/10 border border-blood/20 flex items-center justify-center flex-shrink-0">
                <div class="w-1.5 h-1.5 bg-blood animate-pulse"></div>
            </div>
            <div class="space-y-2">
                <p class="font-mystery text-[8px] text-mystic/40 uppercase tracking-widest">Intelligence Agent</p>
                <div class="text-zinc-300 leading-relaxed text-base font-medium max-w-2xl whitespace-pre-wrap font-serif italic">${text}</div>
            </div>
        ` : `
            <div class="space-y-2 text-right">
                <p class="font-mystery text-[8px] text-zinc-600 uppercase tracking-widest">Investigator</p>
                <div class="bg-zinc-100 text-black px-5 py-2 rounded-sm text-base font-bold shadow-xl inline-block border-b-2 border-zinc-400">${text}</div>
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
            if (p >= 100) this.statusText.innerText = "CONCLUSION REACHED";
            else if (p > 60) this.statusText.innerText = "BREAKTHROUGH FOUND";
            else this.statusText.innerText = "PROCESSING CLUES";
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
        this.syncStateToUI();
    }

    syncStateToUI() {
        if (this.problemText) {
            this.problemText.style.opacity = '0';
            setTimeout(() => {
                this.caseBadge.innerText = `#${String(gameState.currentCase.id).padStart(2, '0')}`;
                this.problemText.innerText = gameState.currentCase.problem;
                this.problemText.style.opacity = '1';
                this.resetChat();
            }, 400);
        }
    }

    revealTruth() {
        this.appendMessage('ai', `[CLASSIFIED] 사건의 진실: \n\n${gameState.currentCase.truth}`);
        this.updateUIProgress(100);
    }

    resetChat() {
        if (this.chatBox) this.chatBox.innerHTML = '';
        this.updateUIProgress(0);
        if (this.statusText) this.statusText.innerText = "AWAITING INTERROGATION...";
        this.appendMessage('ai', "조서를 시작합니다. 사건 현장의 단서들을 조합하여 진실을 파헤치십시오.");
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
