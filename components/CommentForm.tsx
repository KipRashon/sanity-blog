import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Post } from "../types";

interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

interface Props {
  post: Post;
}

export default function CommentForm({ post }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const [submitted, setSubmitted] = useState<boolean>(false);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        setSubmitted(true);
      })
      .catch((err) => {
        setSubmitted(false);
      });
  };

  if (submitted) {
    return (
      <div className=" flex flex-col p-10 my-10 bg-yellow-500  text-white max-w-2xl  mx-auto">
        <h3 className="text-3xl font-bold">
          Thank you for submitting your comment!
        </h3>
        <p>Once it has been approved, it will appear below</p>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col p-5 max-w-2xl mx-auto my-10 mb-10"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h3 className="text-sm text-yellow-500">Enjoyed the article?</h3>
      <h4 className="text-3xl font-bold">Leave a comment below!</h4>
      <hr className="py-3 mt-2" />
      <input type="hidden" {...register("_id")} name="_id" value={post._id} />
      <label className="block mb-5">
        <span className="text-gray-700">Name</span>
        <input
          className="focus:outline-none shadow border rounded py-2 px-3 form-input mt-2 block w-full ring-yellow-500 focus:ring"
          type="text"
          {...register("name", { required: true })}
          placeholder="John Doe"
        />
      </label>
      <label className="block mb-5">
        <span className="text-gray-700">Email</span>
        <input
          className="focus:outline-none shadow border rounded py-2 px-3 form-input mt-2 block w-full ring-yellow-500 focus:ring"
          type="email"
          placeholder="johndoe@gmail.com"
          {...register("email", { required: true })}
        />
      </label>
      <label className="block mb-5">
        <span className="text-gray-700">Comment</span>
        <textarea
          className="focus:outline-none shadow border rounded py-2 px-3 form-textarea mt-2 block w-full ring-yellow-500 focus:ring"
          placeholder="What do you think of the article?"
          rows={8}
          {...register("comment", { required: true })}
        ></textarea>
      </label>

      <div className="flex flex-col p-5">
        {errors.name && (
          <span className="text-red-500">The name field is required</span>
        )}
        {errors.email && (
          <span className="text-red-500">The email field is required</span>
        )}
        {errors.comment && (
          <span className="text-red-500">The comment field is required</span>
        )}
      </div>

      <button
        type="submit"
        className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-3 px-4 rounded cursor-pointer"
      >
        Submit
      </button>
    </form>
  );
}
