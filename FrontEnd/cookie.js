export function getCookie(name) {
    const cookie = document.cookie.split('; ')
    const value = cookie
        .find(c => c.startsWith(name))
        if (value) return "pass"
        else return null
}

export let token = null
export function getToken() {
    const cookie = document.cookie.split('; ')
    const value = cookie
        .find(c => c.startsWith('acces'))
    token = value.split('=')[1]
    return token
}