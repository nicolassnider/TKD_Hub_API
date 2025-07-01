type Props = { title: string };

const BlogPostTitle = ({ title }: Props) => (
  <h1 className="text-3xl font-bold mb-4">{title}</h1>
);

export default BlogPostTitle;
