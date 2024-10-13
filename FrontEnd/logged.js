import { hasToken } from './cookie.js'

function inCaseLoggedForLogoutDisplay () {  
    if (hasToken()) {
        const logout = document.querySelector('nav ul li:nth-of-type(3)')
        logout.innerHTML = `<a href="index.html">logout</a>`
        
        logout.addEventListener('click', () => {
            document.cookie = "acces=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/FrontEnd" 
            location.reload()
        })
    }    
}

function inCaseLoggedForEditHeader () {
    if (hasToken()) {
        const editHeader = document.createElement('div')
        editHeader.classList.add('editHeader')

        const editHeaderText = document.createElement('p')
        editHeaderText.innerHTML = "<p><i class='fa-regular fa-pen-to-square'></i>mode édition</p>"

        editHeader.append(editHeaderText)
        document.querySelector('html').prepend(editHeader)
    }
}

function inCaseLoggedForEditMain() {
    if (hasToken()) {
        const modify = document.createElement('span')
        modify.innerHTML = "<i class='fa-regular fa-pen-to-square'></i>modifier"
        modify.classList.add('modify')

        const portfolio = document.querySelector('#portfolio h2')
        portfolio.append(modify)
    }
}

inCaseLoggedForLogoutDisplay()
inCaseLoggedForEditHeader()
inCaseLoggedForEditMain()