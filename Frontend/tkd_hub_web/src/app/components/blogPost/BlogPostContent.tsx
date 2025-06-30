import React from "react";
import { decodeHtml } from "@/app/utils/decodeHtml";


type BlogPost = {
  title: string;
  content: string;
};


const BlogPostContent: React.FC<{ post: BlogPost }> = ({ post }) => (
  <div className="max-w-2xl mx-auto p-4">
    <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
    <div
      className="prose mb-6"
      dangerouslySetInnerHTML={{ __html: decodeHtml(post.content) }}
    />
    <div className="flex justify-end gap-2">
      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition">
        Edit
      </button>
      <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition">
        Delete
      </button>
    </div>
  </div>
);


export default BlogPostContent;
