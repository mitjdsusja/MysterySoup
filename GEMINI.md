# Mystery Soup AI Project Development Log

AI 에이전트(Gemini)가 Mystery Soup 프로젝트의 문맥을 유지하기 위한 기록 파일입니다.

## 1. 프로젝트 개요
- **이름**: Mystery Soup AI (바다거북 스프 추리 게임)
- **컨셉**: 수사 본부의 기밀 서류함(Confidential Dossier) 테마의 로컬 AI 추리 게임.
- **기술 스택**: HTML5, Tailwind CSS, ES Modules (Vanilla JS), WebLLM.
- **수익화 계획**: Google AdMob 대형 슬롯 배치 (Header 728x90, Sidebar 300x600, Footer 728x90).

## 2. 주요 설정 및 구조
- **LLM 모델**: `gemma-2b-it-q4f16_1-MLC`
- **테마 디자인**: Noir / Dossier / Compact & Professional.
- **주요 기능**: 
    - AI 탐정 마스터와의 인터랙티브 채팅.
    - 실시간 수사 진행도 게이지.
    - **CASE CLOSED** 성공 직인 연출.
    - **AI Hint** 시스템 (광고 수익 모델 연동용).

## 3. 작업 히스토리
- **2026-04-13**:
    - **초기 기획 및 디자인**: "Confidential Dossier" 테마로 수사 분위기 극대화.
    - **UI 컴팩트 최적화**: 가독성과 전문성을 위해 모든 요소를 정교하게 스케일 다운.
    - **성공 연출 추가**: 정답 도달 시 화면에 붉은색 'CASE CLOSED' 직인이 찍히는 애니메이션 구현.
    - **힌트 시스템**: 막혔을 때 AI에게 은유적인 단서를 요청하는 'Get Hint' 기능 추가.
    - **광고 영역 규격화**: 실제 고단가 광고 사이즈(728x90, 300x600)에 맞춰 슬롯 정밀 조정.
    - **라이브러리 로컬화**: Tailwind CSS 및 WebLLM 라이브러리를 `js/lib` 폴더로 로컬화하여 보안 정책(COEP) 충돌 해결 및 안정성 확보.
    - **다운로드 진행률 표시**: AI 모델 다운로드 시 실시간으로 용량(MB/GB)과 단계를 표시하는 상세 로딩 시스템 구현.
    - **Vercel 보안 헤더 설정**: `vercel.json`에 COOP/COEP 헤더를 추가하여 배포 환경에서의 AI 작동 보장.
    - **사건 데이터 외부화**: `cases.json`을 통해 15개의 사건 데이터를 분리 및 확장.
    - GitHub 푸시 및 Vercel 자동 배포 연동 완료.

## 4. 향후 과제
- 실제 AdMob ID 발급 후 슬롯 코드 교체.
- 다국어 지원 (UI 언어 통일 및 선택 기능).
- PWA(Progressive Web App) 도입으로 모바일 캐싱 최적화.
- AI 말투(Persona) 및 추리 판단 로직 고도화.
