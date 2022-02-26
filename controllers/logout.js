const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session')
const res = require('express/lib/response')

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
  console.log(req.decodedToken)
  next()
}

router.post('/', tokenExtractor, async (req, res, next) => {
  try{
    const user = await User.findByPk(req.decodedToken.id)
    const ses = await Session.findOne({where:{userId:req.decodedToken.id}})
    if(ses){
      await Session.destroy({ where: { userId: req.decodedToken.id } })
      if(user.disabled){
        return res.status(401).json({error: 'user is disabled'})
      }
      res.status(200).json({message:'logged out'})
    }else{
      res.status(401).json({error: 'token expired'})
    }
  } catch(error){
    next(error)
  }
})

module.exports = router