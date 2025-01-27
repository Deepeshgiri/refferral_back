-- Create Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) ,
  phone VARCHAR(15) NOT NULL UNIQUE,
  referral_code VARCHAR(10) UNIQUE,
  referred_by VARCHAR(10),
  stage INT DEFAULT 1,
  points INT DEFAULT 0,
  image VARCHAR(255), -- Stores image URL or file path
  active_status BOOLEAN DEFAULT TRUE, -- TRUE for active, FALSE for inactive
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Dummy Data into Users Table
INSERT INTO users (first_name, last_name, phone, referral_code, referred_by, stage, points, image, active_status) VALUES
('John', 'Doe', '1234567890', 'ABC123', NULL, 1, 0, 'https://example.com/images/john.jpg', TRUE),
('Jane', 'Smith', '9876543210', 'XYZ456', 'ABC123', 2, 10, 'https://example.com/images/jane.jpg', TRUE),
('Alice', 'Johnson', '5555555555', 'DEF789', 'XYZ456', 1, 0, 'https://example.com/images/alice.jpg', FALSE),
('Bob', 'Brown', '1111111111', 'GHI012', 'ABC123', 3, 20, 'https://example.com/images/bob.jpg', TRUE),
('Charlie', 'Davis', '9999999999', 'JKL345', 'DEF789', 2, 10, 'https://example.com/images/charlie.jpg', TRUE);

-- Create Referrals Table
CREATE TABLE referrals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  referrer_id INT NOT NULL,
  referred_id INT NOT NULL,
  level INT NOT NULL,
  FOREIGN KEY (referrer_id) REFERENCES users(id),
  FOREIGN KEY (referred_id) REFERENCES users(id)
);

-- Insert Dummy Data into Referrals Table
INSERT INTO referrals (referrer_id, referred_id, level) VALUES
(1, 2, 1), -- John referred Jane
(2, 3, 1), -- Jane referred Alice
(1, 4, 1), -- John referred Bob
(3, 5, 1); -- Alice referred Charlie

-- Create Commissions Table
CREATE TABLE commissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  level INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert Dummy Data into Commissions Table
INSERT INTO commissions (user_id, amount, level) VALUES
(1, 10.00, 1), -- John earned $10 from level 1
(1, 5.00, 2),  -- John earned $5 from level 2
(2, 10.00, 1), -- Jane earned $10 from level 1
(3, 5.00, 2);  -- Alice earned $5 from level 2

-- Create Admins Table
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- Insert Dummy Data into Admins Table
INSERT INTO admins (username, password) VALUES
('admin1', 'password123'),
('admin2', 'admin@456');