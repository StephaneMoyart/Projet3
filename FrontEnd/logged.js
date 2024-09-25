function getCookie(name) {
    const cookie = document.cookie.split('; ')
    const value = cookie
        .find(c => c.startsWith(name))
        if (value) return "pass"
        else return null
}

function inCaseLogged () {
    if (getCookie("acces") === "pass") {
        const mainContainer = document.querySelector('.mainContainer')
        mainContainer.remove()
        const newContainer = document.createElement('button')
        newContainer.textContent = "Deconnexion"
        const main = document.querySelector('main')
        main.append(newContainer)

        newContainer.addEventListener('click', () => {
            document.cookie = "acces=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/FrontEnd" 
            location.reload()
        })
    }    
}

inCaseLogged()
