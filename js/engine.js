import * as webllm from "https://esm.run/@mlc-ai/web-llm";

export class AIEngine {
    constructor() {
        this.engine = null;
        this.selectedModel = "gemma-2b-it-q4f16_1-MLC";
    }

    async init(progressCallback) {
        try {
            this.engine = await webllm.CreateWebWorkerEngine(
                new Worker(URL.createObjectURL(new Blob([`importScripts("https://esm.run/@mlc-ai/web-llm/dist/worker.js");`], { type: "text/javascript" }))),
                this.selectedModel,
                { initProgressCallback: progressCallback }
            );
            return true;
        } catch (err) {
            console.error("AI Engine Init Error:", err);
            return false;
        }
    }

    async getCompletion(messages) {
        if (!this.engine) return "AI Engine not initialized.";
        try {
            const chunks = await this.engine.chat.completions.create({
                messages: messages,
                temperature: 0.1
            });
            return chunks.choices[0].message.content;
        } catch (err) {
            console.error("Chat Completion Error:", err);
            return "Error: " + err.message;
        }
    }
}
