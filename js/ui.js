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
        this.problemTextMobile = document.getElementById('problem-text-mobile');
        this.caseBadge = document.getElementById('case-id-badge');
        this.caseBadgeMobile = document.getElementById('case-id-badge-mobile');
        this.progressBar = document.getElementById('progress-bar');
        this.progressBarMobile = document.getElementById('progress-bar-mobile');
        this.progressVal = document.getElementById('progress-val');
        this.progressValMobile = document.getElementById('progress-val-mobile');
        
        this.aiLoading = document.getElementById('ai-loading');
        this.loadingStatus = document.getElementById('loading-status');
        this.successStamp = document.getElementById('success-stamp');

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
        const hintBtn = document.getElementById('get-hint-btn');

        if (randomBtn) randomBtn.onclick = () => this.randomCase();
        if (revealBtn) revealBtn.onclick = () => this.revealTruth();
        if (hintBtn) hintBtn.onclick = () => this.getHint();
    }

    async handleSend() {
        const val = this.userInput.value.trim();
        if (!val) return;

        this.appendMessage('user', val);
        this.userInput.value = '';
        
        if (!this.ai.engine) {
            this.appendMessage('ai', "AI 시스템이 조서를 해독 중입니다. 잠시만 대기하십시오.");
            return;
        }

        this.setLoading(true);
        gameState.chatHistory.push({ role: "user", content: val });
        this.updateUIProgress(gameState.progress + 5);

        try {
            const systemMsg = {
                role: "system",
                content: `너는 바다거북 스프 게임 마스터야. 상황: ${gameState.currentCase.problem} / 진실: ${gameState.currentCase.truth}. 규칙: 1. 오직 '예', '아니오', '관련 없습니다' 중 하나로만 답하라. 2. 핵심 진실에 도달하면 '정답입니다!'라고 외치고 전체 스토리를 설명하라. 3. 한국어로만 답하라. 차갑고 기계적인 말투를 유지하라.`
            };
            const reply = await this.ai.getCompletion([systemMsg, ...gameState.chatHistory]);
            gameState.chatHistory.push({ role: "assistant", content: reply });
            this.appendMessage('ai', reply);
            
            if (reply.includes("정답") || reply.includes("진실")) {
                this.triggerSuccess();
            }
        } catch (err) {
            this.appendMessage('ai', "Neural linkage error: " + err.message);
        } finally {
            this.setLoading(false);
        }
    }

    async getHint() {
        if (!this.ai.engine) return;
        this.setLoading(true);
        const hintPrompt = [
            { role: "system", content: `너는 조력자다. 상황: ${gameState.currentCase.problem} / 진실: ${gameState.currentCase.truth}. 정답을 알려주지 말고, 수사관이 다음 질문을 던질 수 있도록 아주 미세하고 은유적인 힌트를 한 문장으로 줘.` },
            ...gameState.chatHistory
        ];
        const hint = await this.ai.getCompletion(hintPrompt);
        this.appendMessage('ai', "[HINT RECEIVED] " + hint);
        this.setLoading(false);
    }

    triggerSuccess() {
        this.updateUIProgress(100);
        if (this.successStamp) {
            this.successStamp.classList.add('stamp-animate');
            setTimeout(() => {
                this.successStamp.classList.remove('stamp-animate');
            }, 4000);
        }
    }

    appendMessage(role, text) {
        if (!this.chatBox) return;
        const div = document.createElement('div');
        div.className = `flex gap-6 ${role === 'user' ? 'justify-end' : 'justify-start'} w-full fade-in`;
        const isAI = role === 'ai';
        
        div.innerHTML = isAI ? `
            <div class="w-10 h-10 rounded-sm bg-blood/10 border border-blood/20 flex items-center justify-center flex-shrink-0 shadow-inner">
                <div class="w-1.5 h-1.5 bg-blood animate-pulse shadow-[0_0_10px_#880808]"></div>
            </div>
            <div class="space-y-2">
                <p class="font-mystery text-[8px] text-mystic/40 uppercase tracking-widest leading-none">Bureau Agent</p>
                <div class="text-zinc-300 leading-relaxed text-base font-medium max-w-2xl whitespace-pre-wrap font-serif italic">${text}</div>
            </div>
        ` : `
            <div class="space-y-2 text-right">
                <p class="font-mystery text-[8px] text-zinc-600 uppercase tracking-widest leading-none">Field Investigator</p>
                <div class="bg-zinc-100 text-black px-5 py-2.5 rounded-sm text-base font-bold shadow-2xl inline-block border-b-2 border-zinc-400">${text}</div>
            </div>
        `;
        
        this.chatBox.appendChild(div);
        this.chatBox.scrollTo({ top: this.chatBox.scrollHeight, behavior: 'smooth' });
    }

    updateUIProgress(newVal) {
        const p = updateProgress(newVal);
        if (this.progressBar) this.progressBar.style.width = p + '%';
        if (this.progressBarMobile) this.progressBarMobile.style.width = p + '%';
        if (this.progressVal) this.progressVal.innerText = p + '%';
        if (this.progressValMobile) this.progressValMobile.innerText = p + '%';
        if (this.statusText) {
            if (p >= 100) this.statusText.innerText = "CASE ARCHIVED";
            else if (p > 70) this.statusText.innerText = "BREAKTHROUGH CONFIRMED";
            else if (p > 30) this.statusText.innerText = "CORRELATING DATA";
            else this.statusText.innerText = "INTERROGATION PHASE";
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
        const updateElements = () => {
            const idStr = `#${String(gameState.currentCase.id).padStart(2, "0")}`;
            if (this.caseBadge) this.caseBadge.innerText = idStr;
            if (this.caseBadgeMobile) this.caseBadgeMobile.innerText = idStr;

            if (this.problemText) this.problemText.innerText = gameState.currentCase.problem;
            if (this.problemTextMobile) this.problemTextMobile.innerText = gameState.currentCase.problem;

            if (this.problemText) this.problemText.style.opacity = "1";
            this.resetChat();
        };

        if (this.problemText) {
            this.problemText.style.opacity = "0";
            setTimeout(updateElements, 400);
        } else {
            updateElements();
        }
    }

    revealTruth() {
        this.appendMessage('ai', `[ADMIN OVERRIDE] 사건 파일 해독 완료: \n\n${gameState.currentCase.truth}`);
        this.triggerSuccess();
    }

    resetChat() {
        if (this.chatBox) this.chatBox.innerHTML = '';
        this.updateUIProgress(0);
        if (this.statusText) this.statusText.innerText = "AWAITING INTERROGATION...";
        this.appendMessage('ai', "조서를 시작합니다. 현장의 증거들을 바탕으로 질문을 던지십시오.");
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
