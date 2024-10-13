export function prepareWorks (category) {
    fetch("http://localhost:5678/api/works")
        .then(r => r.json())
        .then(x => {       
            const gallery = document.querySelector('.gallery')
            gallery.innerHTML = ''

            for (const work of x) {
                const figure = document.createElement('figure')
                figure.dataset.figureId = work.id
                
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

export function displayWorksByCategory() {
    fetch("http://localhost:5678/api/categories")
        .then(r => r.json())
        .then(x => {
            const categories = document.querySelector('.categories')
            categories.innerHTML= ""

            const buttonAll = document.createElement('button')
            buttonAll.textContent = "Tous"
            buttonAll.dataset.name = "all"
            categories.append(buttonAll)

            x.forEach(x => {
                const button = document.createElement('button')
                button.textContent = x.name
                button.dataset.name = x.name
                
                categories.append(button)
            })

            const buttons = document.querySelectorAll('.categories button')
            for (const b of buttons) listenButtonClick(b, buttons)
            buttonAll.click()
        })
        .catch(() => {
            const portfolio = document.getElementById('portfolio')
            portfolio.innerHTML = '<p style="text-align: center; color: red">Erreur lors du chargement de la gallerie...Veuillez réessayer ultérieurement</p>'
        })

        function listenButtonClick (buttonclicked, buttons) {
            buttonclicked.addEventListener('click', (e) => {
                buttons.forEach (b=> b.classList.remove('buttonActive'))
                e.target.classList.add('buttonActive')
                prepareWorks(e.target.dataset.name)
                })
        }
}

displayWorksByCategory()