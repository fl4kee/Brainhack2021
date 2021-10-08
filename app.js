if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}
const express = require('express')
const app = express()
const path = require('path')
const Petplace = require('./models/petplace')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const petplaceRoutes = require('./routes/petplaces')


const dbUrl = process.env.DB_URL

mongoose.connect(dbUrl, {
    // options to turn off deprecation warnings
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {console.log('connection is open')})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.engine('ejs', ejsMate);


app.use('/petplaces', petplaceRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/makepetplace', async(req, res) => {
    const place = new Petplace({title: 'Jude', description: 'cheap place'})
    await place.save()
    res.send(place)
})

app.listen(3000, () => {console.log('Listening to port 3000')})