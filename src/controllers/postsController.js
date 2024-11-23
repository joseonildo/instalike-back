import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModels.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Função assíncrona para listar todos os posts
export async function listarPosts(req, res) {
    // Chama a função do modelo para buscar todos os posts do banco de dados
    const posts = await getTodosPosts();
    // Envia os posts como resposta em formato JSON com status 200 (sucesso)
    res.status(200).json(posts);
}

// Função assíncrona para criar um novo post
export async function postarNovoPost(req, res) {
    // Obtém os dados do novo post a partir do corpo da requisição
    const novoPost = req.body;
    try {
        // Chama a função do modelo para criar o novo post no banco de dados
        const postCriado = await criarPost(novoPost);
        // Envia o post criado como resposta em formato JSON com status 200 (sucesso)
        res.status(200).json(postCriado);
    } catch (erro) {        
        // Envia uma mensagem de erro genérica ao cliente com status 500 (erro interno do servidor)
        res.status(500).json({"Erro":"Falha na requisição de postarNovoPost"});
        // Loga o erro no console para depuração
        console.error(error.message);
    }
}

// Função assíncrona para fazer upload de uma imagem e criar um novo post
export async function uploadImagem(req, res) {
    // Cria um objeto com os dados do novo post, incluindo a URL da imagem
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };
    try {
        // Chama a função do modelo para criar o novo post no banco de dados
        const postCriado = await criarPost(novoPost);
        // Constrói o novo nome da imagem com o ID do post inserido
        const imagemAtualizada = `uploads/${postCriado.insertedId}.jpg`;
        // Renomeia o arquivo da imagem para o novo nome
        fs.renameSync(req.file.path, imagemAtualizada);
        // Envia o post criado como resposta em formato JSON com status 200 (sucesso)
        res.status(200).json(postCriado);
    } catch (erro) {        
        // Envia uma mensagem de erro genérica ao cliente com status 500 (erro interno do servidor)
        res.status(500).json({"Erro":"Erro na requisição de uploadImagem"});
        // Loga o erro no console para depuração
        console.error(error.message);
    }
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.jpg`;    
    try {
        const imageBuffer = fs.readFileSync(`uploads/${id}.jpg`);
        const descricao = await gerarDescricaoComGemini(imageBuffer);
        
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }

        const postCriado = await atualizarPost(id, post);        
        res.status(200).json(postCriado);
    } catch (erro) {        
        res.status(500).json({"Erro":"Falha na requisição ao atualizar o Post"});
        console.error(error.message);
    }
}

