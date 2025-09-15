import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Garante que o caminho funciona no Vercel (Linux) e local
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Caminho corrigido para a estrutura mostrada
const dbPath = path.resolve(__dirname, '../database/Registros.json')

let Registros = null
let users = null

// Função para carregar dados de forma assíncrona
const loadData = async () => {
  if (Registros === null) {
    try {
      // Verifica se o arquivo existe
      await fs.promises.access(dbPath, fs.constants.F_OK)
      const data = await fs.promises.readFile(dbPath, 'utf-8')
      Registros = JSON.parse(data)
      
      users = Registros.map((u, id) => ({
        id: id + 1,
        nome: u.name,
        email: u.email,
        senha: u.Senha,
        curso: u.curso,
        tipo: u.Tipo || 'Aluno'
      }))
      
      console.log('Dados carregados com sucesso:', Registros.length, 'registros')
    } catch (error) {
      console.error('Erro ao carregar dados do caminho:', dbPath)
      console.error('Erro detalhado:', error)
      
      // Fallback com dados de exemplo para não quebrar o servidor
      Registros = [
        {
          "name": "UsuarioTeste",
          "Realname": "Usuario de Teste",
          "CPF": "00000000000",
          "email": "teste@unifoa.edu.br",
          "curso": "Sistemas de Informação",
          "Senha": "123456",
          "Tipo": "Aluno",
          "uf": "RJ",
          "cidade": "Volta Redonda",
          "endereco": "Rua Teste",
          "numero": "123",
          "complemento": "Apto 1"
        }
      ]
      
      users = Registros.map((u, id) => ({
        id: id + 1,
        nome: u.name,
        email: u.email,
        senha: u.Senha,
        curso: u.curso,
        tipo: u.Tipo || 'Aluno'
      }))
    }
  }
  return { Registros, users }
}

const nextId = (users) => (users.length ? users[users.length - 1].id + 1 : 1)

const UsersRepo = {
  async readAll() {
    try {
      const { Registros } = await loadData()
      return Registros
    } catch (error) {
      console.error('Erro em readAll:', error)
      return []
    }
  },

  async readByEmail(email) {
    try {
      const { users } = await loadData()
      return users.find(u => u.email === email)
    } catch (error) {
      console.error('Erro em readByEmail:', error)
      return null
    }
  },

  async create({ nome, email, senha, curso, tipo = 'Aluno' }) {
    try {
      const { users } = await loadData()
      const novo = {
        id: nextId(users),
        nome,
        email,
        senha,
        curso,
        tipo
      }
      users.push(novo)
      
      // Adiciona também ao array original para manter consistência
      const novoRegistro = {
        name: nome,
        Realname: nome,
        CPF: "00000000000",
        email,
        curso,
        Senha: senha,
        Tipo: tipo,
        uf: "uf",
        cidade: "cidade",
        endereco: "endereco",
        numero: "numero",
        complemento: "complemento"
      }
      Registros.push(novoRegistro)
      
      console.log('Novo usuário criado:', novo)
      return novo
    } catch (error) {
      console.error('Erro em create:', error)
      throw error
    }
  }
}

export default UsersRepo