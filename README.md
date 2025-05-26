# 🚆 코레일 좌석 정보 유저스크립트

코레일 홈페이지에서 열차 검색 시 **입석**, **자유석**, **열차 타입(A/B-Type)**, **시설 정보**를 한눈에 볼 수 있게 해주는 유저스크립트입니다.

## ✨ 주요 기능

- 🎫 **입석 상태 표시**: 입석 판매 여부, 매진 상태 확인
- 🆓 **자유석 정보**: 자유석 운행 칸수와 매진 상태 표시
- 🚄 **열차 타입**: KTX-산천 A-Type, B-Type 구분 표시
- 🎯 **열차 시설**: 전동휠체어석, 비즈니스석 등 시설 정보 표시
- 📱 **반응형 디자인**: 모바일에서도 깔끔하게 표시

## 📋 사전 준비

### 1단계: 브라우저 확인
이 스크립트는 다음 브라우저에서 사용할 수 있습니다:
- ✅ **Chrome** (권장)
- ✅ **Firefox**
- ✅ **Edge**
- ✅ **Safari**
- ✅ **Opera**

### 2단계: 유저스크립트 매니저 설치

유저스크립트를 실행하려면 브라우저 확장 프로그램이 필요합니다.

#### Chrome/Edge 사용자 (데스크톱)
1. **Tampermonkey** 설치 (권장)
   - [Chrome 웹 스토어](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)에서 설치
   - 또는 **Violentmonkey** [설치 링크](https://chrome.google.com/webstore/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag)

#### Firefox 사용자 (데스크톱)
1. **Tampermonkey** 설치 (권장)
   - [Firefox Add-ons](https://addons.mozilla.org/ko/firefox/addon/tampermonkey/)에서 설치
   - 또는 **Greasemonkey** [설치 링크](https://addons.mozilla.org/ko/firefox/addon/greasemonkey/)

#### Safari 사용자 (데스크톱)
1. **Tampermonkey** 설치
   - [App Store](https://apps.apple.com/app/tampermonkey/id1482490089)에서 설치

#### 📱 Android 모바일 사용자
1. **Firefox 브라우저 설치** (권장)
   - [Play 스토어](https://play.google.com/store/apps/details?id=org.mozilla.firefox)에서 Firefox 설치
   - Firefox에서 [Tampermonkey 애드온](https://addons.mozilla.org/ko/firefox/addon/tampermonkey/) 설치

2. **Kiwi Browser 사용** (대안)
   - [Play 스토어](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser)에서 Kiwi Browser 설치
   - Chrome 확장 프로그램 지원으로 Tampermonkey 설치 가능

#### 📱 iOS 모바일 사용자
1. **Safari 사용** (iOS 15+)
   - [App Store](https://apps.apple.com/app/tampermonkey/id1482490089)에서 Tampermonkey 설치
   - 설정 → Safari → 확장 프로그램에서 Tampermonkey 활성화

2. **주의사항**
   - iOS는 브라우저 제한이 많아 일부 기능이 제한될 수 있습니다
   - 가능하면 데스크톱 사용을 권장합니다

## 🔧 스크립트 설치 방법

### 방법 1: 직접 복사 설치 (추천)

#### 📱 모바일에서 설치하기

**Android (Firefox/Kiwi Browser)**
1. **Tampermonkey 대시보드 열기**
   - 브라우저 메뉴 → 애드온/확장프로그램 → Tampermonkey 선택
   - 또는 주소창에 `moz-extension://[ID]/options.html` 입력

2. **새 스크립트 생성**
   - 화면 하단의 "+" 버튼 터치
   - 또는 "Create a new script" 선택

3. **스크립트 코드 붙여넣기**
   - 기본 템플릿을 모두 삭제
   - GitHub에서 `index.js` 코드 전체 복사 후 붙여넣기
   - **팁**: 긴 텍스트 선택 시 확대/축소 제스처 활용

4. **저장하기**
   - 상단의 💾 저장 아이콘 터치

**iOS (Safari)**
1. **Safari에서 GitHub 접속**
   - 이 저장소의 `index.js` 파일 열기
   - "Raw" 버튼 터치하여 코드만 표시

2. **코드 전체 복사**
   - 화면을 길게 눌러 전체 선택
   - 복사 실행

3. **Tampermonkey 앱 열기**
   - Tampermonkey 앱 실행
   - "+" 버튼으로 새 스크립트 생성
   - 복사한 코드 붙여넣기 후 저장

#### 🖥️ 데스크톱에서 설치하기

1. **Tampermonkey 대시보드 열기**
   - 브라우저 우상단의 Tampermonkey 아이콘 클릭
   - "대시보드" 또는 "Dashboard" 선택

2. **새 스크립트 생성**
   - 왼쪽 메뉴에서 "+" 버튼 클릭
   - 또는 상단의 "새 스크립트 추가" 클릭

3. **스크립트 코드 붙여넣기**
   - 기본 템플릿 코드를 모두 삭제
   - `index.js` 파일의 전체 코드를 복사해서 붙여넣기

4. **저장하기**
   - `Ctrl + S` (Windows/Linux) 또는 `Cmd + S` (Mac)
   - 또는 상단의 "저장" 버튼 클릭

### 방법 2: 파일로 설치 (데스크톱 전용)

1. **스크립트 파일 다운로드**
   - `index.js` 파일을 다운로드

2. **Tampermonkey에서 파일 가져오기**
   - Tampermonkey 대시보드 → "유틸리티" 탭
   - "파일에서 가져오기" 선택
   - 다운로드한 `index.js` 파일 선택

## 🚀 사용 방법

### 🖥️ 데스크톱에서 사용하기

1. **코레일 홈페이지 접속**
   - [코레일 홈페이지](https://www.korail.com) 방문

2. **열차 검색**
   - 출발지, 도착지, 날짜를 입력하고 검색

3. **정보 확인**
   - 각 열차 아래에 추가된 정보 뱃지들 확인:
     - 🔴 **A-Type** / 🟣 **B-Type**: KTX-산천 열차 타입
     - 🟠 **입석 매진** / 🟢 **입석 역 판매 중**: 입석 상태
     - 🔵 **자유석 3량** / 🔴 **자유석 매진**: 자유석 정보
     - 🟢 **전동휠체어석**, **비즈니스석** 등: 시설 정보

### 📱 모바일에서 사용하기

1. **브라우저 앱 실행**
   - Android: Firefox 또는 Kiwi Browser
   - iOS: Safari 브라우저

2. **코레일 모바일 사이트 접속**
   - 주소창에 `korail.com` 입력
   - 또는 [코레일 모바일](https://m.korail.com) 직접 접속

3. **Tampermonkey 활성화 확인**
   - 브라우저 메뉴에서 Tampermonkey 상태 확인
   - 스크립트가 활성화되어 있는지 확인

4. **열차 검색 및 정보 확인**
   - 출발지, 도착지, 날짜 입력 후 검색
   - 각 열차 정보 아래 추가된 뱃지들 확인
   - **참고**: 모바일에서는 뱃지들이 세로로 배치될 수 있습니다

### ⚠️ 모바일 사용 시 주의사항

- **Android**: Firefox나 Kiwi Browser에서만 정상 작동
- **iOS**: Safari에서만 사용 가능하며, 일부 기능 제한 가능
- **Chrome 모바일**: 유저스크립트 지원 안함 (데스크톱 버전과 다름)
- **성능**: 모바일에서는 로딩이 다소 느릴 수 있음

## 🎨 스크린샷

```
서울→부산(06:03 ~ 08:48) 소요시간: 2시간 45분
🔴 A-Type  🟠 입석 매진  🔵 자유석 3량  🟢 전동휠체어석  🟢 비즈니스석
```

## ⚠️ 문제 해결

### 스크립트가 작동하지 않을 때

1. **스크립트 활성화 확인**
   - Tampermonkey 아이콘 클릭 → 스크립트 이름 옆에 녹색 점 확인
   - 비활성화되어 있다면 클릭해서 활성화

2. **브라우저 새로고침**
   - `F5` 또는 `Ctrl + F5`로 페이지 새로고침

3. **브라우저 캐시 삭제**
   - `Ctrl + Shift + Delete`로 브라우저 데이터 삭제

4. **콘솔 오류 확인**
   - `F12` → Console 탭에서 오류 메시지 확인

### 스크립트 업데이트

1. **자동 업데이트 설정**
   - Tampermonkey 대시보드 → 설정 → "자동으로 업데이트 확인" 체크

2. **수동 업데이트**
   - 새로운 `index.js` 코드를 복사해서 기존 스크립트에 덮어쓰기

## 🔒 개인정보 보호

- 이 스크립트는 **개인정보를 수집하지 않습니다**
- 코레일 웹사이트에서 이미 공개된 정보만 재가공하여 표시
- 모든 데이터는 브라우저 내에서만 처리됩니다

## 📝 라이선스

이 프로젝트는 개인적/비상업적 용도로 자유롭게 사용할 수 있습니다.

## 🙋‍♂️ 문의/버그 리포트

문제가 있거나 개선 사항이 있다면 GitHub Issues를 통해 제보해주세요.

---

**⚡ 빠른 시작**: Tampermonkey 설치 → 코드 복사 → 코레일 사이트에서 열차 검색! 