import { useEffect, useRef, useState } from "react";
import { api } from "../utils/api";
import Editor from "../components/editor/Editor";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../components/nav/Nav";
import NavDropdown from "../components/nav/NavDropdown";
import { UserProvider } from "../providers/UserProvider";
import LoadingSpinner from "../components/Loading";

export default function Edit() {
    const params = useParams()
    const { postId } = params
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const editorRef = useRef<any>()

    async function onUpdate() {
        setLoading(true)
        const empty = !editorRef.current?.getJSON().content[0]
        if (!title || empty) {
            return
        }
        const content = editorRef?.current?.getHTML()
        const res = await api.post('/user/update_post', {title, id: postId, content})
        if (res.status === 200) {
            navigate(`/post/${postId}`)
        } else {
            alert('Cant update')
        }
        setLoading(false)
    }


    useEffect(() => {
        async function loadPost() {

            const res = await api.get(`/user/my_post?id=${postId}`)
            setTitle(res.data.title)
            editorRef.current?.commands.setContent(res.data.content)
            setLoading(false)
        }
        loadPost()
    }, [])

    return (
        <UserProvider>
            
            <Nav>        
                <div className="ml-auto flex flex-row gap-5">
                    <button
                        onClick={onUpdate}
                        type="button"
                        className="text-sm lg:text-lg text-white  bg-green-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-full  px-3 lg:px-5 py-2 md:py-2.5 text-center lg:mr-2 mb-1 lg:mb-2"
                    >
                        Update
                    </button>
                    <NavDropdown />
                </div>
            </Nav>
            <div className="flex flex-col gap-5 m-auto  w-[95vw] lg:w-[900px] mt-10 pt-[75px] pb-28">
                <>
                {loading && <LoadingSpinner />}
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        placeholder="Title..."
                        value={title}
                        className="editor-title text-neutral-700"

                    />
                    <Editor editorRef={editorRef} />
                </>
            </div>
        </UserProvider>
    );
}
