import LoadingSpinner from "../components/Loading";
import Post from "../components/Post";
import { api } from "../utils/api";
import { useState } from "react";
export default function Search() {
  const [posts, setPosts] = useState([]);
  const [value, setValue] = useState("");
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onInputChange(event: any) {
    setValue(event.target.value);
  }

  async function onSearch() {
    setLoading(true)
    setNotFound(false) // reset
    const res = await api.get(`/public/search?q=${value}`);
    setPosts(res.data);
    setNotFound(res.data.length === 0)
    setLoading(false)
  }

  return (
    <div>
      <div className="w-[90vw] lg:w-[500px] m-auto mt-8">
        <label
          htmlFor="search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            onChange={onInputChange}
            type="search"
            id="search"
            className="block w-full p-4 pl-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500 text-2xl"
            placeholder="Title or author"
            required
          />
          <button
            onClick={onSearch}
            type="submit"
            className="text-white absolute right-2.5 bottom-3 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-black-300 font-medium rounded-lg text-sm px-4 py-2   "
          >
            Search
          </button>
        </div>
      </div>
      <div className="mt-20 m-auto w-[90vw] lg:w-[600px] flex flex-col items-center gap-14">
        {posts.map((post: any) => (
          <Post key={post.id} post={post} url={`/post/${post.id}`} />
        ))}
        {notFound && <p className="text-xl">No posts found</p>}
      </div>
      {loading && <LoadingSpinner />}
    </div>
  );
}
