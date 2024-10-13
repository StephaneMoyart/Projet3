export function getToken() {
    const cookies = document.cookie.split('; ')
    const value = cookies
        .find(c => c.startsWith("acces"))
    if(value) return value.split('=')[1]
}

export function hasToken() {
    return !!getToken()
}