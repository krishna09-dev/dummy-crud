import type { Post } from "./types"; 

// Base URL of DummyJSON
const BaseURL = "https://dummyjson.com";

// 1) for fetching all posts
export async function getPosts(Limit = 10): Promise<Post[]> {
    const res = await fetch(`${BaseURL}/posts?imits=${Limit}`);
    

    if (!res.ok) {
        throw new Error("Failed to fetch posts")
    }

      const data = await res.json();


    return data.Posts;
}