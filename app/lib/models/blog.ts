import mongoose, { Document, model, models, Schema } from "mongoose"

interface IBlog extends Document {
    title: string;
    description: string;
    content: any; //rich text with embedded images
    author: mongoose.Types.ObjectId; // Reference to User model
}

const BlogSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: Schema.Types.Mixed, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference
}, {
    timestamps: true
    // createdat and updatedat
})

// prevents duplicate models by checking models.Blog   
const Blog = models.Blog || model<IBlog>('Blog', BlogSchema);
export default Blog;