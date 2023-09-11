import {FloatingMenu} from "@tiptap/react";
import { useState } from "react";


// Floating menu, when writing new line we have button to upload image / generate text with chatGPT
export default function FMenu({
    editor,
    setTextGen,
    setShowUploadImage,
  }: {
    editor: any;
    setTextGen: any;
    setShowUploadImage: any;
  }) {
    const [visible, setVisible] = useState(false);
  
  
    const offset: [number, number] = window.innerWidth > 800 ? [0, -65] : [-45, -20]
    return (
      <>
        <FloatingMenu
          editor={editor}
          tippyOptions={{ duration: 100, offset }}
          className="relative flex flex-row items-center gap-5"
        >
          {!visible && (
            <svg
              onClick={() => setVisible(true)}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-16 h-16 stroke-slate-600 opacity-90 bg-transparent fill-transparent stroke-[0.5px] cursor-pointer"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          {visible && (
            <svg
              onClick={() => {
                setVisible(false);
              }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-16 h-16 stroke-slate-600 bg-transparent fill-white bg-white stroke-[0.5px] cursor-pointer"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          {visible && (
            <>
              <div
                onClick={() => {
                  setVisible(false);
                  setTextGen(true);
                }}
                className="p-2 shadow-lg rounded-full cursor-pointer bg-white border-green-400 border"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-8 h-8 fill-yellow-400"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
              </div>
              <div
                onClick={() => {
                  setVisible(false);
                  setShowUploadImage(true);
                }}
                className="p-2 shadow-lg rounded-full cursor-pointer bg-white border border-green-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-8 h-8 fill-green-400"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
            </>
          )}
        </FloatingMenu>
      </>
    );
  }