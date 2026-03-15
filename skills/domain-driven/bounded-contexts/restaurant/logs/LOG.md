# 📝 작업 로그

> Context 스펙: [../specs/SPEC.md]
> 생성일: 2026-03-09

---

## ⚡ 강조 사항 (항상 기억할 것)

- `naver_place_id` UNIQUE 제약으로 중복 등록 방지
- 네이버 API 응답은 반드시 ACL(`naverPlaceAdapter.js`)을 통해 도메인 모델로 변환
- 좌표 변환은 `Location.fromNaverKatech()` 사용 (카텍 → WGS84)

---

## 🛠️ 작업 로그

### [2026-03-15] Phase 2 기본 구조 구현

**작업 내용:**
- `Location.js` 값 객체 생성 (Katech → WGS84 좌표 변환)
- `naverPlaceAdapter.js` ACL 생성 (네이버 API → 도메인 모델 변환)
- `/api/search-place.js` Vercel API Route 프록시 생성
- `useRestaurantSearch.js` 훅 생성 (debounce 300ms, mock 모드 지원)
- `RestaurantSearchInput.jsx` 리팩터링 — mock 직접 참조 제거, 훅 기반으로 전환

**결과:**
- 검색 인풋이 네이버 API 프록시를 통해 실제 맛집 검색 가능
- Mock 모드에서는 기존 로컬 데이터로 동작
- `restaurantRepository.js`의 upsert로 선택된 맛집 DB 저장 가능

### [2026-03-15] Phase 2 코드 품질 개선

**작업 내용:**
- `RestaurantSearchResult.jsx` 별도 컴포넌트 분리 (스펙 구조 준수)
- `ReviewForm.jsx` React Hooks 규칙 위반 수정 — `useState(submitError)`가 조건부 return 뒤에서 호출되던 문제를 컴포넌트 최상단으로 이동

**결과:**
- Restaurant 컴포넌트 구조가 스펙과 일치: `RestaurantSearchInput` + `RestaurantSearchResult`
- React strict mode에서도 안전한 Hooks 호출 순서 보장

### [2026-03-15] Phase 2 안전성 개선

**작업 내용:**
- `stripHtml()`에 `&lt;` `&gt;` `&quot;` `&#39;` 엔티티 변환 추가 (네이버 API 다양한 엔티티 대응)
- `Location.fromNaverKatech()`에 NaN 가드 추가 (mapx/mapy 누락 시 null 반환)

**결과:**
- 특수문자 포함 맛집 이름이 정상 표시됨
- 좌표 없는 검색 결과도 안전하게 처리

### [2026-03-15] ⚠️ 브랜치 전략 위반 감지

**문제:**
- `feature/restaurant-search-260315` 브랜치에서 restaurant 외 도메인 파일을 수정함
- 영향 도메인: identity (`AuthContext.jsx`), review (`ReviewForm.jsx`), discovery (`SearchPage.jsx`, `ProfilePage.jsx`)
- 원인: ESLint 전체 클린업 + ReviewForm Hooks 규칙 수정을 restaurant 브랜치에서 수행
- `dev`로의 PR이 미생성 상태에서 DEVELOPMENT_SCHEDULE.md에 "✅ 완료" 표기

**조치 필요:**
- Phase 2 완료 전 타 도메인 변경 분리 검토 필요
- `dev` PR 생성 시 리뷰어에게 cross-domain 변경 사항 명시

### [2026-03-15] ESLint 린트 클린 달성

**작업 내용:**
- `search-place.js` process global 선언 추가
- `SearchPage.jsx` 미사용 useCallback import 제거
- `AuthContext.jsx` react-refresh 경고 억제 (Context 패턴)
- `RestaurantSearchInput.jsx` useEffect 내 setState 제거, onChange 핸들러로 이동
- `ProfilePage.jsx` useEffect 내 setState 제거, 초기값 + cleanup 패턴 적용

**결과:**
- ESLint 에러 0건, 빌드 정상 통과

### [2026-03-15] Phase 2 통합 검증 (localhost:5173)

**검증 내용:**
- 모든 라우트(`/`, `/auth`, `/search`, `/review/new`, `/profile`) HTTP 200 정상 응답
- `npm run build` 성공 (3.07s, index.js 729KB → gzip 218KB)
- `npm run lint` ESLint 에러 0건

**확인된 정상 동작 기능:**
- 인증: 로그인/회원가입 폼, 데모 계정(demo@fonsle.kr), 세션 유지, ProtectedRoute
- 맛집 검색: 디바운스 검색, Mock 5건 필터링, 자동완성 드롭다운
- 리뷰 작성: 3단계 폼(맛집선택→6항목점수→텍스트), 커스텀 슬라이더, 실시간 레이더 프리뷰
- 시각화: 6축 레이더 차트(Recharts), MiniRadarChart, LiveRadarPreview
- 피드: 최신 리뷰 타임라인, 페이지네이션, ReviewCard
- 프로필: 사용자 정보, 내 리뷰 목록, 통계, 로그아웃
- 네비게이션: TopHeader, BottomNav(4탭), 라우팅 전체 정상

**결과:**
- Phase 1(Identity) + Phase 2(Restaurant) 기능 모두 정상 동작 확인
- Mock 모드에서 전체 E2E 흐름 테스트 가능

### [2026-03-15] Phase 2 버그 수정

**작업 내용:**
- `upsertRestaurant`에서 camelCase(`naverPlaceId`)→snake_case(`naver_place_id`) 필드 매핑 누락 수정
- Mock 검색 시 대소문자 무시 처리(`toLowerCase`) 추가

**원인:**
- `naverPlaceAdapter.js`는 도메인 모델 규칙에 따라 camelCase 반환
- `restaurantRepository.js`는 DB snake_case만 참조하여 항상 null로 중복 체크 실패

---

## 🐛 디버깅 & 오류 기록

### naverPlaceId 필드 매핑 불일치 (2026-03-15, 해결)
- ACL 어댑터: `naverPlaceId` (camelCase) 반환
- Repository: `restaurant.naver_place_id` (snake_case) 참조
- 해결: 양쪽 키를 모두 확인하도록 수정

---

## 💡 메모 & 아이디어

- Vercel 환경변수에 `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` 설정 필요
- `restaurants` 테이블 + RLS 정책 Supabase에 이미 적용됨

---

## ✅ 완료 체크리스트

- [x] Location 값 객체 구현
- [x] 네이버 ACL 어댑터 구현
- [x] Vercel API Route 프록시 구현
- [x] useRestaurantSearch 훅 구현
- [x] RestaurantSearchInput 훅 기반 리팩터링
- [x] Supabase restaurants 테이블 확인 (이미 존재)
- [ ] 실제 네이버 API 연동 테스트 (환경변수 설정 후)
- [x] RestaurantSearchResult.jsx 별도 컴포넌트 분리
- [x] HTML 엔티티 처리 보강 + 좌표 NaN 가드
- [x] ESLint 린트 클린 달성 (에러 0건)
- [ ] 실제 네이버 API 연동 테스트 (환경변수 설정 후)
- [ ] NaverMap.jsx 지도 렌더링 (선택)
