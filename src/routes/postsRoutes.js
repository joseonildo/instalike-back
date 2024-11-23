import express from "express";
import multer from "multer";
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js";
import cors from "cors";

const corsOption = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
}

// Configura o armazenamento das imagens em disco
const storage = multer.diskStorage({
    // Define o diretório de destino para as imagens
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    // Define o nome do arquivo no destino
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Cria uma instância do multer com a configuração de armazenamento
const upload = multer({ dest: "./uploads", storage });

// No Linux ou no MAC apenas a linha abaixo:
//const upload = multer({ dest: "./uploads"})

// Função que define as rotas da aplicação
const routes = (app) => {
    // Permite que a aplicação receba dados no formato JSON
    app.use(express.json());

    app.use(cors(corsOption));
    // Rota GET para listar todos os posts
    app.get("/posts", listarPosts);

    // Rota POST para criar um novo post
    app.post("/posts", postarNovoPost);

    // Rota POST para fazer upload de uma imagem
    app.post("/upload", upload.single("imagem"), uploadImagem);

    app.put("/upload/:id", atualizarNovoPost);

};

export default routes;
