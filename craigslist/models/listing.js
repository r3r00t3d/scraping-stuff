const mongoose = require('mongoose')
const validator = require('validator')

const listingSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error(`Value ${value} is not an url. Exiting...`)
            }
        }
    },
    datePosted: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: false
    },
    jobDescription: {
        type: String,
        trim: true,
        required: true
    },
    compensation: {
        type: String,
        required: false
    }
})

const Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing