import express from 'express'
import RegistrosRotas from './routes/RegistrosRotas.js'
import globalMiddleware from './middleware/globalMiddleware.js'

const app = express()
// define porta e host
const port = process.env.PORT || 3000
const host = process.env.HOST || `0.0.0.0`

// middlewares
app.use(globalMiddleware.cors)
app.use(express.json()) // sem isso o req.body vem vazio

// rota
app.get('/' ,(req, res) =>{ 
    res.status(200).json({
        system: 'Cowlabs',
        ok: true
    })
})

// main routes
app.use(RegistrosRotas)


// Só roda listen em ambiente local
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, host, () => {
    console.log(`Servidor rodando em http://${host}:${port}`)
  })
}

export default app