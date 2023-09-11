import express from 'express'
import cors from 'cors'
import authController from './controllers/auth'
import userController from './controllers/user'
import publicController from './controllers/public'
import { staticPath, port } from './config'

const app = express()

app.use(express.json())
app.use(cors())
app.use('/static', express.static(staticPath));
app.use('/auth', authController)
app.use('/public', publicController)
app.use('/user', userController)


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)  
})