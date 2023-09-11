import { Link } from "react-router-dom";
import { formatDate } from "../utils/date";

// Post box with link to see the post
export default function Post({ post, url }: { post: any, url: string }) {
    return (
      <Link className="w-full" to={url}>
        <div className="w-full h-[200px] shadow-lg flex flex-row cursor-pointer">
          <div className="flex-1 flex flex-col">
            <div className="ml-5 mt-5  flex flex-row items-center gap-3">
              <img
                className="w-[50px] h-[50px] rounded-full object-cover"
                src={post?.user?.imageUrl}
              />
              <span className="text-xl font-semibold">{post.user?.username}</span>
              <span className="text-sm md:text-xl font-light">{formatDate(post.createdAt)}</span>
            </div>
            <span className="pl-5 pr-5 mt-4 text-xl lg:text-3xl font-semibold">
              {post.title}
            </span>
          </div>
          <div className="ml-auto self-center lg:mr-5">
            <img
              className="w-[130px] h-[130px] lg:w-[150px] lg:h-[150px] rounded-full object-cover object-center"
              src={post.imageUrl}
            />
          </div>
        </div>
      </Link>
    );
  }