const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const mongoConnect = require('./mongoose')
const Listing = require('./models/listing')

async function scrapeListings(page) {
    await page.goto('https://sfbay.craigslist.org/d/software-qa-dba-etc/search/sof')
    const html = await page.content()
    const $ = cheerio.load(html)
    // $('.result-title').each((index, elem) => {
    // 	// console.log($(elem).text())
    // 	console.log($(elem).attr('href'))
    // })
    const listings = $('.result-info')
        .map((index, elem) => {
            const jobDescription = ''
            const compensation = ''
            const titleElement = $(elem).find('.result-title')
            const timeElement = $(elem).find('.result-date')
            const locationElement = $(elem).find('.result-hood')
            const title = $(titleElement).text()
            const url = $(titleElement).attr('href')
            const datePosted = new Date($(timeElement).attr('datetime'))
            const location = $(locationElement).text().trim().replace('(', '').replace(')', '')
            return {
                title,
                url,
                datePosted,
                location,
                jobDescription,
                compensation
            }
        })
        .get()
    return listings
}

async function scrapeJobDescriptions(listing, page) {
    try {
        await page.goto(listing.url)
        const html = await page.content()
        const $ = cheerio.load(html)
        $('.print-qrcode-container').remove()
        listing.jobDescription = $('#postingbody').text() 
        listing.compensation = $('p.attrgroup > span:nth-child(1) > b').text() 
        return listing
    } catch (e) {
        console.log(`Something's gone wrong: ${e}`)
    }
}

async function sleep(miliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, miliseconds)
    })
}

async function main() {
    try {
        await mongoConnect()
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        const listings = await scrapeListings(page)
        for (const [index, listing] of listings.entries()) {
            const listingsWithjobDescription = await scrapeJobDescriptions (
                listing, 
                page
            )
            const listingModel = new Listing(listingsWithjobDescription)
            await listingModel.save()
            listings[index] = listingsWithjobDescription
            await sleep(1000)
        }
    } catch (e) {
        console.log(`Something's gone wrong: ${e}`)
    }
    
    
}

main()