-- ============================================
-- 폰슐랭 초기 DB 마이그레이션
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- ─────────────────────────────────────────────
-- 1. users 테이블 (Identity Context)
-- ─────────────────────────────────────────────
CREATE TABLE users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname      TEXT NOT NULL,
  profile_image TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "프로필 조회는 모두 가능"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "프로필 수정은 본인만"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "회원가입 시 본인 프로필 생성"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ─────────────────────────────────────────────
-- 2. restaurants 테이블 (Restaurant Context)
-- ─────────────────────────────────────────────
CREATE TABLE restaurants (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  naver_place_id  TEXT UNIQUE,
  name            TEXT NOT NULL,
  address         TEXT,
  category        TEXT,
  lat             FLOAT,
  lng             FLOAT,
  phone           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "맛집 조회 전체 허용"
  ON restaurants FOR SELECT
  USING (true);

CREATE POLICY "인증 사용자만 맛집 등록"
  ON restaurants FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ─────────────────────────────────────────────
-- 3. reviews 테이블 (Review Context — Core)
-- ─────────────────────────────────────────────
CREATE TABLE reviews (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES users(id) ON DELETE CASCADE,
  restaurant_id       UUID REFERENCES restaurants(id) ON DELETE CASCADE,

  -- 6가지 항목 점수 (1.0 ~ 5.0, 0.5 단위)
  score_taste         NUMERIC(2,1) CHECK (score_taste BETWEEN 1.0 AND 5.0),
  score_value         NUMERIC(2,1) CHECK (score_value BETWEEN 1.0 AND 5.0),
  score_atmosphere    NUMERIC(2,1) CHECK (score_atmosphere BETWEEN 1.0 AND 5.0),
  score_service       NUMERIC(2,1) CHECK (score_service BETWEEN 1.0 AND 5.0),
  score_visual    NUMERIC(2,1) CHECK (score_visual BETWEEN 1.0 AND 5.0),
  score_access        NUMERIC(2,1) CHECK (score_access BETWEEN 1.0 AND 5.0),

  -- 총점 자동 계산 (DB가 보장)
  score_total         NUMERIC(3,2) GENERATED ALWAYS AS (
                        (score_taste + score_value + score_atmosphere +
                         score_service + score_visual + score_access) / 6.0
                      ) STORED,

  content             TEXT,
  visited_at          DATE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "리뷰 조회 전체 허용"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "본인만 리뷰 작성"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "본인만 리뷰 수정"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "본인만 리뷰 삭제"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 4. review_images 테이블
-- ─────────────────────────────────────────────
CREATE TABLE review_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id   UUID REFERENCES reviews(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  sort_order  INT DEFAULT 0
);

ALTER TABLE review_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "이미지 조회 전체 허용"
  ON review_images FOR SELECT
  USING (true);

CREATE POLICY "본인 리뷰의 이미지만 추가"
  ON review_images FOR INSERT
  WITH CHECK (
    auth.uid() = (SELECT user_id FROM reviews WHERE id = review_id)
  );

CREATE POLICY "본인 리뷰의 이미지만 삭제"
  ON review_images FOR DELETE
  USING (
    auth.uid() = (SELECT user_id FROM reviews WHERE id = review_id)
  );

-- ─────────────────────────────────────────────
-- 5. 인덱스 (성능 최적화)
-- ─────────────────────────────────────────────
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_restaurant_id ON reviews(restaurant_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_review_images_review_id ON review_images(review_id);
CREATE INDEX idx_restaurants_name ON restaurants(name);

-- ─────────────────────────────────────────────
-- 6. 회원가입 시 users 테이블 자동 생성 트리거
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, nickname)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nickname', '폰슐랭러')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
