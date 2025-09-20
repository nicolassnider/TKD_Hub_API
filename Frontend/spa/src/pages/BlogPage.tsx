import React from "react";
import { Routes, Route } from "react-router-dom";
import { BlogProvider } from "../context/BlogContext";
import { BlogList } from "../components/BlogList";
import { BlogDetail } from "../components/BlogDetail";

export const BlogPage: React.FC = () => {
  return (
    <BlogProvider>
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/post/:id" element={<BlogDetail />} />
      </Routes>
    </BlogProvider>
  );
};
