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

### [2026-03-15] ESLint 린트 클린 달성

**작업 내용:**
- `search-place.js` process global 선언 추가
- `SearchPage.jsx` 미사용 useCallback import 제거
- `AuthContext.jsx` react-refresh 경고 억제 (Context 패턴)
- `RestaurantSearchInput.jsx` useEffect 내 setState 제거, onChange 핸들러로 이동
- `ProfilePage.jsx` useEffect 내 setState 제거, 초기값 + cleanup 패턴 적용

**결과:**
- ESLint 에러 0건, 빌드 정상 통과

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
