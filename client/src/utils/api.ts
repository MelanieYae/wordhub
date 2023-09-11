import axios from 'axios'

// prevent axios from throwing error if status code is not 200
// set base url to api url (port 3000)
export const api = axios.create({baseURL: 'http://localhost:3000', validateStatus: () => true})
const localSession = localStorage.getItem('session')
api.defaults.headers.common['Authorization'] = `Bearer ${localSession}`

export function setSessionId(session: string) {
    localStorage.setItem('session', session)
    api.defaults.headers.common['Authorization'] = `Bearer ${session}`
}

export async function uploadImage(file: File) {
    const data = new FormData()
    data.append('image', file)
    const res = await api.post('/public/upload_image', data)
    return res.data.url as string
}
