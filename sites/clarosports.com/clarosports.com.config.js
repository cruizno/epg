const cheerio = require('cheerio')
const url = require('url')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const customParseFormat = require('dayjs/plugin/customParseFormat')

module.exports = {
    site: 'clarosports.com',
    days: 1,
    url({ channel, date }) {
        return channel.site_id === 'claro-sports' ?
         'https://www.clarosports.com/en-vivo-latam/' : `https://www.clarosports.com/en-vivo-latam/${channel.site_id}-latam-en-vivo/`
    },
    parser({ content, date }) {
        const programs = []
        const items = parseItems(content)
        items.forEach((item, i) => {
            const prev = programs[programs.length - 1]
            const $item = cheerio.load(item)
            let start = parseStart($item, date).subtract(1, 'h')
            if (!start) return
            if (prev) { 
                if (start.isBefore(prev.start)) {
                    start = start.add(1, 'd')
                    date = date.add(1, 'd')
                }
                prev.stop = start
            }
            const stop = start.add(1, 'h')
            programs.push({
                title: parseTitle($item),
                start,
                stop
            })
        })
        
        return programs
    },
    async channels() {
        
    }
}

function parseTitle($item) {
    const $title = $item('li').contents().filter( function() { return this.nodeType === 3; } )    
    return cheerio.load($title['0']).text().toLocaleLowerCase().split(" ").map((word) => { 
        return word[0].toUpperCase() + word.substring(1); 
    }).join(" ");
}

function parseStart($item, date) {
    const timeString = $item('strong').text().split('|')[0].replace(' COL ', '')
    if (!timeString)  return null
    const dateString = `${date.format('MM/DD/YYYY')} ${timeString}`
    return dayjs.utc(dateString, 'MM/DD/YYYY HH:mm')
}

function parseItems(content) {
    const $ = cheerio.load(content)

    return $(
        'body > main.wrapper > div.container > div.wp-block-group > div.wp-block-group__inner-container > ul'
    )
    .find('li')
    .toArray()
}