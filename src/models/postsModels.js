import 'dotenv/config';
import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";

// **Estabelece a conexão com o banco de dados MongoDB**
// Conecta ao banco de dados usando a string de conexão fornecida como variável de ambiente
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

// **Função assíncrona para obter todos os posts do banco de dados**
export async function getTodosPosts() {
  // **Seleciona o banco de dados específico**
  const db = conexao.db("imersaodev-backend");
  // **Seleciona a coleção de posts dentro do banco de dados**
  const colecao = db.collection("posts");
  // **Executa a operação de busca em toda a coleção e retorna os resultados como um array**
  return colecao.find().toArray();
}

export async function criarPost(novoPost) {
  // **Seleciona o banco de dados específico**
  const db = conexao.db("imersaodev-backend");
  // **Seleciona a coleção de posts dentro do banco de dados**
  const colecao = db.collection("posts");
  // **Insere um novo documento (post) na coleção e retorna o resultado da operação**
  return colecao.insertOne(novoPost);
}

export async function atualizarPost(id, novoPost) {    
    const db = conexao.db("imersaodev-backend");    
    const colecao = db.collection("posts"); 
    const objID = ObjectId.createFromHexString(id)   
    return colecao.updateOne({_id: new ObjectId(objID)}, {$set:novoPost})
  }