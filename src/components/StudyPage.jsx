import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import udpDocContent from '../../docs/INTERVIEW_DEEP_DIVE_UDP.md?raw';
import { UdpDiagrams } from './UdpDiagrams';

export function StudyPage() {
  const content = udpDocContent || '';

  return (
    <section className="view view-study active">
      <div className="study-page">
        <UdpDiagrams />
        <article className="study-content markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
      </div>
    </section>
  );
}
