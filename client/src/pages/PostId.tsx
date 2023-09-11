import { useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { api } from "../utils/api"
import Editor from "../components/editor/Editor"
import { useNavigate } from 'react-router-dom'
import { formatDate } from "../utils/date"
import PostMenu from "./PostMenu"
import { UserContext } from "../providers/UserProvider"
import LoadingSpinner from "../components/Loading"
import PostComments from "../components/PostComments"


export default function MyPostId() {
    const params = useParams()
    const { postId } = params

    const [post, setPost] = useState<any>()
    const [loading, setLoading] = useState(true)
    const [commentsVisible, setCommentsVisible] = useState(false)
    const openCommentsRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()
    const { user } = useContext(UserContext)

    useEffect(() => {
        async function loadPost() {
            const res = await api.get(`/public/post?id=${postId}`)
            setPost(res.data)
            setLoading(false)
        }
        loadPost()
    }, [])

    async function onDelete() {
        setLoading(true)
        let aaa=await api.delete(`/user/delete_post?id=${postId}`)
        console.log(aaa);
        
        setLoading(false)
        navigate('/my-posts')
    }

    return (
        <div className="m-auto w-[92vw] lg:w-[700px] pt-12">
            {loading && <LoadingSpinner />}
            {!loading && (
                <>
                    {/* <img className="w-full h-[350px] rounded-xl mb-12" src={post?.imageUrl} /> */}

                    <div className="w-full mb-5 flex flex-row relative z-10">
                        <img className="rounded-full w-[60px] h-[60px] object-cover" src={post.user.imageUrl} />
                        <div className="flex flex-col">
                            <span className="ml-5 text-2xl pt-1 font-light">{post.user.username}</span>
                            <span className="ml-5 sm:text-sm lg:text-xl pt-1 font-thin">{formatDate(post.createdAt)}</span>
                        </div>
                        <div className="ml-auto mr-1 mt-1 flex items-center cursor-pointer gap-3">
                            <div ref={openCommentsRef} onClick={() => setCommentsVisible(!commentsVisible)} className="flex items-center gap-1 text-2xl font-light">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-8 h-8 lg:w-10 lg:h-10 stroke-slate-500 cursor-pointer fill-transparent">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                                </svg>
                                <span>{post.commentsCount}</span>
                            </div>

                            {user?.username === post.user.username && <PostMenu onDelete={onDelete} postId={postId as string} />}
                        </div>

                    </div>
                    <span className="text-6xl editor-title">{post?.title}</span>
                    <div className="w-full h-[1px] bg-gray-500/30 mt-4 mb-2 rounded-lg" />
                    <Editor options={{ editable: false, content: post?.content }} />
                    <PostComments openButtonRef={openCommentsRef} visible={commentsVisible} setVisible={setCommentsVisible} postId={post?.id} />
                </>
            )}
        </div>
    )
}