# McLuhan Tetrad Analyzer

An interactive tool for analyzing technologies through Marshall McLuhan's tetrad of media effects.

## Features

- **AI-Powered Analysis**: Leverages Claude and Ollama LLMs for deep technological analysis
- **Interactive Tetrad**: Visual representation of McLuhan's four laws of media
- **Deep Dive Exploration**: Detailed analysis of enhancement, obsolescence, retrieval, and reversal
- **Customizable Parameters**: Adjust time scope, scale, and analysis depth
- **PDF Export**: Generate and save comprehensive reports
- **Responsive Design**: Seamless experience across devices

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Anthropic Claude API
- Ollama Local LLM
- ShadcnUI Components

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mcluhan-tetrad.git

# Navigate to project directory
cd mcluhan-tetrad

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

## Getting Started

First, run the development server:

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


Project Structure

    mcluhan-tetrad/
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   │   └── tetrad/
    │   │   └── api/
    │   ├── styles/
    │   └── types/
    ├── public/
    └── tests/



API Documentation

Claude Analysis Endpoint
    POST /api/claude
    Parameters: technology, temperature, timeScope, scale, depth

Ollama Analysis Endpoint
    POST /api/ollama-analysis
    Parameters: Same as Claude endpoint

Contributing
    Fork the repository
    Create your feature branch (git checkout -b feature/AmazingFeature)
    Commit your changes (git commit -m 'Add some AmazingFeature')
    Push to the branch (git push origin feature/AmazingFeature)
    Open a Pull Request
    
License
    This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments
    Inspired by Marshall McLuhan's "Laws of Media"
    Built with Anthropic's Claude and Ollama