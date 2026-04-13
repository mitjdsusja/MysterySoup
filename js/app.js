import { AIEngine } from './engine.js';
import { UIController } from './ui.js';

const ai = new AIEngine();
const ui = new UIController(ai);

// Initialize AI in the background
// We don't wait for DOMContentLoaded here if the script is type="module" at the end of body,
// but it's safer to have it.
window.addEventListener('load', () => {
    ai.init((report) => {
        ui.showLoading(report.progress);
    });
});

// Global exports for inline HTML onclick handlers
window.randomCase = () => ui.randomCase();
window.revealTruth = () => ui.revealTruth();
