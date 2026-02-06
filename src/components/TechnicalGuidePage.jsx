import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import technicalGuideContent from '../../docs/PROJECT_TECHNICAL_GUIDE.md?raw';

export function TechnicalGuidePage() {
  const content = technicalGuideContent || '';

  return (
    <section className="view view-study active">
      <div className="study-page">
        <article className="study-content markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </section>
  );
}
