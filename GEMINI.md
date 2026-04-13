# Mystery Soup AI Project Development Log

AI 에이전트(Gemini)가 Mystery Soup 프로젝트의 문맥을 유지하기 위한 기록 파일입니다.

## 1. 프로젝트 개요
- **이름**: Mystery Soup AI (바다거북 스프 추리 게임)
- **컨셉**: 수사 본부의 기밀 서류함(Confidential Dossier) 테마의 로컬 AI 추리 게임.
- **기술 스택**: HTML5, Tailwind CSS, ES Modules (Vanilla JS), WebLLM.
- **수익화 계획**: Google AdMob 대형 슬롯 배치 (Header 970x90, Sidebar 300x600, Footer 728x90).

## 2. 주요 설정 및 구조
- **LLM 모델**: `gemma-2b-it-q4f16_1-MLC`
- **테마 디자인**: Noir / Dossier / Paper Texture / Blood Red & Mystic Gold.
- **모듈 구조**: `js/data.js`, `js/engine.js`, `js/ui.js`, `js/app.js`.

## 3. 작업 히스토리
- **2026-04-13**:
    - **디자인 대개편**: "Confidential Dossier" 테마 적용. 마닐라 폴더 질감의 사이드바, 기밀 직인(Stamp) 효과, 시네마틱 타이포그래피 구현.
    - **버그 수정**: 첫 페이지 로드 시 사건 문제(Problem)가 나타나지 않던 초기화 로직 수정.
    - **수익화 최적화**: AdMob 광고 영역을 대폭 확장 (상단 970x90, 사이드바 300x600 고정 영역 확보).
    - **안정화**: `coi-serviceworker`를 통한 Vercel 배포 환경과 로컬 환경의 UI/AI 호환성 완벽 확보.
    - GitHub 푸시 및 Vercel 자동 배포 연동 완료.

## 4. 향후 과제
- 실제 AdMob ID 발급 후 슬롯 코드 교체.
- 추리 성공 시 'CASE CLOSED' 직인 애니메이션 추가.
- 더 많은 고난도 미스터리 사건 추가 및 카테고리화.
