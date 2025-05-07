-- 👇 기존 테이블 제거
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS spaces;
DROP TABLE IF EXISTS users;

-- ✅ users 테이블 (AUTO_INCREMENT)
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ✅ spaces 테이블 (AUTO_INCREMENT)
CREATE TABLE spaces (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  capacity INT,
  price INT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ✅ reservations 테이블 (user_id, space_id 모두 INT 외래키)
CREATE TABLE reservations (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  space_id INT NOT NULL,
  reservation_date DATETIME NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  people INT,
  status VARCHAR(20) DEFAULT 'confirmed',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
