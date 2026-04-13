export const cases = [
    { id: 1, problem: "한 남자가 음식점에서 바다거북 수프를 주문해 한 입 먹고 자살했다. 왜일까?", truth: "남자는 과거 아내와 조난당해 인육을 먹고 살아남았으나, 진짜 수프 맛이 다른 것을 보고 진실을 깨달아 자살함." },
    { id: 2, problem: "사막에 한 남자가 알몸으로 죽어 있다. 손에는 부러진 성냥개비가 들려 있다. 왜일까?", truth: "열기구 무게를 줄이기 위해 옷을 다 벗었으나 부족했고, 성냥개비를 뽑아 가장 짧은 것을 뽑은 사람이 뛰어내리기로 했음. 남자가 당첨되어 뛰어내림." },
    { id: 3, problem: "밤늦게 TV를 보던 여자가 TV를 끄고 잤다. 다음날 뉴스를 보고 절망했다. 왜일까?", truth: "그녀는 등대지기였고, 그녀가 끈 것은 TV가 아니라 등대 불빛이었음. 이로 인해 대형 난파 사고가 발생함." },
    { id: 4, problem: "숲속 오두막에서 한 남자가 죽어 있다. 근처에는 53개의 자전거 부품(?)이 흩어져 있다. 왜일까?", truth: "남자는 카드 도박꾼이었고, 상대방이 소매 속에 카드 한 장(53번째 카드)을 숨긴 것을 눈치채고 싸우다 살해당한 것임." },
    { id: 5, problem: "남자가 계단을 오르다 갑자기 절망하며 주저앉았다. 왜일까?", truth: "남자는 시각장애인이었고, 정전으로 인해 층수 표시기가 꺼진 것을 느끼고 자신의 장애를 다시금 절감함." }
];

export let gameState = {
    currentCase: cases[0],
    progress: 0,
    chatHistory: []
};

export function setCurrentCase(newCase) {
    gameState.currentCase = newCase;
    gameState.progress = 0;
    gameState.chatHistory = [];
}

export function updateProgress(val) {
    gameState.progress = Math.min(val, 100);
    return gameState.progress;
}
