const SessionBrief = require('../models/SessionBrief')

const ROLES = ['HR', 'Customer Support']
const STATUSES = ['Not Started', 'In Progress', 'Completed']
const FIELDS = ['goal', 'importantPoints', 'followUps', 'notes']
const MAX_LENGTHS = { goal: 500, importantPoints: 2000, followUps: 2000, notes: 5000 }

function briefKey(req) {
  const role = req.method === 'GET' || req.method === 'DELETE' ? req.query.role : req.body?.role
  const conversationId = req.method === 'GET' || req.method === 'DELETE' ? req.query.conversationId : req.body?.conversationId
  if (!ROLES.includes(role)) return { error: 'Choose a valid assistant role' }
  if (typeof conversationId !== 'string' || !conversationId.trim() || conversationId.length > 100) return { error: 'A valid conversation ID is required' }
  return { role, conversationId: conversationId.trim() }
}

async function getSessionBrief(req, res) {
  const key = briefKey(req)
  if (key.error) return res.status(400).json({ message: key.error })
  try {
    const brief = await SessionBrief.findOne({ userId: req.user._id, ...key }).lean()
    return res.json({ brief })
  } catch (error) {
    console.error('Session brief lookup failed:', error.name || 'DatabaseError')
    return res.status(500).json({ message: 'Session brief could not be loaded' })
  }
}

async function saveSessionBrief(req, res) {
  const key = briefKey(req)
  if (key.error) return res.status(400).json({ message: key.error })
  const status = req.body?.status || 'Not Started'
  if (!STATUSES.includes(status)) return res.status(400).json({ message: 'Choose a valid brief status' })
  const update = { status }
  for (const field of FIELDS) {
    const value = req.body?.[field]
    if (typeof value !== 'string') return res.status(400).json({ message: `${field} must be text` })
    if (value.length > MAX_LENGTHS[field]) return res.status(400).json({ message: `${field} is too long` })
    update[field] = value.trim()
  }
  if (!FIELDS.some((field) => update[field])) return res.status(400).json({ message: 'Add a goal, point, follow-up, or note before saving' })

  try {
    const brief = await SessionBrief.findOneAndUpdate(
      { userId: req.user._id, ...key },
      { $set: update, $setOnInsert: { userId: req.user._id, ...key } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    ).lean()
    return res.json({ message: 'Session brief saved', brief })
  } catch (error) {
    console.error('Session brief save failed:', error.name || 'DatabaseError')
    return res.status(500).json({ message: 'Session brief could not be saved' })
  }
}

async function deleteSessionBrief(req, res) {
  const key = briefKey(req)
  if (key.error) return res.status(400).json({ message: key.error })
  try {
    const result = await SessionBrief.deleteOne({ userId: req.user._id, ...key })
    if (!result.deletedCount) return res.status(404).json({ message: 'No saved brief exists for this conversation' })
    return res.json({ message: 'Session brief deleted' })
  } catch (error) {
    console.error('Session brief delete failed:', error.name || 'DatabaseError')
    return res.status(500).json({ message: 'Session brief could not be deleted' })
  }
}

module.exports = { getSessionBrief, saveSessionBrief, deleteSessionBrief }
