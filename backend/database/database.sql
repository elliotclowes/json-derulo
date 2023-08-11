DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS tokens CASCADE;
DROP TABLE IF EXISTS verification_tokens CASCADE;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    teacher BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false
);

CREATE TABLE tokens (
    token_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL
);

CREATE TABLE verification_tokens (
    token_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL
);



-- Sample Data --

INSERT INTO users (first_name, last_name, email, username, password, teacher, is_verified)
VALUES
    ('Elliot', 'Clowes', 'hi@clowes.me', 'elliot', '$2b$10$ESylvA.25PVWUQQk/jLfd.FHiju/U.mxb4pnKxevyY0OYtj8dO3a6', true, true),
    ('Test', 'User', 'test@example.com', 'test', '$2b$10$WxMO5IfOSvvsNi4rDsPc9uEH.I4y1MuGj6W8.sFyTEq48.maIVuLu',true,  true);


INSERT INTO verification_tokens (user_id, token)
VALUES
    (2, 'd5e7d720-e5be-464b-9254-f6f94099ab6b');
