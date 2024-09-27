// import { inCaseLoggedForEditMain } from "./logged.js"

function displayWorks (category) {
    fetch("http://localhost:5678/api/works")
        .then(r => r.json())
        .then(x => {       
            const gallery = document.querySelector('.gallery')
            gallery.innerHTML = ''

            for (const work of x) {
                const figure = document.createElement('figure')
                
                const img = document.createElement('img')
                img.src = work.imageUrl

                const figCaption = document.createElement('figcaption')
                figCaption.textContent = work.title

                figure.append(img, figCaption)
                if (category === work.category.name) gallery.append(figure)
                else if (category === "all") gallery.append(figure)
            }
        })
}

fetch("http://localhost:5678/api/categories")
    .then(r => r.json())
    .then(x => {
        const categories = document.querySelector('.categories')

        const buttonAll = document.createElement('button')
        buttonAll.textContent = "Tous"
        buttonAll.dataset.name = "all"
        categories.append(buttonAll)

        const categoriesArray = []
        for (const c of x) {
            categoriesArray.push(c)
        }
        for (const c of categoriesArray) {
            const button = document.createElement('button')
            button.textContent = c.name
            button.dataset.name = c.name
            console.log(button.dataset.name);
            
            categories.append(button)
        }
        const buttons = document.querySelectorAll('.categories button')
        for (const b of buttons) {
            listenButtonClick(b, buttons)
        }
       buttonAll.click()
    })

    function listenButtonClick (buttonclicked, buttons) {
        buttonclicked.addEventListener('click', (e) => {
            buttons.forEach (b=> b.classList.remove('buttonActive'))
            e.target.classList.add('buttonActive')
            displayWorks(e.target.dataset.name)
            })
    }