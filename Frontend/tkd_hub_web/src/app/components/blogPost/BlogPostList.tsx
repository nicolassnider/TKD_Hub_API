import Link from "next/link";
import { decodeHtml } from "@/app/utils/decodeHtml";
import { BlogPost } from "@/app/types/BlogPost";

interface BlogPostListProps {
  posts: BlogPost[];
}

export default function BlogPostList({ posts }: BlogPostListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">No blog posts found.</div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {posts.map((post) => (
        <article key={post.id} className="py-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-2">
            {post.title}
          </h2>
          <div
            className="text-gray-700 mb-2 line-clamp-3 prose"
            style={{ maxHeight: 80, overflow: "hidden" }}
            dangerouslySetInnerHTML={{
              __html:
                post.content.length > 300
                  ? decodeHtml(post.content).slice(0, 300) + "..."
                  : decodeHtml(post.content),
            }}
          />
          <Link
            href={`/blog/${post.id}`}
            className="text-blue-600 hover:underline font-medium"
          >
            Read more &rarr;
          </Link>
        </article>
      ))}
    </div>
  );
}
