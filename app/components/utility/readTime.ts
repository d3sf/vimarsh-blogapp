export const extractTextFromJSON = (jsonContent: any): string => {
    if (!jsonContent || !jsonContent.content) return "";

    return jsonContent.content
        .map((node: any) => {
            if (node.type === "text") {
                return node.text;
            } else if (node.content) {
                return extractTextFromJSON(node);
            }
            return "";
        })
        .join(" ");
};

export const calculateReadTime = (jsonContent: any): number => {
    const plainText = extractTextFromJSON(jsonContent);
    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    return Math.ceil(wordCount / 200); // Assuming 200 words per minute reading speed
};
