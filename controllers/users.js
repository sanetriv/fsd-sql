const router = require('express').Router()

const { Op } = require('sequelize')
const { User, Blog, Readinglist } = require('../models')

router.get('/', async (req, res) => {
  /*const users = await User.findAll({
    include: {
      model: Blog,
      attribute: { exclude: ['userId'] }
    }
  })
  res.json(users)*/
  const users = await User.findAll({ 
    include: [
      { 
        model: Readinglist, 
      }
    ]
  })
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.put('/:username', async (req, res, next) => {
  const user = await User.findOne({ where: { username: req.params.username } })
  try {
    user.username = req.body.newUsername
    await user.save()
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.get('/:id', async (req, res) => {
  const where = {}

  if ( req.query.read ) {
    where.read = req.query.read
  }
  
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['id','createdAt', 'updatedAt'] },
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: {
          exclude: [
            'createdAt', 'updatedAt', 'userId'
          ]
        },
        through: {
          attributes: {
            exclude: ['userId', 'blogId']
          },
          where
        }
      }
    ]
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router