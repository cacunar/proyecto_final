const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const createUser = async (userData) => {
    const { firstName, lastName, country, document, phone, email, password, address, zipCode, birthDate } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
        INSERT INTO users (first_name, last_name, country, document, phone, email, password, address, zip_code, birth_date) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING id, first_name, last_name, email, country, phone, address, zip_code, birth_date`;

    const values = [firstName, lastName, country, document, phone, email.toLowerCase(), hashedPassword, address, zipCode, birthDate];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

const getUserByEmail = async (email) => {
    const query = "SELECT id, first_name, last_name, email, password FROM users WHERE email = $1";
    const { rows } = await pool.query(query, [email.toLowerCase()]);
    return rows[0];
};

const getUserById = async (id) => {
    const query = "SELECT id, first_name, last_name, email, country, phone FROM users WHERE id = $1";
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};



module.exports = {createUser, getUserByEmail, getUserById };
