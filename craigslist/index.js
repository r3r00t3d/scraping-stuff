const puppeteer = require('puppeteer')
const cheerio = require('cheerio')


async function main() {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto('https://sfbay.craigslist.org/d/software-qa-dba-etc/search/sof')
    const html = await page.content()
    const $ = cheerio.load(html)
    // $('.result-title').each((index, elem) => {
    // 	// console.log($(elem).text())
    // 	console.log($(elem).attr('href'))
    // })
    const results = $('.result-info').map((index, elem) => {
        const titleElement = $(elem).find('.result-title')
        const timeElement = $(elem).find('.result-date')
         title = $(titleElement).text()
        const url = $(titleElement).attr('href')
        const datePosted = new Date($(timeElement).attr('datetime'))
        return {
            title,
            url,
            datePosted
        }
    }).get()
    console.log(results)
}

main()