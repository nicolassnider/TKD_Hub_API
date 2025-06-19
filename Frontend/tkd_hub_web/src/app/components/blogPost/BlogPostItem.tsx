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
    <div onClick={handleClick} style={{ cursor: "pointer" }}>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
    </div>
  );
};

export default BlogPostItem;
