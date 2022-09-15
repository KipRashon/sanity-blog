import { createCurrentUserHook, createClient } from "next-sanity";
import createImageUrlBuilder from "@sanity/image-url";

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  apiVersions: "2021-03-25",
  useCdn: process.env.NODE_ENV === "production",
};

//set up the client for fetching the data in the get props page functions
export const sanityClient = createClient(config);

//create an image url from the image from the sanity data type
export const urlFor = (source) => createImageUrlBuilder(config).image(source);

//Helper function using the current logged in user account
export const useCurrentUser = createCurrentUserHook(config);
