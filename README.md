# UI/UX Assignment README

이 프로젝트는 바탕화면 형태의 웹 앱 안에서 다음 두 가지 UI 예시를 비교하기 위한 과제 결과물입니다.

- 나쁜 UI 예시: `HTS Mock`
- 좋은 UI 예시: `To Do`

프로젝트는 React + CSS로 직접 구성되었고, OS/윈도우 모방용 외부 UI 라이브러리는 사용하지 않았습니다.

## 앱 구성

- `HTS Mock`
  - 고의적으로 불편한 금융 HTS 스타일 화면
  - 복잡한 정보 밀도, 반복 팝업, 광고 팝업, 방해 동작으로 나쁜 UX를 보여줌
- `To Do`
  - 일정/작업 관리 중심의 좋은 UI 예시
  - 명확한 구조, 즉시 수정 가능한 패널, 필터, 달력 보기, 테마 전환, 코치마크 제공

## 좋은 UI 예시: `To Do` 요소 매핑

아래 항목들은 현재 좋은 UI 예시인 `To Do` 안에 다음 위치로 들어가 있습니다.

### 1. 제목줄

- 위치: 창 맨 위 공통 윈도우 헤더
- 구현 파일:
  - [src/components/AppWindow.jsx](/home/praisy/uiux-assignment/my-uiux-desktop/src/components/AppWindow.jsx)
  - [src/components/TitleBar.jsx](/home/praisy/uiux-assignment/my-uiux-desktop/src/components/TitleBar.jsx)
- 설명:
  - `To Do` 창 이름
  - 닫기 버튼
  - 최대화/복원 버튼

### 2. 텍스트 입력 상자

- 위치: `To Do` 중앙 상단의 `작업 추가` 영역
- 구현 파일:
  - [src/components/ModernTodoWindow.jsx](/home/praisy/uiux-assignment/my-uiux-desktop/src/components/ModernTodoWindow.jsx)
- 설명:
  - 새 할 일 제목을 입력
  - placeholder는 `작업 추가`

### 3. 체크박스

- 위치:
  - 중앙 작업 목록 각 항목 왼쪽
  - 오른쪽 상세 패널 상단 선택된 작업 제목 왼쪽
- 구현 파일:
  - [src/components/ModernTodoWindow.jsx](/home/praisy/uiux-assignment/my-uiux-desktop/src/components/ModernTodoWindow.jsx)
- 설명:
  - 완료/미완료 토글

### 4. 라디오 버튼 그룹

- 위치: `작업 추가` 카드 내부 `우선순위`
- 구현 파일:
  - [src/components/ModernTodoWindow.jsx](/home/praisy/uiux-assignment/my-uiux-desktop/src/components/ModernTodoWindow.jsx)
- 설명:
  - `높음 / 보통 / 낮음` 선택

### 5. 프로그레스 바

- 위치: 왼쪽 사이드바 하단 `진행률`
- 구현 파일:
  - [src/components/ModernTodoWindow.jsx](/home/praisy/uiux-assignment/my-uiux-desktop/src/components/ModernTodoWindow.jsx)
  - [src/App.css](/home/praisy/uiux-assignment/my-uiux-desktop/src/App.css)
- 설명:
  - 완료된 작업 비율을 실시간으로 반영

### 6. 버튼

- 위치:
  - `추가`
  - `목록`, `캘린더`, `공유`
  - 왼쪽 스마트 리스트 필터 버튼
  - 오른쪽 상세 패널의 `+` 수정 버튼
  - 날짜/시간/반복 팝업 안의 `저장`, `취소`
- 구현 파일:
  - [src/components/ModernTodoWindow.jsx](/home/praisy/uiux-assignment/my-uiux-desktop/src/components/ModernTodoWindow.jsx)

### 7. 다이얼로그 윈도우

- 위치: 작업 삭제 시 중앙 모달 다이얼로그
- 구현 파일:
  - [src/components/Dialog.jsx](/home/praisy/uiux-assignment/my-uiux-desktop/src/components/Dialog.jsx)
  - [src/components/Desktop.jsx](/home/praisy/uiux-assignment/my-uiux-desktop/src/components/Desktop.jsx)
- 설명:
  - 삭제 전 사용자 확인을 받음

### 8. `확인/취소`

- 구현 상태:
  - 공통 다이얼로그 컴포넌트에 버튼 타입으로 구현되어 있음
- 구현 파일:
  - [src/components/Dialog.jsx](/home/praisy/uiux-assignment/my-uiux-desktop/src/components/Dialog.jsx)
- 현재 연결 상태:
  - 현재 최종 화면의 `To Do` 흐름에는 직접 연결되어 있지 않음

### 9. `예/아니요`

- 구현 상태:
  - 실제 사용 중
- 위치:
  - `To Do` 작업 삭제 확인 다이얼로그
- 구현 파일:
  - [src/components/Desktop.jsx](/home/praisy/uiux-assignment/my-uiux-desktop/src/components/Desktop.jsx)
  - [src/components/Dialog.jsx](/home/praisy/uiux-assignment/my-uiux-desktop/src/components/Dialog.jsx)

### 10. `예/아니오/중지`

- 구현 상태:
  - 공통 다이얼로그 컴포넌트에 버튼 타입으로 구현되어 있음
- 구현 파일:
  - [src/components/Dialog.jsx](/home/praisy/uiux-assignment/my-uiux-desktop/src/components/Dialog.jsx)
- 현재 연결 상태:
  - 현재 최종 화면의 `To Do` 흐름에는 직접 연결되어 있지 않음

## 좋은 UI를 구현하려고 넣은 기능

`To Do`는 아래 방향으로 좋은 UI/UX를 구현하려고 설계했습니다.

- 명확한 정보 구조
  - 좌측: 목록/필터
  - 중앙: 작업 리스트 또는 월간 캘린더
  - 우측: 선택된 작업의 상세 정보
- 즉시 이해 가능한 흐름
  - 작업 추가 -> 우선순위 선택 -> 완료 체크 -> 진행률 반영
- 온보딩 가이드 제공
  - 코치마크(Coach Marks)로 왼쪽 탐색, 작업 추가, 상세 패널, 캘린더 보기를 단계별 설명
- 바로 수정 가능한 상세 패널
  - `알림`, `기한`, `반복`, `카테고리`, `메모`를 각각 독립적으로 수정
- 문맥 맞는 입력 방식
  - 기한: 바로 아래에 뜨는 날짜 선택 팝업
  - 알림: 바로 아래에 뜨는 날짜 + 시간 선택 팝업
  - 반복: 바로 아래에 뜨는 요일 선택 팝업
  - 메모: 다중 행 입력
- 실시간 피드백
  - 작업 완료 시 진행률 즉시 변경
  - 좌측 필터 수량 즉시 반영
- 여러 표현 방식 지원
  - 목록 보기
  - 월간 캘린더 보기
- 테마 전환
  - `Dark / Light` 버튼으로 모드 변경
  - 팝업 톤도 모드에 맞게 반전
  - 라이트 모드에서는 팝업을 블랙 계열로, 다크 모드에서는 낮은 톤의 흰색 계열로 전환
- 큰 클릭 영역과 정렬된 레이아웃
  - 버튼, 날짜 셀, 시간 슬롯 모두 비교적 큰 클릭 영역 유지

## 나쁜 UI 예시: `HTS Mock`에서 나쁜 UI를 위해 추가한 것

`HTS Mock`는 일부러 아래 요소들을 넣어 나쁜 UI를 만들었습니다.

- 과도한 정보 밀도
  - 차트, 호가, 주문, 로그를 한 화면에 빽빽하게 배치
- 반복적으로 다시 뜨는 팝업
  - 메뉴 클릭, 버튼 클릭, 툴바 클릭 시 공지가 다시 등장
- 숨길 수 없는 팝업
  - 일부 팝업은 `이번 세션만 숨기기`가 없음
- 큰 팝업으로 핵심 콘텐츠 가리기
  - 차트와 작업 영역을 직접 덮도록 설계
- 드래그해야 겨우 닫을 수 있는 구조
  - 팝업 위치와 레이어를 불편하게 배치
- 광고 팝업 강제 노출
  - 마지막 페이지까지 넘겨야 닫기 버튼이 나타남
- 전체 화면형 금융 화면 톤
  - 처음 보는 사용자에게 위압적인 색상과 복잡도
- 학습용 데모 문구와 실제 HTS 같은 공지 톤
  - “실제 금융 서비스처럼 보여도 불편함을 드러내는” 과제 목적에 맞춤

관련 구현 파일:

- [src/components/Desktop.jsx](/home/praisy/uiux-assignment/my-uiux-desktop/src/components/Desktop.jsx)
- [src/components/TopMenuBar.jsx](/home/praisy/uiux-assignment/my-uiux-desktop/src/components/TopMenuBar.jsx)
- [src/components/Toolbar.jsx](/home/praisy/uiux-assignment/my-uiux-desktop/src/components/Toolbar.jsx)
- [src/components/Workspace.jsx](/home/praisy/uiux-assignment/my-uiux-desktop/src/components/Workspace.jsx)
- [src/components/PopupWindow.jsx](/home/praisy/uiux-assignment/my-uiux-desktop/src/components/PopupWindow.jsx)
- [src/components/AnnoyingPopupManager.jsx](/home/praisy/uiux-assignment/my-uiux-desktop/src/components/AnnoyingPopupManager.jsx)

## 현재 최종 상태 요약

- 남아 있는 주요 앱
  - `HTS Mock`
  - `To Do`
  - `Notes`
  - `Trash`
- 제거된 앱
  - `Todo Manager (Bad UI)`

## 실행

```bash
npm install
npm run dev
```

## 검증

최근 기준 확인한 명령:

```bash
npm run build
npm run lint
```
