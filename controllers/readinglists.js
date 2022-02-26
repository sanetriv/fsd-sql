const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { Readinglist, User } = require('../models')
const Session = require('../models/session')
const { SECRET } = require('../util/config')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.post('/', async (req, res, next) => {
  try {
    const rl = await Readinglist.create(req.body)
    res.json(rl)
  } catch(error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    if(user.disabled){
      return res.status(401).json({error: 'user is disabled'})
    }
    const ses = await Session.findOne({where: {userId: user.id}})
    if(ses){
      const rl = await Readinglist.findOne({ where: { id: req.params.id, userId: user.id } })
      if(rl){  
        rl.read = req.body.read
        rl.save()
        res.json(rl)
      }else{
        res.status(401).end()
      }
    }else{
      res.status(401).json({error: 'token expired'})
    }
  } catch(error) {
    next(error)
  }
})

module.exports = router