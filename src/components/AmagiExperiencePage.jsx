import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import amagiExperienceContent from '../../docs/AMAGI_EXPERIENCE.md?raw';

export function AmagiExperiencePage() {
  const content = amagiExperienceContent || '';

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
