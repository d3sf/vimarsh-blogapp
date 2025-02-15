# Vimarsh BlogApp

<div align="center">
  <img src="public/logo.svg" alt="Vimarsh Blog" width="200"/>
</div>

A modern, feature-rich blog application built with Next.js, TypeScript, and Tailwind CSS. This application provides a seamless blogging experience with a beautiful UI and powerful features.

## 🚀 Features

- ✨ Modern and responsive UI with Tailwind CSS
- 📝 Rich text editor with TipTap
- 🔐 Authentication with NextAuth.js
- 📸 Image upload support with Cloudinary
- 📱 Mobile-friendly design
- 🎨 Customizable themes
- 🔍 Basic SEO features (metadata, image optimization)
- 📊 Table support in blog posts
- ✅ Task list functionality
- 🔗 Link management
- 📄 Blockquote support
- 🖼️ Image embedding
- 📏 Text alignment options

## 🛠️ Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js
- **Database:** MongoDB with Mongoose
- **Rich Text Editor:** TipTap
- **Image Upload:** Cloudinary
- **Form Validation:** Zod
- **UI Components:** Radix UI
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Animation:** Motion

## 🏗️ Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (Latest LTS version recommended)
- npm or yarn
- MongoDB (local or Atlas)

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vimarsh-blogapp.git
cd vimarsh-blogapp
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📝 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## 🏗️ Project Structure

```
vimarsh-blogapp/
├── app/              # Next.js app directory
├── lib/             # Utility functions and configurations
├── public/          # Static assets
├── components/      # React components
├── styles/          # Global styles
└── types/           # TypeScript type definitions
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- TipTap team for the rich text editor
- Tailwind CSS team for the utility-first CSS framework
- All other open-source contributors



