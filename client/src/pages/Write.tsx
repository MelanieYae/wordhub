import { useContext, useEffect, useRef, useState } from "react";
import { api, uploadImage } from "../utils/api";
import Editor from "../components/editor/Editor";
import { useNavigate } from "react-router-dom";
import Nav from "../components/nav/Nav";
import NavDropdown from "../components/nav/NavDropdown";
import { UserContext } from "../providers/UserProvider";
import LoadingSpinner from "../components/Loading";

export default function Write() {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState('/static/post_placeholder.jpg')
  const [publishView, setPublishView] = useState(false);
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const editorRef = useRef<any>()
  const { user } = useContext(UserContext)

  async function publish() {
    setLoading(true)
    const content = editorRef?.current?.getHTML()


    const res = await api.post("/user/create", {
      content: content,
      imageUrl,
      title,
    });
    const { id } = res.data
    navigate(`/post/${id}`)
    setLoading(false)
  }

  async function onSelectImage(event: any) {
    const file = event.target.files?.[0]
    if (file) {
      const url = await uploadImage(file as File);
      setImageUrl(url)
    }
  }



  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        window.scrollTo(0, document.body.scrollHeight);
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)

  })

  function setPreviewImage() {
    // try to get first image from editor and set it as preview
    const htmlContent = editorRef.current?.getHTML(); // get editor content as html
    const parser = new DOMParser(); 
    const doc = parser.parseFromString(htmlContent, 'text/html'); // parse it as regular html
    const firstImage = doc.querySelector('img'); // get first image
    if (firstImage?.src) { // set it 
      setImageUrl(firstImage.src)
    }
  }

  return (
    <>
      <Nav>
        <div className="ml-auto flex flex-row gap-5">
          {!publishView && (
            <button
              onClick={() => {
                const notEmpty = (editorRef.current?.getJSON().content[0])
                if (title && notEmpty) {
                  setPreviewImage()
                  setPublishView(true)
                }

              }}
              type="button"
              className="text-white bg-green-600 font-bold text-sm lg:text-xl hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 rounded-full px-5 py-2.5 text-center mr-2 mb-2"
            >
              Publish
            </button>
          )}

          <NavDropdown />
        </div>
      </Nav>
      <div className="flex flex-col gap-5 m-auto  w-[95vw] lg:w-[900px] mt-10 pt-[75px] pb-28">
        {!publishView && (

          <>
            <input
              onChange={(e) => {
                setTitle(e.target.value.slice(0, 35)) // limit title to 35 characters
              }}
              value={title}
              type="text"
              placeholder="Title..."
              className="editor-title text-neutral-700"

            />
            <Editor editorRef={editorRef} />
          </>
        )}
        {publishView && (
          <div className="m-auto w-[95vw] lg:w-[600px] flex items-center flex-col">
            {loading && <LoadingSpinner />}
            <span className="text-center text-3xl">Preview</span>
            <div className="w-full h-[200px] shadow-lg flex flex-row">
              <div className="flex-1 flex flex-col">
                <div className="ml-5 mt-5  flex flex-row items-center gap-3">
                  <img
                    className="w-[50px] h-[50px] rounded-full object-cover"
                    src={user?.imageUrl}
                  />
                  <span className="text-xl font-semibold">{user?.username}</span>
                  {/* <span className="text-sm md:text-xl font-light">{formatDate(post.createdAt)}</span> */}
                </div>
                <span className="pl-5 pr-5 mt-4 text-xl lg:text-3xl font-semibold">
                  {title}
                </span>
              </div>
              <div className="ml-auto self-center lg:mr-5">
                <label htmlFor="fileInput" className="cursor-pointer">
                  <img
                    className="w-[130px] h-[130px] lg:w-[150px] lg:h-[150px] rounded-full object-cover object-center"
                    src={imageUrl}
                  />
                </label>
                <input onInput={onSelectImage} hidden id="fileInput" type="file" />
              </div>
            </div>

            <button
              onClick={() => publish()}
              type="button"
              className="mt-5 text-white bg-green-600 font-bold text-xl hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 rounded-full px-5 py-2.5 text-center mr-2 mb-2"
            >
              Publish now
            </button>
          </div>
        )}
      </div>
    </>
  );
}
