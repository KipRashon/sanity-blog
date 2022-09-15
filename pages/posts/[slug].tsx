import { GetStaticProps } from "next";
import React from "react";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../types";
import PortableText from "react-portable-text";
import CommentForm from "../../components/CommentForm";
import CommentListing from "../../components/CommentListing";

interface Props {
  post: Post;
}

function PostDetails({ post }: Props) {
  return (
    <main>
      <Header />
      <img
        className="w-full h-40 object-cover"
        src={urlFor(post.mainImage).url()!}
        alt=""
      />

      <article className="max-w-3xl mx-auto">
        <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
        <h2 className="text-xl font-light mb-2">{post.description}</h2>
        <div className="flex items-center space-x-2">
          <img
            src={urlFor(post.author.image).url()!}
            alt=""
            className="h-10 w-10 rounded-full"
          />
          <p className="font-extralight text-sm">
            Blog post by{" "}
            <span className="text-green-600">{post.author.name}</span> -
            Published at {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            className=""
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props} />
              ),
              h2: (props: any) => (
                <h2 className="text-xl font-bold my-5" {...props} />
              ),
              li: (props: any) => <li className="ml-4 list-disc" {...props} />,
              link: (props: any) => (
                <a
                  href={props.href}
                  className="text-blue-500 hover:underline"
                  {...props}
                >
                  {props.children}
                </a>
              ),
            }}
          />
        </div>
      </article>
      <hr className="max-w-lg my-5 mx-auto border border-yellow-500" />
      <CommentForm post={post} />
      <CommentListing comments={post.comments} />
    </main>
  );
}

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
  _id,
  slug,
}`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  _createdAt,
  author -> {
     name,
     image
  },
  description,
  slug,
  title,
  mainImage,
  body,
  'comments': *[
    _type == 'comment' &&
    post._ref == ^._id &&
    approved == true
  ]
}`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};

export default PostDetails;
