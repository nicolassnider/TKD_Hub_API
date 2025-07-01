import { decodeHtml } from "@/app/utils/decodeHtml";

type Props = { content: string };

const BlogPostBody = ({ content }: Props) => (
  <div
    className="prose mb-6"
    dangerouslySetInnerHTML={{ __html: decodeHtml(content) }}
  />
);

export default BlogPostBody;
