// Blog-related type definitions
export interface BlogPost {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorName?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBlogPostDto {
  title: string;
  content: string;
}

export interface UpdateBlogPostDto {
  title: string;
  content: string;
  isActive?: boolean;
}

// Blog permission interface
export interface BlogPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
}
