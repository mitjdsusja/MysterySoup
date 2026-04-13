export let cases = [];

export let gameState = {
    currentCase: null,
    progress: 0,
    chatHistory: []
};

export async function loadCases() {
    try {
        const response = await fetch('./cases.json');
        cases = await response.json();
        // 초기 케이스 설정
        if (cases.length > 0) {
            gameState.currentCase = cases[0];
        }
        return cases;
    } catch (err) {
        console.error("Failed to load cases:", err);
        return [];
    }
}

export function setCurrentCase(newCase) {
    gameState.currentCase = newCase;
    gameState.progress = 0;
    gameState.chatHistory = [];
}

export function updateProgress(val) {
    gameState.progress = Math.min(val, 100);
    return gameState.progress;
}
