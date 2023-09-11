import { useEffect, useState } from "react"
import { api } from "../utils/api"
import Post from "../components/Post"
import LoadingSpinner from "../components/Loading"


export default function MyPosts() {
  const [posts, setPosts] = useState<any>([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    async function loadPosts() {
      const res = await api.get('/user/my_posts')
      setPosts(res.data)
      setLoading(false)

    }
    loadPosts()
  }, [])

  return (
    <div className="mt-20 m-auto w-[95vw] md:w-[600px] flex flex-col items-center gap-14">
      {posts?.map((post: any) => (
        <Post key={post.id} post={post} url={`/post/${post.id}`} />
      ))}
      {posts.length === 0 && (
        <>
        <span className="text-2xl">No posts</span>
        </>
      )}
      {loading && <LoadingSpinner />}
    </div>
  )
}