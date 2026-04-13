// [핵심] 외부 CDN 대신 로컬 라이브러리 사용
import * as webllm from "./lib/webllm.js";

export class AIEngine {
    constructor() {
        this.engine = null;
        this.selectedModel = "gemma-2b-it-q4f16_1-MLC";
    }

    async init(progressCallback) {
        console.log("AI 엔진 초기화 시도 중...");
        
        if (!navigator.gpu) {
            console.error("WebGPU 미지원 브라우저");
            return false;
        }

        try {
            // 워커 스크립트 소스 (보안 컨텍스트를 위해 절대 경로 수준으로 구성)
            const workerScript = `importScripts("${window.location.origin}/js/lib/webllm.js");`;
            const blob = new Blob([workerScript], { type: "text/javascript" });
            const workerUrl = URL.createObjectURL(blob);
            
            this.engine = await webllm.CreateWebWorkerEngine(
                new Worker(workerUrl),
                this.selectedModel,
                { initProgressCallback: progressCallback }
            );
            
            console.log("AI 엔진 초기화 성공!");
            return true;
        } catch (err) {
            console.error("AI 초기화 상세 에러:", err);
            return false;
        }
    }

    async getCompletion(messages) {
        if (!this.engine) return "AI Engine not ready.";
        try {
            const chunks = await this.engine.chat.completions.create({
                messages: messages,
                temperature: 0.1
            });
            return chunks.choices[0].message.content;
        } catch (err) {
            console.error("메시지 생성 에러:", err);
            return "Interrogation failed: " + err.message;
        }
    }
}
