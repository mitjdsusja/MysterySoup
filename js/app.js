import { AIEngine } from './engine.js';
import { UIController } from './ui.js';

const ai = new AIEngine();
const ui = new UIController(ai);

// Initialize AI in the background
document.addEventListener('DOMContentLoaded', () => {
    ai.init((report) => {
        ui.showLoading(report.progress);
    });
});

// Global exports for inline HTML onclick handlers
window.randomCase = () => ui.randomCase();
window.revealTruth = () => ui.revealTruth();
