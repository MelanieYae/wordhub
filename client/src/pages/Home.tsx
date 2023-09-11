import { useEffect, useState } from "react";
import { api } from "../utils/api";
import Post from "../components/Post";
import LoadingSpinner from '../components/Loading'

export async function homeLoader() {

  return new Promise((resolve) =>
    setTimeout(() => resolve({ hello: "world" }), 3000)
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    async function loadPosts() {
      const res = await api.get("/public/posts");
      setPosts(res.data);
      setTimeout(() => {
        setLoading(false)
      }, 1000)
      
    }
    loadPosts();
  }, []);

  return (
    <div className="mt-20 m-auto w-[95vw] md:w-[600px] flex flex-col items-center gap-14">
      {posts.map((post: any) => (
        <Post key={post.id} post={post} url={`post/${post.id}`} />
      ))}
      {posts.length === 0 && <span className="text-2xl">No posts</span>}
      {loading && <LoadingSpinner />}
    </div>
  );
}
