import * as webllm from "https://esm.run/@mlc-ai/web-llm";

export class AIEngine {
    constructor() {
        this.engine = null;
        this.selectedModel = "gemma-2b-it-q4f16_1-MLC";
    }

    async init(progressCallback) {
        if (!navigator.gpu) {
            console.error("WebGPU not supported.");
            return false;
        }
        try {
            this.engine = await webllm.CreateWebWorkerEngine(
                new Worker(URL.createObjectURL(new Blob([`importScripts("https://esm.run/@mlc-ai/web-llm/dist/worker.js");`], { type: "text/javascript" }))),
                this.selectedModel,
                { initProgressCallback: progressCallback }
            );
            return true;
        } catch (err) {
            console.error("AI Init Error:", err);
            return false;
        }
    }

    async getCompletion(messages) {
        if (!this.engine) return "AI Engine not ready.";
        const chunks = await this.engine.chat.completions.create({
            messages: messages,
            temperature: 0.1
        });
        return chunks.choices[0].message.content;
    }
}
