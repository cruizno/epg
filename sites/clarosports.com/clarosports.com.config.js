const axios = require('axios')
const cheerio = require('cheerio')
const url = require('url')
const path = require('path')
const { DateTime } = require('luxon')

module.exports = {
    site: 'clarosports.com',
    days: 1,
    url({channel, date}) {
        return 'https://www.clarosports.com/en-vivo-latam/'
    },
    parser({ content, date }) {
        
    },
    async channels() {
        
    }
}