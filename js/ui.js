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
        this.resetChat();
    }

    initEvents() {
        this.sendBtn.onclick = () => this.handleSend();
        this.userInput.onkeypress = (e) => { if (e.key === 'Enter') this.handleSend(); };
        document.getElementById('random-case-btn').onclick = () => this.randomCase();
        document.getElementById('reveal-truth-btn').onclick = () => this.revealTruth();
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

        try {
            const systemMsg = {
                role: "system",
                content: `너는 바다거북 스프 게임 마스터야. 상황: ${gameState.currentCase.problem} / 진실: ${gameState.currentCase.truth}. 규칙: 1. 오직 '예', '아니오', '관련 없습니다' 중 하나로만 답하라. 2. 진실에 도달하면 정답임을 알리고 전체 스토리를 설명하라. 3. 한국어로만 답하라.`
            };
            const reply = await this.ai.getCompletion([systemMsg, ...gameState.chatHistory]);
            gameState.chatHistory.push({ role: "assistant", content: reply });
            this.appendMessage('ai', reply);
            if (reply.includes("정답") || reply.includes("진실")) this.updateUIProgress(100);
        } catch (err) {
            this.appendMessage('ai', "Error: " + err.message);
        } finally {
            this.setLoading(false);
        }
    }

    appendMessage(role, text) {
        const div = document.createElement('div');
        div.className = `flex gap-6 ${role === 'user' ? 'justify-end' : ''} w-full slide-up`;
        const isAI = role === 'ai';
        
        div.innerHTML = isAI ? `
            <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                <div class="w-1.5 h-1.5 bg-mystic rounded-full shadow-[0_0_10px_#EAB308]"></div>
            </div>
            <div class="space-y-2">
                <p class="text-[10px] font-black text-mystic/60 uppercase tracking-widest">Bureau Intelligence</p>
                <div class="text-zinc-300 leading-relaxed text-lg font-medium max-w-2xl whitespace-pre-wrap">${text}</div>
            </div>
        ` : `
            <div class="space-y-2 text-right">
                <p class="text-[10px] font-black text-white/20 uppercase tracking-widest">Investigator</p>
                <div class="bg-white text-black px-6 py-3 rounded-full text-base font-bold shadow-2xl inline-block">${text}</div>
            </div>
        `;
        
        this.chatBox.appendChild(div);
        this.chatBox.scrollTo({ top: this.chatBox.scrollHeight, behavior: 'smooth' });
    }

    updateUIProgress(newVal) {
        const p = updateProgress(newVal);
        this.progressBar.style.width = p + '%';
        this.progressVal.innerText = p + '%';
        if (p > 80) this.statusText.innerText = "Conclusion Reached";
        else if (p > 50) this.statusText.innerText = "Critical Clue Found";
        else if (p > 20) this.statusText.innerText = "Analyzing Evidence";
    }

    setLoading(isLoading) {
        const icon = document.getElementById('send-icon');
        const spinner = document.getElementById('typing-indicator');
        if (isLoading) {
            icon.classList.add('hidden');
            spinner.classList.remove('hidden');
            this.sendBtn.disabled = true;
        } else {
            icon.classList.remove('hidden');
            spinner.classList.add('hidden');
            this.sendBtn.disabled = false;
        }
    }

    randomCase() {
        const otherCases = cases.filter(c => c.id !== gameState.currentCase.id);
        const nextCase = otherCases[Math.floor(Math.random() * otherCases.length)];
        setCurrentCase(nextCase);

        this.problemText.style.opacity = '0';
        setTimeout(() => {
            this.caseBadge.innerText = `Archive #${String(nextCase.id).padStart(2, '0')}`;
            this.problemText.innerText = nextCase.problem;
            this.problemText.style.opacity = '1';
            this.resetChat();
        }, 400);
    }

    revealTruth() {
        this.appendMessage('ai', `[진실 확인] 사건의 전말은 이렇습니다: \n\n${gameState.currentCase.truth}`);
        this.updateUIProgress(100);
    }

    resetChat() {
        this.chatBox.innerHTML = '';
        this.updateUIProgress(0);
        this.statusText.innerText = "Initial Site Survey";
        this.appendMessage('ai', "조사를 시작합니다, 수사관님. 질문을 던져 진실을 파헤치십시오.");
    }

    showLoading(progress) {
        this.aiLoading.classList.remove('hidden');
        this.loadingStatus.innerText = `Establishing Link... ${Math.floor(progress * 100)}%`;
        if (progress >= 1) {
            setTimeout(() => {
                this.aiLoading.style.opacity = '0';
                setTimeout(() => this.aiLoading.classList.add('hidden'), 1000);
            }, 1000);
        }
    }
}
