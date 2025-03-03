const pool = require("../config/db");

const createPost = async (
    userId,
    title,
    description,
    price,
    year,
    km,
    model,
    fuelType,
    doors,
    version,
    transmission,
    color,
    bodyType,
    imageBuffer
) => {
    const query = `
      INSERT INTO posts (
      user_id, title, description, price, 
      year, km, model, fuel_type, doors, 
      version, transmission, color, body_type, image_data
    )
    VALUES ($1, $2, $3, $4, 
            $5, $6, $7, $8, $9, 
            $10, $11, $12, $13, $14)
    RETURNING *
    `;
    const values = [
        userId,   // $1
        title,    // $2
        description, // $3
        price,    // $4
        year,     // $5
        km,       // $6
        model,    // $7
        fuelType, // $8
        doors,    // $9
        version,  // $10
        transmission, // $11
        color,    // $12
        bodyType, // $13
        imageBuffer // $14
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

const getImageData = async (postId) => {
    const query = "SELECT image_data FROM posts WHERE id = $1";
    const { rows } = await pool.query(query, [postId]);
    return rows.length > 0 ? rows[0].image_data : null;
};

const getUserPosts = async (userId) => {
    const query = `
        SELECT posts.*
        FROM posts
        WHERE posts.user_id = $1
        ORDER BY posts.created_at DESC
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
};

const getAllPosts = async (searchTerm) => {
    let query = `
        SELECT posts.*, 
               users.first_name AS seller_first_name, 
               users.last_name AS seller_last_name
        FROM posts
        JOIN users ON posts.user_id = users.id
    `;

    let values = [];

    if (searchTerm) {
        query += ` WHERE posts.title ILIKE $1 OR posts.description ILIKE $1`;
        values.push(`%${searchTerm}%`);
    }

    query += " ORDER BY posts.created_at DESC";

    const { rows } = await pool.query(query, values);
    return rows; 
};

const getPostById = async (postId) => {
    const query = `
        SELECT posts.*, 
               users.first_name AS seller_first_name, 
               users.last_name AS seller_last_name
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.id = $1
    `;
    const { rows } = await pool.query(query, [postId]);
    return rows[0];
};


const updatePost = async (
    postId,
    userId,
    title,
    description,
    price,
    year,
    km,
    model,
    fuelType,
    doors,
    version,
    transmission,
    color,
    bodyType,
    imageBuffer
) => {
    let query;
    let values;

    if (imageBuffer) {
        query = `
          UPDATE posts
          SET
            title = $1,
            description = $2,
            price = $3,
            year = $4,
            km = $5,
            model = $6,
            fuel_type = $7,
            doors = $8,
            version = $9,
            transmission = $10,
            color = $11,
            body_type = $12, -- 🔹 Coincide con el esquema de la BD
            image_data = $13, -- 🔹 Guardamos la imagen binaria
            updated_at = NOW()
          WHERE id = $14 AND user_id = $15
          RETURNING *
        `;

        values = [
            title,
            description,
            price,
            year,
            km,
            model,
            fuelType,
            doors,
            version,
            transmission,
            color,
            bodyType, 
            imageBuffer,
            postId,
            userId
        ];
    } else {
        query = `
          UPDATE posts
          SET
            title = $1,
            description = $2,
            price = $3,
            year = $4,
            km = $5,
            model = $6,
            fuel_type = $7,
            doors = $8,
            version = $9,
            transmission = $10,
            color = $11,
            body_type = $12, -- 🔹 Coincide con el esquema de la BD
            updated_at = NOW()
          WHERE id = $13 AND user_id = $14
          RETURNING *
        `;

        values = [
            title,
            description,
            price,
            year,
            km,
            model,
            fuelType,
            doors,
            version,
            transmission,
            color,
            bodyType,
            postId,
            userId
        ];
    }

    const { rows } = await pool.query(query, values);
    return rows[0];
};





const deletePost = async (postId, userId) => {
    const post = await pool.query("SELECT * FROM posts WHERE id = $1", [postId]);
    if (post.rows.length === 0) {
        return null;
    }

    if (post.rows[0].user_id !== userId) {
        return null;
    }

    const { rows } = await pool.query("DELETE FROM posts WHERE id = $1 RETURNING *", [postId]);
    return rows[0];
  };

module.exports = { 
    getUserPosts, 
    createPost,
    getImageData, 
    getAllPosts, 
    getPostById, 
    updatePost, 
    deletePost 
};
