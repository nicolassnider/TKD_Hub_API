/**
 * Blog Components Module
 *
 * Comprehensive blog functionality with clean, componentized parts.
 * All components are in a flat structure with centralized types.
 */

// Main blog components
export { BlogList } from "./BlogList";
export { BlogDetail } from "./BlogDetail";
export { BlogEditor } from "./BlogEditor";
export { default as BlogManagement } from "./BlogManagement";

// Blog management components (used by BlogManagement)
export { BlogPostTable } from "./BlogPostTable";
export { BlogPostDialog } from "./BlogPostDialog";
export { BlogPostsLoadingState } from "./BlogPostsLoadingState";
export { BlogPostsErrorState } from "./BlogPostsErrorState";

// Blog types (exported from main types folder)
export type {
  BlogPostManagement as BlogPost,
  BlogFormData,
} from "../../types/api";
