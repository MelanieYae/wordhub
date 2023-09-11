import { ReactNode, useContext, useEffect } from "react"
import { UserContext } from "../providers/UserProvider"
import { api } from "../utils/api"

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { logOut } = useContext(UserContext)

    useEffect(() => {
        async function checkAuth() {
            const res = await api.get('/auth/check')
            if (res.status !== 200) {
                logOut()
            }
        }
        checkAuth()
    }, [])

    return (
        <>
            {children}
        </>
    )
}