import { AIEngine } from './engine.js';
import { UIController } from './ui.js';

const ai = new AIEngine();
const ui = new UIController(ai);

window.addEventListener('load', () => {
    ai.init((report) => {
        ui.showLoading(report.progress);
    });
});
