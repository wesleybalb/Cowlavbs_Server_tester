import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Garante que o caminho funciona no Vercel (Linux) e local
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, '../database/Registros.json')

// Lê e parseia o JSON
const Registros = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))

const users = Registros.map((u, id) => ({
  id: id + 1,
  nome: u.name,
  email: u.email,
  senha: u.Senha,
  curso: u.curso,
  tipo: u.Tipo || 'Aluno'
}))

const nextId = () => (users.length ? users[users.length - 1].id + 1 : 1)

const UsersRepo = {
  async readAll() {
    return users
  },

  async readByEmail(email) {
    return users.find(u => u.email === email)
  },

  create({ nome, email, senha, curso }) {
    const novo = {
      id: nextId(),
      nome,
      email,
      senha,
      curso,
      tipo: 'Aluno'
    }
    users.push(novo)
    return novo
  }
}

export default UsersRepo
