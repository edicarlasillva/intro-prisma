import express, { Request, Response } from 'express'
import cors from 'cors'

import { PrismaClient } from '@prisma/client'

const app = express()

app.use(express.json())
app.use(cors())

const repository = new PrismaClient()

// Listar todos os usuários
//http://localhost:3333/users
app.get('/users', async (request: Request, response: Response) => {
  try {
    // entrada e processamento
    const users = await repository.user.findMany()

    // saída
    return response.status(200).json({
      success: true,
      code: response.statusCode,
      message: 'Usuários listados com sucesso',
      data: users
    })

  } catch (error) {
    // tratamento de erro
    return response.status(500).json({
      success: false,
      code: response.statusCode,
      message: 'Erro ao listar usuários'
    })
  }
})

// Criar um novo usuário
//http://localhost:3333/users
app.post('/users', async (request: Request, response: Response) => {
  try {
    // entrada
    const { name, lastName, email, bio, isActive } = request.body

    if (!name || !lastName || !email) {
      return response.status(400).json({
        success: false,
        code: response.statusCode,
        message: 'Preencha os campos obrigatórios'
      })
    }

    // processamento
    const createdUser = await repository.user.create({
      data: {
        name,
        lastName,
        email,
        bio,
        isActive
      }
    })

    // saída
    return response.status(201).json({
      success: true,
      code: response.statusCode,
      message: 'Usuário cadastrado com sucesso',
      data: createdUser
    })
  } catch (error) {
    // tratamento de erro
    return response.status(500).json({
      success: false,
      code: response.statusCode,
      message: 'Erro ao criar usuário'
    })
  }
})

app.get('/users/:id', async (request: Request, response: Response) => {
  try {
    // entrada e processamento
    const { id } = request.params

    const user = await repository.user.findUnique({
      where: { id: String(id) }
    })

    if (!user) {
      return response.status(404).json({
        success: false,
        code: response.statusCode,
        message: 'Usuário não encontrado',
      })
    }

    // saída
    return response.status(200).json({
      success: true,
      code: response.statusCode,
      message: 'Usuário encontrado com sucesso',
      data: user
    })

  } catch (error) {
    // tratamento de erro
    return response.status(500).json({
      success: false,
      code: response.statusCode,
      message: 'Erro ao encontrar o usuário'
    })
  }
})

app.listen(3333, () => {
  console.log("🚀 Server ready at: http://localhost:3333")
})