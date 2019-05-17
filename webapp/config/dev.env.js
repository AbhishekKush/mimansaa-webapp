'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_GOOGLE_MAPS_API_KEY:'"AIzaSyDxVPvHG8cVUF7Ynjkb2bpkBd1EfEo_syY"'
})
