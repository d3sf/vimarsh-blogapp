"use client"

import CreateBlog from "./components/CreateBlog";

const page = () => {
  return (
    <div className="bg-white dark:bg-[#1E1F21] transition-colors duration-300 pb-16">
      <div className="p-8">
        <CreateBlog />
      </div>
    </div>
  );
};

export default page;