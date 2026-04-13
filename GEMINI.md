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
    - **UI 모바일 최적화**: 모바일 환경에서도 사건 정보를 한눈에 볼 수 있도록 상단 요약 헤더 및 반응형 레이아웃 구현.
    - **UI 동기화 로직 보강**: 데스크톱과 모바일 UI 간의 실시간 진척도 및 사건 정보 동기화 완료.
    - **GitHub 푸시 및 Vercel 배포**: 최신 변경 사항 반영 및 자동 배포 확인.
    - GitHub 푸시 및 Vercel 자동 배포 연동 완료.

## 4. 향후 과제
- 실제 AdMob ID 발급 후 슬롯 코드 교체.
- 다국어 지원 (현재 한국어/영어 혼용 상태를 정리 필요).
- 사건 라이브러리의 무한 확장 (JSON DB 연동 검토).
