# 📁 폰슐랭 Skills 문서 구조

이 폴더는 폰슐랭 프로젝트의 **스킬 시스템**입니다.
클로드 코워크와 클로드 코드가 함께 참조하는 공유 지식 베이스입니다.

---

## 폴더 구조

```
skills/
├── README.md                          ← 지금 이 파일 (구조 안내)
│
├── domain-driven/                     ← DDD 기반 프로젝트 문서
│   ├── OVERVIEW.md                    ← 전체 설계도 + Context Map
│   ├── shared-kernel/                 ← 공유 타입·유틸·인프라
│   │   └── SHARED_KERNEL.md
│   └── bounded-contexts/              ← Bounded Context별 모듈
│       ├── identity/                  ← 🔐 인증
│       │   ├── specs/SPEC.md
│       │   └── logs/LOG.md
│       ├── restaurant/                ← 🏠 맛집 등록·지도
│       │   ├── specs/SPEC.md
│       │   └── logs/LOG.md
│       ├── review/                    ← ⭐ 리뷰 평점 (Core Domain)
│       │   ├── specs/SPEC.md
│       │   └── logs/LOG.md
│       ├── visualization/             ← 📊 레이더 차트
│       │   ├── specs/SPEC.md
│       │   └── logs/LOG.md
│       └── discovery/                 ← 🔍 피드·검색
│           ├── specs/SPEC.md
│           └── logs/LOG.md
│
└── notion/                            ← 노션 자동 보고 스킬
    └── SKILL.md                       ← 데일리 보고 (오전 6시 / 오후 6시)
```

---

## 스킬별 역할


| 스킬                | 경로               | 역할                                           |
| ----------------- | ---------------- | -------------------------------------------- |
| **Domain-Driven** | `domain-driven/` | DDD 기반 프로젝트 설계 문서. Bounded Context별 스펙·로그 관리 |
| **Notion 보고**     | `notion/`        | 바이브 코딩 작업 내역을 노션 DB에 자동 기록 (1일 2회)           |


---

## DDD 문서 계층


| 파일                 | 역할                               | 업데이트 시점    |
| ------------------ | -------------------------------- | ---------- |
| `OVERVIEW.md`      | 전체 설계도, Context Map, 기술 스택       | 기획 변경 시    |
| `SHARED_KERNEL.md` | 공유 타입, Supabase 클라이언트, 디자인 토큰    | 공통 모듈 변경 시 |
| `*/specs/SPEC.md`  | Context별 도메인 모델, DB 스키마, 컴포넌트 구조 | 기능 설계·변경 시 |
| `*/logs/LOG.md`    | Context별 작업 기록, 디버깅, 메모          | 작업 중 수시로   |


---

## 노션 보고 스케줄


| 시간         | 태스크 ID                 | 설명                |
| ---------- | ---------------------- | ----------------- |
| 매일 오전 6:00 | `fonsle-daily-morning` | 전일 오후~금일 오전 작업 보고 |
| 매일 오후 6:00 | `fonsle-daily-evening` | 금일 오전~오후 작업 보고    |


보고 대상 DB: [토이 프로젝트 진행 일지](https://www.notion.so/31ed57c78fa080d4a36edaf94a38bc21)