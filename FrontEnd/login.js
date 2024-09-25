function sendRequestUser () {
    const email = document.getElementById('email')
    const password = document.getElementById('password')

    const loginInputs = {
        method: "POST", 
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            email: email.value,
            password : password.value
        })
    }
    
    fetch("http://localhost:5678/api/users/login", loginInputs)
        .then(r => {
            resCheck(r)
            if (r.status === 200) return r.json()
            else return null
        })
        .then(x => {
            if (x !== null) {
            document.cookie = `acces = ${x.token}`
            window.location.href = "index.html"
            }
        }) 
}

function resCheck (x) {
    if (x.status === 401 || x.status === 404) {
        const errorDisplay = document.createElement('p')
        errorDisplay.textContent = "Erreur dans l’identifiant ou le mot de passe"
        errorDisplay.classList.add('loginErrorMsg')
        console.log(errorDisplay);
        
        const loginFormContainer = document.querySelector('.loginFormContainer')
        const p = document.querySelector('.loginErrorMsg')
        if (p) p.remove() 
        loginFormContainer.append(errorDisplay)
    } else if (x.status === 200) {
        const p = document.querySelector('.loginErrorMsg')
        if (p) p.remove() 
    }
}

document.getElementById('logSubmit').addEventListener('submit', (e) => {
    e.preventDefault()
    sendRequestUser()
})






