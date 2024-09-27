function openModal() {
    const modify = document.querySelector('.modify')
    modify.addEventListener('click', () => {
        const modal = document.querySelector('.modal')
        modal.classList.add('revealModal')
    
        const overlay = document.querySelector('.overlay')
        overlay.classList.add('revealForBlock')

        displayModalContent(1)
    })
}

openModal()

function closeModal() {
    const xmark = document.querySelector('.modal .fa-xmark')
    xmark.addEventListener('click', () => {
        const modal = document.querySelector('.modal')
        modal.classList.remove('revealModal')
    
        const overlay = document.querySelector('.overlay')
        overlay.classList.remove('revealForBlock')
    })
}

closeModal()

function displayModal1() {
    const leftArrow = document.querySelector('.modal .fa-arrow-left')
    leftArrow.classList.remove('revealForBlock')
    fetch("http://localhost:5678/api/works")
                .then(r => r.json())
                .then(x => {
                    const modalGallery = document.createElement('div')
                    modalGallery.classList.add('modalGallery')
                    
                    for (const work of x) {
                        const img = document.createElement('img')
                        img.src = work.imageUrl
                        img.classList.add('modalGalleryImgs')

                        modalGallery.append(img)
                    }
                    document.querySelector('.modalBody').innerHTML = ""
                    document.querySelector('.modalBody').append(modalGallery)
                })
}

function displayModal2() {
    // retour en arriere 
    const leftArrow = document.querySelector('.modal .fa-arrow-left')
    leftArrow.classList.add('revealForBlock')
    leftArrow.addEventListener('click', () => {
            displayModalContent(1)
        })
    // creation 
    const modalBody = document.querySelector('.modalBody')
    modalBody.innerHTML = `
    <div class="uploadImgGlobalContainer">
        <div class=uploadImg>
            <i class="fa-regular fa-image"></i>
            <label name="img" for="img">+ Ajouter photo</label>
            <input type="file" id="img" accept="image/*" style="display:none"></input>
            <p>jpg, png : 4mo max</p>
        </div>
        <div class="titleAndCategory">
            <label for="title">Titre</label>
            <input type="text" id="title"></input>

            <label for="category">Catégorie</label>
            <select name="category" id="category">
                <option value="" disabled selected></option> 
            </select>
        </div>
    </div>
    `
    createCategoryList()
    listenInputImg()
}

function createCategoryList() {
    fetch("http://localhost:5678/api/categories")
        .then(r => r.json())
        .then(x => {
            const category = document.getElementById('category')
            for (const c of x) {
                const option = document.createElement('option')
                option.value = c.name
                option.textContent = c.name
                category.append(option)
            }
        })
}

const modalArray = [
    {
        id: 1,    
        title: "Galerie photo",
        body: displayModal1,
        btnValue: "Ajouter une photo"
    },
    {
        id: 2,
        title: "Ajout photo",
        body: displayModal2,
        btnValue: "Valider"
    }
]

function displayModalContent (id) {
    const modalX = modalArray.find(modal => modal.id === id)
    if (modalX) {
        const modalHeader = document.querySelector('.modalHeader')
        modalHeader.textContent = modalX.title
        
        const modalBody = document.querySelector('.modalBody')
        modalBody.innerHTML = ""
        modalX.body()
        
        const modalFooter = document.querySelector('.modalFooter')
        const button = document.createElement('button')
        button.textContent = modalX.btnValue
        modalFooter.innerHTML = ""
        modalFooter.append(button)
        if (id === 2) {
            button.disabled = true
            button.classList.add('modalButtonDisabled')
        }
        button.addEventListener('click', () => {
            displayModalContent(2)
        })
    }
}

function listenInputImg() {
    const uploadImg = document.querySelector('.uploadImg #img')
    uploadImg.addEventListener('change', (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = e => {
            const imgLoaded = document.createElement('img')
            imgLoaded.src = e.target.result
            if (imgLoaded.src.length > 0) {
                document.querySelector('.uploadImg').innerHTML = ""
                document.querySelector('.uploadImg').append(imgLoaded) 
            }
        }
    })
}