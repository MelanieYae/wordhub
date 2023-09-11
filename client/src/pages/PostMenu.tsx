import { useEffect, useRef, useState } from "react"
import { useNavigate } from 'react-router-dom'


export default function PostMenu({onDelete, postId}: {onDelete: any, postId: string}) {
    const [menuVisible, setMenuVisible] = useState(false)
    const navigate = useNavigate()
    const ref = useRef<any>()


    function onClickOutSide(event: any) {
        if (!ref?.current?.contains(event.target)) {
          setMenuVisible(false)
        }
      }
    
      useEffect(() => {
        document.addEventListener("mousedown", onClickOutSide);
        return () => document.removeEventListener("mousedown", onClickOutSide);
      }, []);

    return (
        <div className="relative" ref={ref}>
            {menuVisible &&
                <div className="gap-4 absolute w-[150px] shadow-2xl right-0 pt-5 pl-5 pb-5 text-xl flex flex-col items-start line-clamp-3 rounded-lg translate-y-9 bg-white">
                    <div
                        className="cursor-pointer w-full hover:font-medium"
                        onClick={() => navigate(`/edit/${postId}`)}
                    >
                        <button>Edit</button>
                    </div>
                    <div
                        className="cursor-pointer w-full hover:font-medium"
                        onClick={onDelete}
                    >
                        <button>Delete</button>
                    </div>


                </div>
            }
            <svg onClick={() => setMenuVisible(!menuVisible)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={1.5} className="w-8 h-8 lg:w-10 lg:h-10 stroke-slate-500 cursor-pointer fill-transparent">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
    )
}