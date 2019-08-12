const mongoose = require('mongoose')
const keys = require('./keys')

const mongoConnect = async function () {
    try {
        const uri = `mongodb+srv://${keys.mongoUser}:${keys.mongoPassword}@` +
        `${keys.mongoHost}/${keys.mongoDatabase}?retryWrites=true&w=majority`

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify:false
        })
        console.log('Connected to mongodb')
    } catch (e) {
        console.log(`DB error: ${e}`)
    }
}

module.exports = mongoConnect
