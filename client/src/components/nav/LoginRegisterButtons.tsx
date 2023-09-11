import { useNavigate } from "react-router-dom"

export default function LoginRegisterButtons() {
    const navigate = useNavigate()
    return (
        <div className="ml-auto mr-5 md:mr-12 flex flex-row gap-3">
        <button
          onClick={() => navigate("register")}
          type="button"
          className="text-sm lg:text-lg text-white  bg-green-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-full  px-3 lg:px-5 py-2 md:py-2.5 text-center lg:mr-2 mb-1 lg:mb-2 "
        >
          Sign Up
        </button>
        <button className="mb-2 text-sm lg:text-lg" onClick={() => navigate("login")}>
          Sign In
        </button>
      </div>
    )
}