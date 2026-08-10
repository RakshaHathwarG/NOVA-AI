const crypto = require('crypto')

const users = []
const chats = []

function createUserRecord({ name, email, password }) {
  const id = crypto.randomUUID()
  const user = {
    _id: id,
    id,
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  return user
}

function findUserByEmail(email) {
  return users.find((user) => user.email === email) || null
}

function findUserById(id) {
  return users.find((user) => user._id === id || user.id === id) || null
}

function addChat(chat) {
  const record = {
    _id: crypto.randomUUID(),
    ...chat,
    timestamp: chat.timestamp || new Date().toISOString(),
  }
  chats.push(record)
  return record
}

function getChatsByUserId(userId) {
  return chats
    .filter((chat) => chat.userId === userId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
}

module.exports = {
  createUserRecord,
  findUserByEmail,
  findUserById,
  addChat,
  getChatsByUserId,
}
