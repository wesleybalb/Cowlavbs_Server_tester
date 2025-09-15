import express from 'express'
import RegistrosRotas from './routes/RegistrosRotas.js'
import globalMiddleware from './middleware/globalMiddleware.js'

const app = express()

const port = process.env.PORT || 3000
const host = process.env.HOST || '0.0.0.0'

// Middleware de debug para Vercel
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
})

app.use(globalMiddleware.cors)
app.use(express.json())

// Rota de health check com mais informações
app.get('/', (req, res) => {
  console.log('Rota raiz acessada')
  
  res.status(200).json({ 
    system: 'Cowlabs', 
    ServerWorking: true,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    vercel: process.env.VERCEL ? true : false
  })
})

// Rota de teste adicional
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
})


app.use(RegistrosRotas)

// Error handler
app.use((error, req, res, next) => {
  console.error('Erro capturado:', error)
  res.status(500).json({
    error: 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.url,
    method: req.method
  })
})

// Só escuta na porta se não estiver em produção (Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, host, () => {
    console.log(`Servidor rodando em http://${host}:${port}`)
  })
}

export default app