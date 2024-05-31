-- Create the user with a password
CREATE USER db_user WITH PASSWORD 'postgres';

-- Create the database
CREATE DATABASE home_improvement OWNER db_user;

GRANT ALL ON SCHEMA public TO db_user;