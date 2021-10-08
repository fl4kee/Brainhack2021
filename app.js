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
const flash = require('connect-flash')
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError')


const dbUrl = process.env.DB_URL
const secret = process.env.SECRET

mongoose.connect(dbUrl, {
    // options to turn off deprecation warnings
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {console.log('connection is open')})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())


app.use(flash())

app.use('/petplaces', petplaceRoutes)

app.get('/', (req, res) => {
    res.render('home')
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { error: err })

})

const port = process.env.PORT || 3000
app.listen(port, () => {console.log('Listening to port 3000')})