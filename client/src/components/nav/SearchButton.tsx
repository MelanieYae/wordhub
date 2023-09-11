import { useNavigate } from "react-router-dom"

export default function SearchButton() {
    const navigate = useNavigate()
    return (
        <div
        className="flex flex-row items-center sm:text-sm md:text-2xl gap-2 mr-8 font-normal text-white hover:font-bold cursor-pointer ml-3  bg-green-500 p-2 rounded-full shadow-xl"
        onClick={() => navigate("search")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-5 w-5 md:w-7 md:h-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
    )
}