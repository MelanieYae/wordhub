import { Link } from "react-router-dom";

export default function Nav({children}: {children?: React.ReactNode}) {

  return (
    <div className="select-none fixed top-0 z-10 w-full h-[75px] bg-slate-50 flex flex-row items-center gap-3 shadow-sm">
      <Link
        reloadDocument={true}
        className="sm:text-lg lg:text-2xl font-bold text-gray-700 tracking-wider pl-5 cursor-pointer"
        to='/'
      >
        WordHub
      </Link>
    {children}
    </div>
  );
}
