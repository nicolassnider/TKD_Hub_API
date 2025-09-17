import ApiList from "components/ApiList";

export default function BlogList() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Blog</h2>
      <ApiList apiPath="/api/BlogPosts" titleField="title" />
    </div>
  );
}
