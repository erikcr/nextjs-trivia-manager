# Next.js Trivia Manager

A modern web application for managing trivia events and questions, built with Next.js 13+ and Supabase.

## Features

- User Authentication with Supabase
  - Email/Password login
  - Magic link authentication
  - Session management
- Event Management
- Modern UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Authentication**: Supabase Auth
- **Database**: Supabase
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nextjs-trivia-manager.git
cd nextjs-trivia-manager
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

- `/app` - App router pages and layouts
- `/lib` - Core library code
  - `/supabase` - Supabase client configuration
  - `Provider.tsx` - React context providers
- `/components` - Reusable React components
- `/assets` - Static assets

## Authentication Flow

The application uses Supabase Authentication with the following features:
- Email/Password authentication
- Magic link authentication (passwordless)
- Protected routes with middleware
- Server-side session management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
