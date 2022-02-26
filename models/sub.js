const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Sub extends Model {}

Sub.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  blogId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'blogs', key: 'id' },
  },
  readinglistId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'readinglists', key: 'id' },
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'sub'
})

module.exports = Sub