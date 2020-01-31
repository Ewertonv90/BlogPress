const Sequelize = require("sequelize")

const connection = new Sequelize('blogpress', 'root', '',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'

})

module.exports = connection