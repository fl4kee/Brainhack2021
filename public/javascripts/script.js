const searchForm = document.querySelector('#searchForm')
const searchFormHome = document.querySelector('#searchFormHome')
let ul = document.querySelector('#list-of-petplaces')

let state = {
    'page': 1,
    'rows': 8,
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

searchForm.addEventListener('submit', async (e) => {
    
    state.page = 1
    state.rows = 8
    try{
        e.preventDefault()
        const url = location.protocol + '//' + location.host + '/petplaces/api/filter'
        const city = capitalize(searchForm.elements.location.value.replace(/\s+/g, ''))
        const category = searchForm.elements.category.value  
        result = await axios.post(url, {
            location: city,
            category: category
          }, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        let petplaces = result.data
        showElements(petplaces)
    }

    catch(e){
        alert('Нет зоонянь в этом городе')
    }
})

const pagination = (result, page, elements) => {
    
    let trimStart = (page - 1) * elements
    let trimEnd = trimStart + elements
    let trimmedData = result.slice(trimStart, trimEnd)
    let pages = Math.ceil(result.length / elements)
    return {
        "querySet": trimmedData,
        "pages": pages
    }
}


const pageButtons = (pages, data) => {
    const wrapper = document.querySelector('#pagination-wrapper')
    wrapper.innerHTML = ""

    for (let page = 1; page <= pages; page++) {
        wrapper.innerHTML += `<a href="#mainHeader"><button value=${page} class="page-link">${page}</button></a>`
    }

    const page = document.querySelectorAll('.page-link')
    for(let button of page){
        button.addEventListener('click', () => {
            state.page = button.value
            showElements(data)
        })
    }
}

const showElements = (data) => {
    let result = pagination(data, state.page, state.rows)
    if (result.querySet.length == 0) {
        alert("Нет подходящих зоонянь")
    } else {
        ul.innerHTML = ""
        for (let el of result.querySet) {
            let newEntry = document.createElement('li')
            newEntry.classList.add('card', 'mb-3')
            let div_row = document.createElement('div')
            div_row.classList.add('row')
            div_img = document.createElement('div')
            div_img.classList.add('col-md-4')
            div_img.innerHTML = `<img class="img-fluid" src="${el.images[0].url}" />`
            div_details = document.createElement('div')
            div_details.classList.add('col-md-8')
            div_card_body = document.createElement('div')
            div_card_body.classList.add('card-body')
            div_card_body.innerHTML = `<h5 class="card-title">${el.title}</h5>
                                       <p class="card-text">${el.description}</p>
                                       <p class="card-text">Категория: ${el.category}</p>
                                       <p class="card-text">
                                           <small class="text-muted">${el.location}</small>
                                       </p>
                                       <a class="btn btn-primary" href="/petplaces/${el._id}">Подробнее </a>`
            div_details.appendChild(div_card_body)
            div_row.appendChild(div_img)
            div_row.appendChild(div_details)
            newEntry.appendChild(div_row)
            ul.appendChild(newEntry)
        }
        pageButtons(result.pages, data)
    }
}

const createInitialPage = async () => {
    const url = location.protocol + '//' + location.host + '/petplaces/api/filter'
    const result = await axios.get(url)
    let petplaces = result.data
    showElements(petplaces)
}

createInitialPage()



// <div class="card mb-3">
// 		<div class="row">
// 			<div class="col-md-4">
// 				<img class="img-fluid" src="<%= petplace.images[0].url %>" />
// 			</div>
// 			<div class="col-md-8">
// 				<div class="card-body">
// 					<h5 class="card-title"><%= petplace.title %></h5>
// 					<p class="card-text"><%= petplace.description %></p>
// 					<p class="card-text">
// 						<small class="text-muted"><%= petplace.location %> </small>
// 					</p>
// 					<a class="btn btn-primary" href="/petplaces/<%= petplace._id %>">Подробнее </a>
// 				</div>
// 			</div>
// 		</div>
// 	</div>