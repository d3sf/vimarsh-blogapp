import User from "@/app/lib/models/user";

export const generateUsername = async (email: string) => {
    let baseUsername = email.split("@")[0].toLowerCase(); // Extract from email, convert to lowercase
    baseUsername = baseUsername.replace(/[^a-z0-9._]/g, ""); // Remove special characters except . and _

    // Define the IUser interface
    interface IUser {
        username: string;
    }

    // Find all users with similar usernames (e.g., "deep", "deep1", "deep2")
    const similarUsers = await User.find<IUser>({ username: new RegExp(`^${baseUsername}\\d*$`, "i") });
    if (similarUsers.length === 0) return baseUsername; // If no match, return base username

    // Extract numeric suffixes and find the highest one

    const existingNumbers: number[] = similarUsers
        .map((user: IUser) => user.username.match(/\d+$/)) // Match last number in username
        .filter(Boolean) // Remove null values
        .map((match: RegExpMatchArray) => parseInt(match[0], 10)); // Convert to numbers

    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;

    return `${baseUsername}${nextNumber}`; // Append next available number
};

