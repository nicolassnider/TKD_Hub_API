import { decodeHtml } from "@/app/utils/decodeHtml";

type Props = { content: string };

const BlogPostBody = ({ content }: Props) => (
  <div
    className="mb-6 text-neutral-900 dark:text-neutral-100 leading-relaxed break-words"
    dangerouslySetInnerHTML={{ __html: decodeHtml(content) }}
  />
);

export default BlogPostBody;
