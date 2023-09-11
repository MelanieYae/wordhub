import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../providers/UserProvider";
import { useNavigate } from "react-router-dom";

export default function NavDropdown() {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLDivElement>(null);
    const { user, logOut } = useContext(UserContext);
    const navigate = useNavigate();

    function changeNavigate(to: string) {
        return () => {
            setShowMenu(false);
            navigate(to);
        };
    }

    function onClickOutSide(event: any) {
        if (
            !menuRef?.current?.contains(event.target) &&
            !menuButtonRef.current?.contains(event.target)
        ) {
            setShowMenu(false);
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", onClickOutSide);
        return () => document.removeEventListener("mousedown", onClickOutSide);
    }, []);

    return (
        <div className="ml-auto md:ml-0 mr-5 md:mr-14 cursor-pointer relative">
            <div
                ref={menuButtonRef}
                className="flex items-center gap-1"
                onClick={() => setShowMenu(!showMenu)}
            >
                <img
                    src={user?.imageUrl ?? "/static/profile_placeholder.png"}
                    className="w-[50px] h-[50px] rounded-full object-cover"
                />
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 text-slate-500"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                </svg>
            </div>

            {showMenu && (
                <div
                    ref={menuRef}
                    className="z-50 gap-4 absolute w-[200px] shadow-2xl right-0 pt-5 pb-8 text-2xl flex flex-col items-start line-clamp-3 rounded-lg translate-y-5 bg-white"
                >
                    <div
                        className="w-full"
                    >
                        <span className="px-3 text-green-500">Hi {user?.username}</span>
                        <div className="h-[1px] w-full bg-slate-200 mt-2" />
                    </div> 
                    <div
                        className="cursor-pointer w-full hover:font-medium px-3"
                        onClick={changeNavigate("/write")}
                    >
                        <button>Write</button>
                    </div>
                    <div
                        className="cursor-pointer w-full hover:font-medium px-3"
                        onClick={changeNavigate("/my-posts")}
                    >
                        <button>My posts</button>
                    </div>
                    <div
                        className="cursor-pointer w-full hover:font-medium px-3"
                        onClick={changeNavigate("/profile")}
                    >
                        <button>Profile</button>
                    </div>
                    <div
                        className="cursor-pointer w-full hover:font-medium px-3"
                        onClick={logOut}
                    >
                        <button>Logout</button>
                    </div>
                </div>
            )}
        </div>
    )
}