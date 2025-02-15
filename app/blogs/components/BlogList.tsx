import BlogCard from "./BlogCard";

const BlogList = ({ blogs }: { blogs: any[] }) => {
  if (blogs.length === 0) return <p className="text-center">No blogs available</p>;

  return (
    <div className="grid gap-6">
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;
