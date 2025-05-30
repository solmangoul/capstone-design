
-- 기존 테이블 제거
DROP TABLE IF EXISTS kakao_places;
DROP TABLE IF EXISTS users;

-- ✅ users 테이블
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ✅ 카카오 장소 데이터 저장용 테이블 (user_id 추가)
CREATE TABLE kakao_places (
  place_id VARCHAR(20) NOT NULL PRIMARY KEY,
  place_name VARCHAR(200) NOT NULL,
  category_name VARCHAR(200),
  category_group_code VARCHAR(10),
  category_group_name VARCHAR(50),
  phone VARCHAR(20),
  address_name VARCHAR(255),
  road_address_name VARCHAR(255),
  lat DECIMAL(9,6) NOT NULL,
  lng DECIMAL(9,6) NOT NULL,
  place_url VARCHAR(255),
  user_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

