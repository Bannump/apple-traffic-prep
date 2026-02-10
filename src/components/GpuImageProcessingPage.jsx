import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import gpuImageProcessingContent from '../../docs/GPU_IMAGE_PROCESSING.md?raw';

export function GpuImageProcessingPage() {
  const content = gpuImageProcessingContent || '';

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
