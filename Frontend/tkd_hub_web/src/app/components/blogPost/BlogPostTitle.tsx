type Props = { title: string };

const BlogPostTitle = ({ title }: Props) => (
  <h1 className="text-3xl font-bold mb-4 text-neutral-900 dark:text-neutral-100">
    {title}
  </h1>
);

export default BlogPostTitle;
