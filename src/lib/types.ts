// reaction object
export type Reaction = {
  likes: number;
  dislikes: number;
};

// post object from the API
export type Post = {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: Reaction;
  views: number;
  userId: number;
};

// when creating a new post
export type NewPost = {
  title: string;
  body: string;
  tags?: string[];
  userId?: number;
};