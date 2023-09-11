
import { useEffect, useRef, useState } from "react";
import { uploadImage } from "../../utils/api";
import axios from "axios";


// Upload Image or generate random image from floating menu
export default function UploadImage({ editor, setVisible }: { editor: any; setVisible: any }) {

  const ref = useRef<any>()
  const [inputValue, setInputValue] = useState('')

  async function onSelectFile(event: any) {
    const file = event.target.files?.[0];
    const url = await uploadImage(file as File);

    await editor.chain().focus().setImage({ src: url }).run();
    await editor.chain().newlineInCode().enter().focus("end").run();

    setVisible(false);
  }
  async function onRandomImage() {
    const res = await axios.get(`https://source.unsplash.com/random/?${inputValue}`, {maxRedirects: 0})
    const url = res.request.responseURL
    await editor.chain().focus().setImage({ src: url }).run();
    await editor.chain().newlineInCode().enter().focus("end").run()
    setVisible(false);
  }

  function onClickOutSide(event: any) {
    if (!ref?.current?.contains(event.target)) {
      setVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", onClickOutSide);
    return () => document.removeEventListener("mousedown", onClickOutSide);
  }, []);

  return (
    <div className="bg-black/30 top-0 left-0 fixed w-[100vw] h-[100vh] flex items-center justify-center z-[3000000]">
      <div className="w-[500px] rounded-xl shadow-lg p-5 flex flex-col bg-white" ref={ref} >
        <span className="mb-2 text-slate-500">Create Random</span>
        <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only ">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" className="w-5 h-5 text-gray-500 " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input onChange={e => setInputValue(e.target.value)} value={inputValue} type="search" id="search" className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 " placeholder="describe..." required />
          <button onClick={onRandomImage} type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-4 py-2 ">Create</button>
        </div>
        <span className="mb-2 mt-5 text-slate-500">Upload Image</span>
        <label
          htmlFor="fileInput"
          className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 inline-flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>

        </label>
        <input onChange={onSelectFile} id="fileInput" type="file" hidden />
      </div>
    </div>
  );
}