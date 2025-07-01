import React, { useState } from "react";
import { useRoles } from "@/app/context/RoleContext";
import { useAuth } from "@/app/context/AuthContext";

import BlogPostBody from "./BlogPostBody";
import BlogPostActions from "./BlogPostActions";
import dynamic from "next/dynamic";
import { BlogPost } from "@/app/types/BlogPost";
import BlogPostTitle from "./BlogPostTitle";

// Dynamically import CreatePostModal with SSR disabled
const CreatePostModal = dynamic(() => import("./CreatePostModal"), {
  ssr: false,
});

type BlogPostContentProps = {
  post: BlogPost;
};

const BlogPostContent: React.FC<BlogPostContentProps> = ({ post }) => {
  const { role } = useRoles();
  const { user } = useAuth();
  const [editOpen, setEditOpen] = useState(false);

  const canEditOrDelete =
    Array.isArray(role) &&
    (role.includes("Admin") ||
      (role.includes("Coach") && user && post.authorId === user.id));

  return (
    <div className="max-w-2xl mx-auto p-4">
      <BlogPostTitle title={post.title} />
      <BlogPostBody content={post.content} />
      <BlogPostActions
        canEditOrDelete={!!canEditOrDelete}
        onEdit={() => {
          console.log("Edit clicked");
          setEditOpen(true);
        }}
      />
      <CreatePostModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        postId={post.id}
        initialTitle={post.title}
        initialContent={post.content}
      />
    </div>
  );
};

export default BlogPostContent;
