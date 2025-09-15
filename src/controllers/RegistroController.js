import RegistroRepository from '../repositories/RegistroRepository.js'

// Regex para validar email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const RegistroController = {
    async registro(req, res) {
        try {
            console.log('Recebido pedido de registro:', req.body)
            
            const { nome, email, senha, curso, tipo } = req.body

            // Validação de campos obrigatórios
            if (!nome || !email || !senha || !curso) {
                return res.status(400).json({
                    error: 'Campos obrigatórios: nome, email, senha e curso, preencha o faltante.'
                })
            }

            // Validação de email
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    error: 'Email inválido, insira um email válido.'
                })
            }

            // Verifica se email já existe
            const existeEmail = await RegistroRepository.readByEmail(email)
            if (existeEmail) {
                return res.status(409).json({
                    error: 'Email já cadastrado, insira outro email.'
                })
            }

            // Validação de senha
            if (senha.length < 6) {
                return res.status(400).json({
                    error: 'Senha muito curta, insira uma senha com no mínimo 6 caracteres.'
                })
            }

            // Criar novo usuário
            const novoUsuario = await RegistroRepository.create({
                nome, 
                email, 
                senha, 
                curso, 
                tipo: tipo || 'Aluno'
            })
            
            console.log('Usuário criado com sucesso:', novoUsuario)
            return res.status(201).json(novoUsuario)
            
        } catch (error) {
            console.error('Erro no controller de registro:', error)
            return res.status(500).json({
                error: 'Erro interno do servidor',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            })
        }
    }
}

export default RegistroController