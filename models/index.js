const Blog = require('./blog')
const User = require('./user')
const Readinglist = require('./readinglist')
const Sub = require('./sub')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

Blog.belongsToMany(User, { through: Readinglist, as: 'blogsInList' })
User.belongsToMany(Blog, { through: Readinglist, as: 'readings' })

User.hasOne(Session)
Session.belongsTo(User)

module.exports = {
  Blog, User, Readinglist
}