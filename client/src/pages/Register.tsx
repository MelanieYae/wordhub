
import { api, setSessionId } from "../utils/api";
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from "../providers/UserProvider";
import LoadingSpinner from "../components/Loading";

export default function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState('')
    const navigate = useNavigate()
    const {setUser} = useContext(UserContext)

    async function onRegister() {
        setLoading(true)
        const res = await api.post('/auth/register', { username, password })
        setLoading(false)
        if (res.status !== 200) {
            setErr(res.data.error)
            return
        }
        setUser({ username: res.data.user.username, imageUrl: res.data.user.imageUrl });
        setSessionId(res.data.session)
        navigate("/");
    }
    return (
        <div className="mt-16 m-auto w-[300px] flex flex-col gap-5">
            <span className="text-center text-5xl font-light mb-12">Sign Up</span>
            <div>
                <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 ">Username</label>
                <input onChange={e => setUsername(e.target.value)} type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  " placeholder="" required />
            </div>
            <div>
                <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                <input onChange={e => setPassword(e.target.value)} type="password" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  " required />
            </div>
            {err && <p className="text-red-400">{err}</p>}
            <button onClick={onRegister} type="button" className="mt-5 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                REGISTER
            </button>
            <div className="flex flex-col">
                <p className="text-center">Already have account?</p>
                <Link className="text-center text-green-800" to='/login'>sign in</Link>
            </div>
            {loading && <LoadingSpinner />}
        </div>
    )
}