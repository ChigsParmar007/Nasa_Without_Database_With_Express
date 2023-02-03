const mongoose = require('mongoose')
// const MONGO_URL = 'mongodb+srv://NasaAPI:yDN4THUlSTnk7MHY@nasaapi.zvgccdj.mongodb.net/NasaAPI?retryWrites=true&w=majority'

mongoose.connection.openUri('open', () => {
    console.log('Connected to MongoDB')
})

mongoose.connection.on('err', () => {
    console.error(err)
})

mongoose.set('strictQuery', false)

const mongoConnect = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017', {
        // useNewUrlParser: true,
        // useFindAbdModify: false,
        // useCreateIndex: true,
        // useUnifiedTopology: true,
    }).then(() => {
        console.log('Connected to the database ')
    })
        .catch((err) => {
            console.error(`Error connecting to the database. ${err}`);
        })
}

module.exports = { mongoConnect }