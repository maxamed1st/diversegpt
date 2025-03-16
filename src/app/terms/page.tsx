import { promises as fs } from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const metadata = {
  title: 'Terms of Service - DiverseGPT',
  description: 'Terms of Service and usage conditions for DiverseGPT',
};

async function getTermsContent() {
  const filePath = path.join(process.cwd(), 'src/content/terms-of-service.md');
  const content = await fs.readFile(filePath, 'utf8');
  return content;
}

export default async function TermsPage() {
  const content = await getTermsContent();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="prose prose-base-content max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-8" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-8 mb-4" {...props} />,
            p: ({node, ...props}) => <p className="mb-4" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-4" {...props} />,
            li: ({node, ...props}) => <li className="mb-2" {...props} />,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

