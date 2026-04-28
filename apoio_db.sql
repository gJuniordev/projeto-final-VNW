CREATE DATABASE apoiors;

CREATE TABLE shelters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    capacity INTEGER NOT NULL,
    occupied_slots INTEGER DEFAULT 0,
    contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE donation_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE shelter_needs (
    id SERIAL PRIMARY KEY,
    shelter_id INTEGER REFERENCES shelters(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES donation_categories(id),
    urgency_level VARCHAR(50), -- Baixa, Média, Crítica
    description TEXT,
    is_met BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shelter_occupants (
    id SERIAL PRIMARY KEY,
    shelter_id INTEGER REFERENCES shelters(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir algumas categorias básicas para teste
INSERT INTO donation_categories (name) VALUES ('Alimentos'), ('Água'), ('Higiene'), ('Vestuário'), ('Colchões');

INSERT INTO shelters (name, address, city, capacity, occupied_slots, contact_phone)
VALUES ('Abrigo Central Brasília', 'Setor Comercial Sul, Quadra 05', 'Brasília', 50, 10, '61999999999');