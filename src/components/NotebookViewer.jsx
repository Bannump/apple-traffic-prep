import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
hljs.registerLanguage('python', python);

class CellErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError && this.props.fallback) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function getSource(cell) {
  const src = cell.source;
  if (Array.isArray(src)) return src.join('');
  return typeof src === 'string' ? src : '';
}

function getOutputText(output) {
  if (output.output_type === 'stream' && output.text) {
    return Array.isArray(output.text) ? output.text.join('') : output.text;
  }
  if (output.output_type === 'execute_result' && output.data) {
    const data = output.data;
    if (data['text/plain'])
      return Array.isArray(data['text/plain']) ? data['text/plain'].join('') : data['text/plain'];
    if (data['text/html']) return null; // skip HTML for simple viewer
  }
  return null;
}

export function NotebookViewer({ notebook }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !notebook?.cells) return;
    containerRef.current.querySelectorAll('pre.notebook-code-block code').forEach((el) => {
      hljs.highlightElement(el);
    });
  }, [notebook]);

  if (!notebook || !notebook.cells) return null;

  return (
    <article ref={containerRef} className="study-content markdown-body notebook-viewer">
      {notebook.cells.map((cell, idx) => {
        const key = `cell-${idx}-${cell.cell_type}`;
        if (cell.cell_type === 'markdown') {
          const md = getSource(cell);
          if (!md.trim()) return null;
          return (
            <CellErrorBoundary
              key={key}
              fallback={
                <div className="notebook-cell notebook-markdown notebook-cell-fallback">
                  <pre className="notebook-raw-markdown">{md}</pre>
                </div>
              }
            >
              <div className="notebook-cell notebook-markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                  {md}
                </ReactMarkdown>
              </div>
            </CellErrorBoundary>
          );
        }
        if (cell.cell_type === 'code') {
          const code = getSource(cell);
          const outputs = (cell.outputs || [])
            .map(getOutputText)
            .filter(Boolean);
          return (
            <div key={key} className="notebook-cell notebook-code">
              {code.trim() ? (
                <pre className="notebook-code-block">
                  <code className="language-python">{code}</code>
                </pre>
              ) : null}
              {outputs.length > 0 ? (
                <pre className="notebook-output">
                  {outputs.join('')}
                </pre>
              ) : null}
            </div>
          );
        }
        return null;
      })}
    </article>
  );
}
