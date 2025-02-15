import { User } from "lucide-react";

const AboutSection = ({ about }: { about: string }) => {
    return (
        <div className="bg-white dark:bg-[#1E1F21] shadow-md dark:shadow-gray-900/30 border dark:border-gray-800 rounded-xl p-4 w-full max-w- transition-colors duration-300">
            <div className="flex items-center gap-2 mb-2">
                <User className="text-blue-600 dark:text-blue-400 transition-colors duration-200" size={20} />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 transition-colors duration-200">About</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line transition-colors duration-200">
                {about}
            </p>
        </div>
    );
};

export default AboutSection;