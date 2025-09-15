import app from '../src/Server.js'
import serverless from 'serverless-http'

// Exporta como default (compatível com Vercel)
export default serverless(app)
