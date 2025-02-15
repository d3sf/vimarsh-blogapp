import { z } from "zod";

export const BlogSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters long"),
    content: z.string().min(20, "Content must be at least 20 characters long"),

})  

export type BlogType = z.infer<typeof BlogSchema>

// this ensures type safety and avoids duplication bw zod and TS.
// z.infer to generate typescript types automatically from zod schema

// can be used like this
// import { BlogType } from "@/lib/validations/blogValidation";

// async function createBlog(data: BlogType) {
//     // data.title and data.content are correctly typed!
//   }