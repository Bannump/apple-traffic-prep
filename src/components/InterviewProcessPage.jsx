import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import interviewProcessContent from '../../docs/EXPECTED_INTERVIEW_PROCESS.md?raw';

export function InterviewProcessPage() {
  const content = interviewProcessContent || '';

  return (
    <section className="view view-study active">
      <div className="study-page">
        <article className="study-content markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
      </div>
    </section>
  );
}
