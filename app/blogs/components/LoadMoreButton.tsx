const LoadMoreButton = ({ fetchBlogs, hasMore, loading }: { fetchBlogs: () => void; hasMore: boolean; loading: boolean }) => {
    if (!hasMore) return null;
  
    return (
      <button
        onClick={fetchBlogs}
        className="mt-4 text-customPink hover:text-pink-600 dark:hover:text-pink-400 text-md font-medium flex items-center gap-2 transition-colors duration-200"
        disabled={loading}
      >
        {loading ? "Loading..." : "Next"}
      </button>
    );
  };
  
  export default LoadMoreButton;

