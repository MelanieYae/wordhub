import path from 'path'
import dotenv from 'dotenv'

dotenv.config({path: '../.env'})


export const chatGptApiKey = process.env.CHATGPT_API_KEY
export const staticPath = path.join(__dirname, '../static')
export const port = 3000
