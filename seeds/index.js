if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}

const mongoose = require('mongoose');
const cities = require('./cities')
const {colors, animals} = require('./helpers')
const Petplace = require('../models/petplace');
const axios = require('axios')
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
    urls_list = []
    categories_list = ['Зооняня', 'Садик для животных', 'Грумер', 'Передержка', 'Кинолог']
    for(let i = 0; i < 60; i++){
        result = await axios({
        method: 'get',
        url: 'https://loremflickr.com/320/240'
        })
        urls_list.push(result.request._redirectable._currentUrl)
    }
    for(let i = 0; i < 30; i++){
        const random10 = Math.floor(Math.random() * 10)
        const price = Math.floor(Math.random() * 10000) + 500
        image_index = 0
        const camp = new Petplace({
            author: '616148e0106bc6b9af40d472',
            location: `${cities[random10].name}, ${cities[random10].subject}`,
            title: `${sample(colors)} ${sample(animals)}`,
            category: categories_list[Math.floor(Math.random() * 5)],
            phone: `+7-${Math.floor(Math.random() * 999)}-${Math.floor(Math.random() * 999)}-${Math.floor(Math.random() * 8999) + 1000}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero eius, illo tempore inventore adipisci repudiandae, nesciunt accusamus iste quam voluptatem atque officia dolorem dignissimos consequuntur sequi numquam delectus. Velit, natus! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero eius, illo tempore inventore adipisci repudiandae, nesciunt accusamus iste quam voluptatem atque officia dolorem dignissimos consequuntur sequi numquam delectus. Velit, natus!',
            price,
            images: [
                {
                    url: urls_list[Math.floor(Math.random()*20)],
                    filename: `PetPlaces/${urls_list[Math.floor(Math.random()*20)]}`.split('.')[-2]
                  },
                {
                    url: urls_list[Math.floor(Math.random()*20)],
                    filename: `PetPlaces/${urls_list[Math.floor(Math.random()*20)]}`.split('.')[-2]
                  }

            ]
        })
        image_index += 2
        await camp.save()
    }
}

seedDB().then(() =>{
    mongoose.connection.close()
})
