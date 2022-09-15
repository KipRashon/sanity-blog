import React from "react";
import Link from "next/link";
import { Post } from "../types";
import { urlFor } from "../sanity";

interface Props {
  post: Post;
}

function PostDisplay({ post }: Props) {
  return (
    <Link href={`/posts/${post.slug.current}`}>
      <div className="group cursor-pointer border rounded-lg overflow-hidden">
        <img
          className=" h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
          src={urlFor(post.mainImage).url()!}
          alt=""
        />
        <div className="flex justify-between p-5 bg-white">
          <div>
            <p className="text-lg font-bold">{post.title}</p>
            <p className="text-sm">
              {post.description} by {post.author.name}
            </p>
          </div>
          <img
            className="h-12 w-12 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt=""
          />
        </div>
      </div>
    </Link>
  );
}

export default PostDisplay;
