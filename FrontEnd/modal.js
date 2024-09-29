import { token, getToken, getCookie } from './cookie.js'
import { displayWorksByCategory } from './index.js'

function openModal() {
    if (getCookie("acces") === "pass") {
        document.querySelector('.modify').addEventListener('click', (e) => {
            document.querySelector('dialog').showModal()
            displayModalContent(1)
    })
    }
}

function closeModal() {
    document.querySelector('dialog .fa-xmark')
        .addEventListener('click', () => document.querySelector('dialog').close())
    
    const dialog = document.querySelector('dialog')
    dialog.addEventListener('click', (e) => {
        if (dialog === e.target) dialog.close()
    })
} 

function addDeleteIcon(elsContainer, work) {
    const deleteIcon = document.createElement('i')
    deleteIcon.classList.add('fa-solid', 'fa-trash-can')
    deleteIcon.id = work.id
    elsContainer.append(deleteIcon)
}

function listenClickToDeleteWork(deleteIcon, elsContainer) {
    deleteIcon.addEventListener('click', (e) => {
        getToken()
        const toDelete = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
        fetch(`http://localhost:5678/api/works/${e.target.id}`, toDelete)
        elsContainer.remove()
        displayWorksByCategory()
    })
}

function displayModal1() {
    document.querySelector('dialog .fa-arrow-left').classList.remove('revealForBlock')
    fetch("http://localhost:5678/api/works")
                .then(r => r.json())
                .then(x => {
                    const modalGallery = document.createElement('div')
                    modalGallery.classList.add('modalGallery')
                    
                    for (const work of x) {
                        const elsContainer = document.createElement('div')
                        elsContainer.classList.add('elsContainer')
                        const img = document.createElement('img')
                        img.src = work.imageUrl
                        img.classList.add('modalGalleryImgs')
                        elsContainer.append(img)
                        addDeleteIcon(elsContainer, work)
                        modalGallery.append(elsContainer)
                        const deleteIcon = elsContainer.querySelector('.fa-trash-can')
                        listenClickToDeleteWork(deleteIcon, elsContainer)
                    }
                    document.querySelector('.modalBody').innerHTML = ""
                    document.querySelector('.modalBody').append(modalGallery)
                })
                
}

function displayModal2() {
    // retour en arriere 
    const leftArrow = document.querySelector('dialog .fa-arrow-left')
    leftArrow.classList.add('revealForBlock')
    leftArrow.addEventListener('click', () => {
            displayModalContent(1)
        })
    // creation 
    const modalBody = document.querySelector('.modalBody')
    modalBody.innerHTML = `
    <form class="uploadImgGlobalContainer">
        <div class=uploadImg>
            <i class="fa-regular fa-image"></i>
            <label name="img" for="img">+ Ajouter photo</label>
            <input type="file" id="img" name="img" accept="image/*" style="display:none"></input>
            <p>jpg, png : 4mo max</p>
        </div>
        <div class="titleAndCategory">
            <label for="title">Titre</label>
            <input type="text" id="title" name="title"></input>

            <label for="category">Catégorie</label>
            <select name="category" id="category">
                <option value="" disabled selected></option> 
            </select>
        </div>
    </form>
    `
    createCategoryList()
    enableButton()
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
                option.id = c.id
                option.textContent = c.name
                category.append(option)
            }
        })
}


function displayModalContent (id) {
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
        if (id === 2 ) {
            button.disabled = true
            button.classList.add('modalButtonDisabled')
            button.addEventListener('click', async () => await SendFormValuesOnButtonClick())
        }
        if (id === 1) {
            button.addEventListener('click', () => {
                displayModalContent(2)
            })
        }
    }
}

function listenInputImg() {
    const uploadImg = document.querySelector('.uploadImg #img')
    uploadImg.addEventListener('change', (e) => {
        const file = e.target.files[0]
        const maxFileSize = 4 * 1024 * 1024
        if (file && file.size <=  maxFileSize) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = (e) => {
                    const imgLoaded = document.createElement('img')
                    imgLoaded.src = e.target.result
                    console.log(imgLoaded);
                    
                    if (imgLoaded.src.length > 0) {
                        document.querySelectorAll('.uploadImg *').forEach(el => el.style.display = "none")
                        document.querySelector('.uploadImg').append(imgLoaded)
                    }
                }
            }
        } else document.querySelector('.uploadImg p').style.color = "red"
    })
}

function enableButton() {
    const title = document.querySelector('.titleAndCategory input')
    const select = document.querySelector('.titleAndCategory select')
    const inputFile = document.querySelector('.uploadImg input')

    inputFile.addEventListener('change', (e) => checkInputs(title, select, e.target.files[0]))
    title.addEventListener('input', () => checkInputs(title, select))
    select.addEventListener('change', () => checkInputs(title, select))
}

function checkInputs(title, select, img) {
    console.log(img);
    
    
    const imgLd = document.querySelector('.uploadImg img')
    const button = document.querySelector('.modalFooter button')
    if (((imgLd && imgLd.src.length > 0) || img) && title.value.length > 0 && title.value.match(/^[a-zA-Z0-9_."-]*$/) && select.value.length > 0) {
        button.disabled = false
        button.classList.remove('modalButtonDisabled')
    } else {
        button.disabled = true
        button.classList.add('modalButtonDisabled')
    }
}

async function SendFormValuesOnButtonClick () {
    const button = document.querySelector('.modalFooter button')
    const title = document.querySelector('.titleAndCategory input')
    const select = document.querySelector('.titleAndCategory select')
    const categoryId = select.options[select.selectedIndex].id
    const imgInput = document.querySelector('.uploadImg input')
    const formData = new FormData()
    
    formData.append('title', title.value)
    formData.append('image', imgInput.files[0])
    formData.append('category', categoryId)
    
    getToken()
    const toPostNewWork = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData 
    }

    fetch("http://localhost:5678/api/works", toPostNewWork)
        .then(r => {
            if (r.status === 201) {
                button.disabled = true
                document.querySelector('dialog').close()
                displayWorksByCategory()
            }
        })
}

openModal()
closeModal()