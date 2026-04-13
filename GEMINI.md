# Mystery Soup AI Project Development Log

AI 에이전트(Gemini)가 Mystery Soup 프로젝트의 문맥을 유지하기 위한 기록 파일입니다.

## 1. 프로젝트 개요
- **이름**: Mystery Soup AI (바다거북 스프 추리 게임)
- **컨셉**: 로컬 브라우저 기반 LLM(WebLLM)을 활용한 인터랙티브 추리 게임.
- **기술 스택**: HTML5, Tailwind CSS, ES Modules (Vanilla JS), WebLLM (@mlc-ai/web-llm).
- **수익화 계획**: Google AdMob 슬롯 배치 완료 (Header, Sidebar, Footer).

## 2. 주요 설정 및 구조
- **LLM 모델**: `gemma-2b-it-q4f16_1-MLC`
- **프로젝트 구조**:
    - `js/data.js`: 사건 라이브러리 및 게임 상태 관리.
    - `js/engine.js`: WebLLM 초기화 및 답변 생성 엔진.
    - `js/ui.js`: 채팅 렌더링, 진행도 업데이트 등 UI 컨트롤러.
    - `js/app.js`: 애플리케이션 초기화 및 전역 함수 노출.

## 3. 작업 히스토리
- **2026-04-13**:
    - **초기 기획**: WebLLM 기반 바다거북 스프 게임 설계.
    - **UI/UX 진화**: 타자기 스타일 -> 글래스모피즘 -> 하이엔드 시네마틱(Linear 스타일)으로 지속적 업그레이드.
    - **디자인 복구 및 강화**: 모듈화 과정에서 누락된 보더 빔(Border Beam), 은은한 조명(Ambient Glow), 노이즈 질감 등을 복구하여 감도(Aesthetics) 극대화.
    - **코드 고도화**: ES Modules 기반으로 엔진, UI, 데이터를 분리하여 유지보수성 확보.
    - **수익화 준비**: 상단, 사이드바, 하단 전용 AdMob 슬롯 배치 완료.
    - GitHub 푸시 및 Vercel 자동 배포 연동.

## 4. 향후 과제
- 실제 AdMob ID 발급 후 슬롯 코드 교체.
- 정답 맞춤 시 화려한 폭죽 애니메이션 추가.
- 더 많은 고난도 사건 데이터 추가.
