import { BlogPost } from "@/app/types/BlogPost";
import { useRouter } from "next/router";

type BlogPostItemProps = {
  post: BlogPost;
};

const BlogPostItem: React.FC<BlogPostItemProps> = ({ post }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/blog/${post.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer p-4 border-b border-gray-200 hover:bg-gray-100 transition"
    >
      <h2 className="text-xl font-semibold text-blue-700 mb-2">{post.title}</h2>
      <p
        className="text-gray-700 line-clamp-3"
        style={{ maxHeight: "60px", overflow: "hidden" }}
      >
        {post.content}
      </p>
    </div>
  );
};

export default BlogPostItem;
