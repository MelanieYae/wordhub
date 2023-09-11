import { useEffect, useState } from "react"
import { api } from "../utils/api"
import Editor from "./editor/Editor"
import { formatDate } from "../utils/date"

// The post view itself with editor
export default function PostView({ postId }: { postId: string }) {
    const [post, setPost] = useState<any>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadPost() {
            const res = await api.get(`/public/post?id=${postId}`)
            setPost(res.data)
            setLoading(false)
        }
        loadPost()
    }, [])
    return (
        <>
            {!loading && (
                <>
                    {/* <img className="w-full h-[350px] rounded-xl mb-12" src={post?.imageUrl} /> */}
                    
                    <div className="w-full mb-5 flex flex-row">
                        <img className="rounded-full w-[60px] h-[60px] object-cover" src={post.user.imageUrl} />
                        <div className="flex flex-col">
                            <span className="ml-5 text-2xl pt-1 font-light">{post.user.username}</span>
                            <span className="ml-5 lg:text-xl pt-1 font-thin">{formatDate(post.createdAt)}</span>
                        </div>

                    </div>
                    <span className="text-6xl editor-title">{post?.title}</span>
                    <div className="w-full h-[1px] bg-gray-500/30 mt-4 mb-8 rounded-lg" />
                    <Editor options={{ editable: false, content: post?.content }} />
                </>
            )}
        </>
    )
}