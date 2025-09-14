import app from '../src/Server.js'
import serverless from 'serverless-http'

export const handler = serverless(app)
  