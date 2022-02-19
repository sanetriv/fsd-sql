const router = require('express').Router()
const sequelize = require('sequelize')

const { Blog } = require('../models')

router.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.findAll({
      group: 'author',
      attributes: [
        'author',
        [sequelize.fn('COUNT', sequelize.col('title')), 'blogs'],
        [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
      ],
      order: [
        [sequelize.fn('SUM', sequelize.col('likes')), 'DESC']
      ]
    })
    res.json(blogs)
  } catch(error) {
    next(error)
  }
})

module.exports = router