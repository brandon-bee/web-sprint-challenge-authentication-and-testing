const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('./server')
const Auth = require('./auth/auth-model')

const user1 = {
  username: 'Sauron',
  password: 'IamTheBest'
}

test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db('users').truncate()
})

afterAll(async () => {
  await db.destroy()
})

describe('API endpoint tests', () => {
  describe('auth-router tests', () => {
    describe('[POST] /api/auth/register', () => {
      it('should return the newly created user', async () => {
        const res = await request(server).post('/api/auth/register').send(user1)
        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('username', 'Sauron')
        expect(res.body).toHaveProperty('password')
      })
      it('should return a status code of 201', async () => {
        const res = await request(server).post('/api/auth/register').send(user1)
        expect(res.status).toBe(201)
      })
    })
    describe('[POST] /api/auth/login', () => {
      it('should return an object with shape of message and token', async () => {
        await request(server).post('/api/auth/register').send(user1)
        const res = await request(server).post('/api/auth/login').send(user1)
        expect(res.body).toHaveProperty('message', 'welcome, Sauron')
        expect(res.body).toHaveProperty('token')
      })
      it('should return a status code of 200', async () => {
        await request(server).post('/api/auth/register').send(user1)
        const res = await request(server).post('/api/auth/login').send(user1)
        expect(res.status).toBe(200)
      })
    })
  })
  describe('joke-router tests', () => {
    describe('[GET] /api/auth/register', () => {
      it('should return a list of jokes', async () => {
        await request(server).post('/api/auth/register').send(user1)
        const login = await request(server).post('/api/auth/login').send(user1)
        const token = login.body.token
        const res = await request(server).get('/api/jokes').set('Authorization', token)
        expect(res.body).toHaveLength(3)
      })
      it('should return a status code of 200', async () => {
        await request(server).post('/api/auth/register').send(user1)
        const login = await request(server).post('/api/auth/login').send(user1)
        const token = login.body.token
        const res = await request(server).get('/api/jokes').set('Authorization', token)
        expect(res.status).toBe(200)
      })
    })
  })
})