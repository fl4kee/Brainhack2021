if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}

const mongoose = require('mongoose');
const cities = require('./cities')
const {colors, animals} = require('./helpers')
const Petplace = require('../models/petplace');
const dbUrl = process.env.DB_URL

// Establishing connection
mongoose.connect(dbUrl, {
    // options to turn off deprecation warnings
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {console.log('connection is open')})


const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async() => {
    await Petplace.deleteMany({})
    for(let i = 0; i < 50; i++){
        const random10 = Math.floor(Math.random() * 10)
        const price = Math.floor(Math.random() * 10000) + 500
        
        const camp = new Petplace({
            location: `${cities[random10].name}, ${cities[random10].subject}`,
            phone: `+7-${Math.floor(Math.random() * 999)}-${Math.floor(Math.random() * 999)}-${Math.floor(Math.random() * 8999) + 1000}`,
            title: `${sample(colors)} ${sample(animals)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero eius, illo tempore inventore adipisci repudiandae, nesciunt accusamus iste quam voluptatem atque officia dolorem dignissimos consequuntur sequi numquam delectus. Velit, natus! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero eius, illo tempore inventore adipisci repudiandae, nesciunt accusamus iste quam voluptatem atque officia dolorem dignissimos consequuntur sequi numquam delectus. Velit, natus!',
            price
        })
        await camp.save()
    }
}

seedDB().then(() =>{
    mongoose.connection.close()
})
