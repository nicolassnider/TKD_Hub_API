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
      className="cursor-pointer p-4 border-b border-neutral-200 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800 transition"
    >
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
        {post.title}
      </h2>
      <p
        className="text-neutral-700 dark:text-neutral-300 line-clamp-3"
        style={{ maxHeight: "60px", overflow: "hidden" }}
      >
        {post.content}
      </p>
    </div>
  );
};

export default BlogPostItem;
