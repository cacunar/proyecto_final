const pool = require("../config/db");

const createPost = async (
    userId,
    category,
    title,
    description,
    price,
    imageUrl,
    year,
    km,
    model,
    fuelType,
    doors,
    version,
    transmission,
    color
) => {
    const query = `
      INSERT INTO posts (
        user_id, category, title, description, price, image_url,
        year, km, model, fuel_type, doors, version, transmission, color
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;
    const values = [
      userId,
      category,
      title,
      description,
      price,
      imageUrl,
      year,
      km,
      model,
      fuelType,
      doors,
      version,
      transmission,
      color
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
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

// 🔹 Obtener todas las publicaciones (SIN category_id, SIN categories)
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



// 🔹 Obtener un solo post (SIN category_id, SIN categories)
const getPostById = async (postId) => {
    // Eliminamos JOIN con "categories" y "posts.category_id"
    const query = `
        SELECT posts.*, 
               users.first_name AS seller_first_name, 
               users.last_name AS seller_last_name
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE posts.id = $1
    `;
    const { rows } = await pool.query(query, [postId]);
    return rows[0]; // Retorna el primer resultado (único post)
};


// 🔹 Actualizar una publicación (SIN category_id)
const updatePost = async (
    postId,
    userId,
    title,
    description,
    price,
    category,
    imageUrl,
    year,
    km,
    model,
    fuelType,
    doors,
    version,
    transmission,
    color
) => {
    const query = `
      UPDATE posts
      SET
        title = $1,
        description = $2,
        price = $3,
        category = $4,
        image_url = $5,
        year = $6,
        km = $7,
        model = $8,
        fuel_type = $9,
        doors = $10,
        version = $11,
        transmission = $12,
        color = $13,
        updated_at = NOW()
      WHERE id = $14 AND user_id = $15
      RETURNING *
    `;
    const values = [
      title,
      description,
      price,
      category,
      imageUrl,
      year,
      km,
      model,
      fuelType,
      doors,
      version,
      transmission,
      color,
      postId,
      userId
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
};


// 🔹 Eliminar una publicación
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
    getAllPosts, 
    getPostById, 
    updatePost, 
    deletePost 
};
