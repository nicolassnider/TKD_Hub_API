# Blog Feature Integration Guide

## Overview

The blog feature has been implemented with the following components:

### Core Files Created:

1. **`src/utils/htmlUtils.ts`** - HTML decoding and text processing utilities
2. **`src/types/blog.ts`** - TypeScript definitions for blog data structures
3. **`src/context/BlogContext.tsx`** - Blog state management with CRUD operations and permissions
4. **`src/components/BlogEditor.tsx`** - Rich blog post creation/editing dialog
5. **`src/components/BlogList.tsx`** - Blog posts listing with cards view
6. **`src/components/BlogDetail.tsx`** - Detailed blog post view
7. **`src/pages/BlogPage.tsx`** - Main blog page with routing

## Features Implemented:

### 🔐 Permission System

- **Admin & Coach**: Can create, edit, and delete blog posts
- **Student & Guest**: Can view blog posts only
- Authors can edit/delete their own posts
- Permission checks integrated with existing `RoleContext`

### 📝 Blog Editor

- Simple HTML formatting toolbar (Bold, Italic, Lists, Links, etc.)
- Live preview of HTML content
- Validation for required fields
- Mobile-responsive dialog

### 📋 Blog List

- Card-based layout showing blog previews
- Author information with role badges
- Floating action button for mobile
- Search and filtering capabilities ready for future enhancement
- Responsive grid layout

### 📖 Blog Detail View

- Full blog post content with HTML rendering
- Breadcrumb navigation
- Author information and timestamps
- Edit/delete actions (when permitted)
- Responsive typography and spacing

### 🛡️ HTML Security

- HTML content is sanitized on the backend
- Frontend uses `dangerouslySetInnerHTML` safely for display
- HTML decoding utilities for preview text

## Integration Steps:

### 1. Add Routes to Your App

```tsx
// In your main App.tsx or routing configuration
import { BlogPage } from "./pages/BlogPage";

// Add to your router:
<Route path="/blog/*" element={<BlogPage />} />;
```

### 2. Add Navigation Menu Item

```tsx
// Add to your main navigation
{
  title: 'Blog',
  path: '/blog',
  icon: <ArticleIcon />,
  // Show to all users since everyone can view
}
```

### 3. Backend API Requirements

Ensure your API has these endpoints:

- `GET /api/blogposts` - List all posts
- `GET /api/blogposts/{id}` - Get single post
- `POST /api/blogposts` - Create post (Admin/Coach only)
- `PUT /api/blogposts/{id}` - Update post (Admin/Coach/Author only)
- `DELETE /api/blogposts/{id}` - Delete post (Admin/Coach/Author only)

Expected BlogPost model:

```csharp
public class BlogPost
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Content { get; set; } // HTML content
    public int AuthorId { get; set; }
    public string? AuthorName { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

### 4. API Configuration

The BlogContext expects:

- Authentication headers from existing auth system
- HTML content sanitization on backend
- Standard REST API responses
- Error handling with proper status codes

## Usage Examples:

### Creating a Blog Post

1. Navigate to `/blog`
2. Click "New Post" button (Admin/Coach only)
3. Enter title and content with HTML formatting
4. Preview content before saving
5. Click "Create Post"

### Editing a Blog Post

1. Open any blog post
2. Click three-dots menu → "Edit Post" (if permitted)
3. Modify content in editor
4. Save changes

### Viewing Blog Posts

1. Navigate to `/blog` to see all posts
2. Click on any post card to view full content
3. Use breadcrumbs to navigate back

## Next Steps:

- Add rich text editor (TinyMCE, Quill, etc.) to replace basic HTML editor
- Implement search and filtering functionality
- Add categories/tags system
- Implement comment system
- Add blog post scheduling
- Image upload functionality

## Notes:

- All components use Material-UI for consistent styling
- Responsive design works on mobile and desktop
- Integrates seamlessly with existing `RoleContext` and `ApiTable` patterns
- HTML content is safely handled with proper encoding/decoding
- Ready for future enhancements like rich text editing
