const request = require("supertest");
const app = require("../server");
const pool = require("../config/db");
const fs = require("fs");
const path = require("path");

describe("API Tests", () => {
    let token = "";
    let postId;

    beforeAll(async () => {
        await pool.query("DELETE FROM users WHERE email = 'test@example.com'");
    });

    it("Debe registrar un usuario", async () => {
        const res = await request(app)
            .post("/api/v1/auth/register")
            .send({
                firstName: "Test",
                lastName: "User",
                email: "test@example.com",
                password: "123456",
                country: "Chile",
                document: "12345678",
                phone: "123456789",
                address: "Calle 123",
                zipCode: "12345",
                birthDate: "1990-01-01"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("token");
    });

    it("Debe loguear al usuario y devolver un token", async () => {
        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: "test@example.com", password: "123456" });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
        token = res.body.token;
    });

    it("Debe obtener todas las publicaciones", async () => {
        const res = await request(app)
            .get("/api/v1/posts")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("Debe crear una publicación", async () => {
        if (!token) throw new Error("No se generó un token válido");
    
        const postData = {
            title: "Publicación de Prueba",
            description: "Descripción de prueba",
            price: 1000,
            bodyType: "Sedán", 
            year: 2022,
            km: 10000,
            model: "Toyota Corolla",
            fuelType: "Gasolina",
            doors: 4,
            version: "XLE",
            transmission: "Automática",
            color: "Azul"
        };
    
        const imagePath = path.join(__dirname, "test-image.jpg"); 
    
        const res = await request(app)
            .post("/api/v1/posts/create")
            .set("Authorization", `Bearer ${token}`)
            .field("title", postData.title)
            .field("description", postData.description)
            .field("price", postData.price)
            .field("bodyType", postData.bodyType)
            .field("year", postData.year)
            .field("km", postData.km)
            .field("model", postData.model)
            .field("fuelType", postData.fuelType)
            .field("doors", postData.doors)
            .field("version", postData.version)
            .field("transmission", postData.transmission)
            .field("color", postData.color)
            .attach("image", imagePath);
    
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id");
        postId = res.body.id;
        if (!postId) throw new Error("No se generó un ID de publicación");
    });
    

    it("Debe eliminar la publicación creada", async () => {
        if (!postId) throw new Error("No se generó un ID de publicación");

        const res = await request(app)
            .delete(`/api/v1/posts/${postId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("message", "Publicación eliminada correctamente");
    });

    it("Debe devolver error 403 si un usuario intenta eliminar una publicación que no le pertenece", async () => {
        if (!token) throw new Error("No se generó un token válido");
    
        const postData = {
            title: `Publicación de Prueba ${Date.now()}`,
            description: "Descripción de prueba",
            price: 1000,
            bodyType: "SUV",  // 📌 Ahora usamos `bodyType` en lugar de `category`
            year: 2023,
            km: 5000,
            model: "Ford Explorer",
            fuelType: "Diésel",
            doors: 5,
            version: "Limited",
            transmission: "Automática",
            color: "Negro"
        };
    
        // 📌 Cargar imagen de prueba
        const imagePath = path.join(__dirname, "test-image.jpg"); 
    
        const newPostRes = await request(app)
            .post("/api/v1/posts/create")
            .set("Authorization", `Bearer ${token}`)
            .field("title", postData.title)
            .field("description", postData.description)
            .field("price", postData.price)
            .field("bodyType", postData.bodyType)
            .field("year", postData.year)
            .field("km", postData.km)
            .field("model", postData.model)
            .field("fuelType", postData.fuelType)
            .field("doors", postData.doors)
            .field("version", postData.version)
            .field("transmission", postData.transmission)
            .field("color", postData.color)
            .attach("image", imagePath); // 📌 Adjuntar imagen
    
        console.log("📌 Respuesta de creación de post:", newPostRes.body); // 🔍 Depuración
    
        const createdPostId = newPostRes.body?.id;
    
        if (!createdPostId) {
            throw new Error("No se generó un ID de publicación");
        }
    
        // 📌 Crear nuevo usuario para intentar eliminar el post
        const emailUnico = `test${Date.now()}@example.com`;
        const randomDoc = Date.now().toString().slice(-8);
        
        await request(app)
            .post("/api/v1/auth/register")
            .send({ 
                firstName: "Otro",
                lastName: "Usuario",
                email: emailUnico,
                password: "123456",
                country: "Chile",
                document: randomDoc,
                phone: "987654321",
                address: "Calle 456",
                zipCode: "54321",
                birthDate: "1990-01-02"
            });
    
        const loginRes = await request(app)
            .post("/api/v1/auth/login")
            .send({ email: emailUnico, password: "123456" });
    
        expect(loginRes.statusCode).toBe(200);
        const otherUserToken = loginRes.body.token;
    
        if (!otherUserToken) {
            throw new Error("No se generó un token para el segundo usuario");
        }
    
        // 📌 Intentar eliminar la publicación con otro usuario
        const res = await request(app)
            .delete(`/api/v1/posts/${createdPostId}`)
            .set("Authorization", `Bearer ${otherUserToken}`);
    
        expect(res.statusCode).toBe(403);
        expect(res.body).toHaveProperty("message", "No tienes permisos para eliminar esta publicación");
    });

    afterAll(async () => {
        await pool.end();
    });
});

