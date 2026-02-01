-- =============================================
-- 1. LIMPIEZA INICIAL (Cuidado: Borra datos existentes)
-- =============================================
DROP TABLE IF EXISTS user_stats CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS job_vacancies CASCADE;
DROP TABLE IF EXISTS user_saved_events CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS user_challenge_attempts CASCADE;
DROP TABLE IF EXISTS challenges CASCADE;
DROP TABLE IF EXISTS learning_paths CASCADE;
DROP TABLE IF EXISTS diagnostic_tests CASCADE;
DROP TABLE IF EXISTS project_evidences CASCADE;
DROP TABLE IF EXISTS project_technologies_used CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS user_interests CASCADE;
DROP TABLE IF EXISTS user_soft_skills CASCADE;
DROP TABLE IF EXISTS user_tech_skills CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS cat_states CASCADE;
DROP TABLE IF EXISTS cat_event_types CASCADE;
DROP TABLE IF EXISTS cat_soft_skills CASCADE;
DROP TABLE IF EXISTS cat_technologies CASCADE;
DROP TABLE IF EXISTS cat_tech_categories CASCADE;
DROP TYPE IF EXISTS user_role_enum;
DROP TYPE IF EXISTS skill_level_enum;
DROP TYPE IF EXISTS project_type_enum;
DROP TYPE IF EXISTS project_status_enum;
-- =============================================
-- 2. DEFINICIÓN DE TIPOS DE DATOS (ENUMS)
-- =============================================
CREATE TYPE project_status_enum AS ENUM ('Desarrollo', 'Finalizado', 'Mantenimiento');
CREATE TYPE project_type_enum AS ENUM (
    'Académico',
    'Personal',
    'Colaborativo',
    'Profesional'
);
CREATE TYPE skill_level_enum AS ENUM ('Básico', 'Intermedio', 'Avanzado', 'Experto');
CREATE TYPE user_role_enum AS ENUM ('Estudiante', 'Admin', 'Mentor');
-- =============================================
-- 3. CATÁLOGOS (Tablas de Búsqueda/Uso)
-- =============================================
-- Categorías de tecnologías (Ej: Lenguajes, Frameworks)
CREATE TABLE cat_tech_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);
-- Tecnologías (Ej: Python, React, AWS)
CREATE TABLE cat_technologies (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES cat_tech_categories(id),
    name VARCHAR(100) NOT NULL,
    icon_url TEXT
);
-- Habilidades Blandas (Ej: Liderazgo)
CREATE TABLE cat_soft_skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
-- Tipos de Eventos (Ej: Hackathon)
CREATE TABLE cat_event_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);
-- Estados de la República (Ej: Jalisco, CDMX)
CREATE TABLE cat_states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
-- =============================================
-- 4. USUARIOS Y PERFIL
-- =============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    -- NULL si usa Google Login
    google_id VARCHAR(255) UNIQUE,
    -- ID único de Google
    auth_provider VARCHAR(50) DEFAULT 'email',
    -- 'email' o 'google'
    profile_picture_url TEXT,
    bio TEXT,
    current_title VARCHAR(100),
    -- Ej: "Estudiante de ISC"
    role user_role_enum DEFAULT 'Estudiante',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);
-- Relación Usuario - Habilidades Técnicas
CREATE TABLE user_tech_skills (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    technology_id INT REFERENCES cat_technologies(id),
    level skill_level_enum DEFAULT 'Básico',
    PRIMARY KEY (user_id, technology_id)
);
-- Relación Usuario - Habilidades Blandas
CREATE TABLE user_soft_skills (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    soft_skill_id INT REFERENCES cat_soft_skills(id),
    PRIMARY KEY (user_id, soft_skill_id)
);
-- Relación Usuario - Intereses
CREATE TABLE user_interests (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    technology_id INT REFERENCES cat_technologies(id),
    PRIMARY KEY (user_id, technology_id)
);
-- =============================================
-- 5. PORTAFOLIO Y PROYECTOS
-- =============================================
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    type project_type_enum NOT NULL,
    role_description VARCHAR(100),
    start_date DATE,
    end_date DATE,
    status project_status_enum DEFAULT 'Desarrollo',
    repo_url TEXT,
    demo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Qué tecnologías se usaron en CADA proyecto
CREATE TABLE project_technologies_used (
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    technology_id INT REFERENCES cat_technologies(id),
    PRIMARY KEY (project_id, technology_id)
);
-- Imágenes o documentos del proyecto
CREATE TABLE project_evidences (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    description VARCHAR(200)
);
-- =============================================
-- 6. EDUCACIÓN Y RETOS
-- =============================================
-- Resultados del Test Inicial
CREATE TABLE diagnostic_tests (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    score DECIMAL(5, 2),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    result_summary JSONB -- Guarda detalles del resultado
);
-- Rutas de aprendizaje generadas
CREATE TABLE learning_paths (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150),
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Banco de Retos/Preguntas
CREATE TABLE challenges (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    technology_id INT REFERENCES cat_technologies(id),
    difficulty skill_level_enum DEFAULT 'Básico',
    points_reward INT DEFAULT 10,
    question_data JSONB NOT NULL -- Estructura de la pregunta (JSON)
);
-- Intentos de retos por usuario
CREATE TABLE user_challenge_attempts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    challenge_id INT REFERENCES challenges(id),
    is_correct BOOLEAN NOT NULL,
    score_obtained INT,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- =============================================
-- 7. EVENTOS Y NETWORKING
-- =============================================
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    event_type_id INT REFERENCES cat_event_types(id),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    is_virtual BOOLEAN DEFAULT FALSE,
    state_id INT REFERENCES cat_states(id),
    -- NULL si es virtual
    location_address TEXT,
    registration_link TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Eventos guardados por el usuario
CREATE TABLE user_saved_events (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    event_id INT REFERENCES events(id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notification_sent BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, event_id)
);
-- =============================================
-- 8. GAMIFICACIÓN Y EMPLEO
-- =============================================
CREATE TABLE job_vacancies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    description TEXT,
    requirements TEXT,
    application_link TEXT,
    posted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    icon_url TEXT,
    criteria_code VARCHAR(50)
);
CREATE TABLE user_badges (
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    badge_id INT REFERENCES badges(id),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, badge_id)
);
-- Resumen de estadísticas del usuario
CREATE TABLE user_stats (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_streak_days INT DEFAULT 0,
    total_points INT DEFAULT 0,
    challenges_completed INT DEFAULT 0,
    projects_completed INT DEFAULT 0,
    last_activity_date TIMESTAMP WITH TIME ZONE
);