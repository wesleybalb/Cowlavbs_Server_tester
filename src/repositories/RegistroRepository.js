import Registros from '../database/Registros.json' with { type: 'json' };


const users = Registros.map((u, id) => ({
  id: id + 1,
  nome: u.name,
  email: u.email,
  senha: u.Senha,
  curso: u.curso,
  tipo: u.Tipo || "Aluno" 
}));

const nextId = () => (users.length ? users[users.length - 1].id + 1 : 1);

const UsersRepo = {
    async readAll() {
    return users;
},

    async readByEmail(email) {
    const pesquisaEmail = users.find(u => u.email === email)
    return pesquisaEmail;
},
create({ nome, email, senha, curso }) {
    const novo = { 
        id: nextId(), 
        nome, 
        email, 
        senha, 
        curso, 
        tipo: 'Aluno' };
    users.push(novo);
    return novo;
    }
}

export default UsersRepo;
