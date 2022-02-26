const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const Session = require('../models/session')
const { SECRET } = require('../util/config')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

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

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        {
          title: {
            [Op.substring]: req.query.search
          }
        },
        {
          author: {
            [Op.substring]: req.query.search
          }
        }
      ]
    }
  }
  
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [
      ['likes', 'DESC']
    ]
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res, next) => {
  console.log(req.body)
  try {
    const user = await User.findByPk(req.decodedToken.id)
    if(user.disabled){
      return res.status(401).json({error: 'user is disabled'})
    }
    const ses = await Session.findOne({where:{userId: user.id}})
    if(ses){
      const blog = await Blog.create({...req.body, userId: user.id})
      return res.json(blog)
    }else{
      res.status(401).json({error:'token expired'})
    }
  } catch(error) {
    next(error)
  }
})

router.delete('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    if(user.disabled){
      return res.status(401).json({error: 'user is disabled'})
    }
    const ses = await Session.findOne({where:{userId: user.id}})
    if(ses){
      const blog = await Blog.findOne({ where: { userId: user.id, id: req.params.id } })
      if (blog){
        await blog.destroy()
        res.status(204).json(blog)
      } else {
        res.status(400).send({ message: 'blog not found' })
      }
    }else{
      res.status(401).json({error:'token expired'})
    }
  } catch(error) {
    next(error)
  }
})

router.put('/:id',tokenExtractor, blogFinder, async (req, res, next) => {
  try{
    const user = await User.findByPk(req.decodedToken.id)
    if(user.disabled){
      return res.status(401).json({error: 'user is disabled'})
    }
    const ses = await Session.findOne({where:{userId: user.id}})
    if(ses){
      if (req.blog) {
        req.blog.likes = req.body.likes
        await req.blog.save()
        res.json(req.blog)
      } else {
        res.status(404).end()
      }
    }else{
      res.status(401).json({error:'token expired'})
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router