import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import actionPlanContent from '../../docs/ROUND2_ACTION_PLAN.md?raw';
import rateLimiterContent from '../../docs/RATE_LIMITER.md?raw';

const SUB_TABS = [
  { id: 'action-plan', label: 'Action Plan' },
  { id: 'rate-limiter', label: 'Rate Limiter' },
];

export function Round2PrepPage() {
  const [subTab, setSubTab] = useState('action-plan');

  const renderContent = () => {
    switch (subTab) {
      case 'action-plan':
        return (
          <article className="study-content markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {actionPlanContent || ''}
            </ReactMarkdown>
          </article>
        );
      case 'rate-limiter':
        return (
          <article className="study-content markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {rateLimiterContent || ''}
            </ReactMarkdown>
          </article>
        );
      default:
        return null;
    }
  };

  return (
    <section className="view view-study active">
      <div className="study-page">
        <div className="sub-tabs">
          {SUB_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`sub-tab${subTab === tab.id ? ' active' : ''}`}
              onClick={() => setSubTab(tab.id)}
              aria-pressed={subTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {renderContent()}
      </div>
    </section>
  );
}
