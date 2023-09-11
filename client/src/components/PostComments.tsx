import { useState, useEffect, SetStateAction, useRef, useContext } from 'react'
import { api } from '../utils/api'
import { formatDate } from '../utils/date'
import { UserContext } from '../providers/UserProvider'
import { Link } from 'react-router-dom'

interface PostCommentsProps {
    postId: string
    visible: boolean,
    setVisible: React.Dispatch<SetStateAction<boolean>>
    openButtonRef: React.RefObject<HTMLDivElement>
}

export default function PostComments({ postId, visible, setVisible, openButtonRef }: PostCommentsProps) {

    const [comments, setComments] = useState<Array<any>>([])
    const ref = useRef<HTMLDivElement>(null)
    const [content, setContent] = useState('')
    const [publishLoading, setPublishLoading] = useState(false)
    const { user } = useContext(UserContext)

    async function loadComments() {
        const res = await api.get(`/public/comments?postId=${postId}`)
        setComments(res.data)
        // setComments([1, 2, 3, 4, 5, 6, 7, 7])
    }

    useEffect(() => {
        loadComments()
    }, [])

    console.log(comments)

    function onClickOutSide(event: any) {
        if (!ref?.current?.contains(event.target) && !openButtonRef?.current?.contains(event.target)) {
            setVisible(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", onClickOutSide);
        return () => document.removeEventListener("mousedown", onClickOutSide);
    }, []);



    async function publish() {
        setPublishLoading(true)
        setContent('')
        const res = await api.post('/user/createComment', { content, postId })
        loadComments()
        setPublishLoading(false)
    }


    async function deleteComment(id: string) {
        setComments(comments.filter(c => c.id !== id))
        await api.post('/user/deleteComment', { id })

    }

    return (
        <div ref={ref} className={`fixed transition ease-in-out delay-100 ${visible ? 'sm:translate-y-0 lg:translate-x-0 lg:translate-y-0' : 'lg:translate-x-[100%] lg:translate-y-0 translate-y-[100%]'} h-[92vh] overflow-auto right-0 top-[115px] lg:top-[75px] lg:w-[500px] lg:rounded-none rounded-t-3xl rounded-tr-3xl border border-slate-300 sm:w-full w-full bg-white shadow-2xl z-10 pl-5 pr-5 lg:border-none`}>
            <div className='flex justify-between pt-10 pb-5'>
                <span className='text-lg lg:text-2xl'>Comments ({comments.length})</span>

                <svg onClick={() => setVisible(false)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 stroke-slate-500 cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            {user ?
                <div className='shadow-md rounded-lg flex flex-col'>
                    <textarea minLength={5} maxLength={80} value={content} onChange={e => setContent(e.target.value)} placeholder={`What's are your toughts?`} className='overflow-visible mt-5 h-[150px] w-full resize-none p-5 outline-none text-xl lg:text-1xl' />
                    <button
                        onClick={publish}
                        type="button"
                        className="flex items-center justify-center mr-3 mb-3 self-end mt-5 w-[100px] text-white bg-green-600 font-bold text-sm hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 rounded-full py-2"
                    >
                        {publishLoading ? (
                            <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                            </svg>
                        ) : <span>Publish now</span>}
                    </button>
                </div>
                : <div className='pt-5 w-full text-center'>Please <Link to='/login' className='text-green-500 cursor-pointer font-bold'>Login</Link> to comment</div>
            }


            <div className='divide-y flex flex-col p-5'>
                {comments.map(comment => (

                    <div className='pt-5 pb-5'>
                        <div className="w-full flex flex-row relative z-10 pt-8 pb-10 items-center relative">
                            {user?.username === comment.user.username && (
                                <div onClick={() => deleteComment(comment.id)} className='absolute right-0 cursor-pointer'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            )}

                            <img className="rounded-full w-[40px] h-[40px] object-cover" src={comment.user.imageUrl} />
                            <div className="flex flex-col">
                                <span className="ml-5 lg:text-1xl text-lg pt-1 font-light">{comment.user.username}</span>
                                <span className="ml-5 lg:text-sm text-sm pt-1 font-thin">{formatDate(comment.createdAt)}</span>
                            </div>
                        </div>
                        <p>{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}