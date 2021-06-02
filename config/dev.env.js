'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://admin-api.macrozheng.com"'
  BASE_API: '"http://192.168.10.31:7788"'
  // BASE_API: '"http://47.94.227.188:7788"'
})
