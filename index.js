
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./liquid.coach.cjs.production.min.js')
} else {
  module.exports = require('./liquid.coach.cjs.development.js')
}
