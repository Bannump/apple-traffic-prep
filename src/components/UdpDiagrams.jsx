import React from 'react';

/**
 * Diagrams for the UDP Packet Processor deep dive.
 * All SVGs use currentColor and CSS vars for dark-theme compatibility.
 */
export function UdpDiagrams() {
  return (
    <div className="udp-diagrams">
      <h2 className="diagrams-heading">Visual overview</h2>

      {/* 1. System component diagram — grid-based, consistent box sizes */}
      <figure className="diagram-figure">
        <figcaption>System architecture — components and data flow</figcaption>
        <div className="diagram-wrap diagram-wide">
          <svg viewBox="0 0 760 360" className="diagram-svg" aria-hidden="true">
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="currentColor" />
              </marker>
              <marker id="arrowhead-dashed" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="currentColor" opacity="0.7" />
              </marker>
            </defs>
            {/* External: Client — std box 112x52 */}
            <rect x="24" y="134" width="112" height="52" rx="6" className="diagram-box diagram-external" />
            <text x="80" y="158" className="diagram-text diagram-text-center">Client</text>
            <text x="80" y="176" className="diagram-text diagram-text-small diagram-text-center">(Python)</text>

            {/* Network */}
            <text x="168" y="162" className="diagram-text diagram-text-small">UDP</text>
            <path d="M136 160 L216 160" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" opacity="0.8" />

            {/* Server process boundary */}
            <rect x="216" y="24" width="432" height="312" rx="8" className="diagram-boundary" />
            <text x="432" y="48" className="diagram-text diagram-text-small">Server process (C++)</text>

            {/* Listener thread — std box 132x56, label fits inside */}
            <rect x="236" y="72" width="132" height="56" rx="6" className="diagram-box diagram-producer" />
            <text x="302" y="98" className="diagram-text diagram-text-center">Listener thread</text>
            <text x="302" y="116" className="diagram-text diagram-text-small diagram-text-center">recvfrom</text>

            {/* Queue — std box 120x52 */}
            <rect x="404" y="76" width="120" height="52" rx="6" className="diagram-box diagram-queue" />
            <text x="464" y="98" className="diagram-text diagram-text-center">Queue</text>
            <text x="464" y="116" className="diagram-text diagram-text-small diagram-text-center">mutex + CV</text>

            {/* Workers — uniform 80x44 each */}
            <rect x="556" y="64" width="80" height="44" rx="6" className="diagram-box diagram-worker" />
            <text x="596" y="90" className="diagram-text diagram-text-small diagram-text-center">Worker 1</text>
            <rect x="556" y="114" width="80" height="44" rx="6" className="diagram-box diagram-worker" />
            <text x="596" y="140" className="diagram-text diagram-text-small diagram-text-center">Worker 2</text>
            <rect x="556" y="164" width="80" height="44" rx="6" className="diagram-box diagram-worker" />
            <text x="596" y="190" className="diagram-text diagram-text-small diagram-text-center">Worker 3</text>
            <rect x="556" y="214" width="80" height="44" rx="6" className="diagram-box diagram-worker" />
            <text x="596" y="240" className="diagram-text diagram-text-small diagram-text-center">Worker 4</text>

            {/* process_packet — box sized for label */}
            <rect x="548" y="278" width="96" height="44" rx="6" className="diagram-box diagram-fn" />
            <text x="596" y="302" className="diagram-text diagram-text-small diagram-text-center">process_packet</text>

            {/* Arrows: Client -> Listener */}
            <path d="M216 160 L268 100" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#arrowhead)" opacity="0.9" />
            {/* Listener -> Queue */}
            <path d="M368 100 L404 102" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
            {/* Queue -> Workers */}
            <path d="M524 92 L556 86" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#arrowhead)" />
            <path d="M524 102 L556 136" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#arrowhead)" />
            <path d="M524 102 L556 186" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#arrowhead)" />
            <path d="M524 102 L556 236" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#arrowhead)" />
            {/* Workers -> process_packet */}
            <path d="M596 258 L596 278" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#arrowhead)" />

            {/* Shared memory — std box */}
            <rect x="236" y="212" width="148" height="52" rx="6" className="diagram-box diagram-shm" />
            <text x="310" y="236" className="diagram-text diagram-text-center">POSIX shared memory</text>
            <text x="310" y="254" className="diagram-text diagram-text-small diagram-text-center">(stats)</text>

            {/* Server writes to shm */}
            <path d="M464 240 L384 238" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#arrowhead-dashed)" opacity="0.8" />
            <text x="408" y="232" className="diagram-text diagram-text-tiny">writes</text>

            {/* Monitor & Dashboard — uniform 100x44 */}
            <rect x="236" y="280" width="100" height="44" rx="6" className="diagram-box diagram-reader" />
            <text x="286" y="304" className="diagram-text diagram-text-small diagram-text-center">Monitor</text>
            <text x="286" y="318" className="diagram-text diagram-text-tiny diagram-text-center">(C++)</text>

            <rect x="352" y="280" width="100" height="44" rx="6" className="diagram-box diagram-reader" />
            <text x="402" y="304" className="diagram-text diagram-text-small diagram-text-center">Dashboard</text>
            <text x="402" y="318" className="diagram-text diagram-text-tiny diagram-text-center">(Python)</text>

            {/* Read arrows to shm */}
            <path d="M310 280 L310 264" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#arrowhead-dashed)" opacity="0.7" />
            <path d="M402 280 L358 264" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#arrowhead-dashed)" opacity="0.7" />
            <text x="318" y="272" className="diagram-text diagram-text-tiny">read</text>
          </svg>
        </div>
      </figure>

      {/* 2. Packet processing flow */}
      <figure className="diagram-figure">
        <figcaption>Packet processing flow — from socket to process</figcaption>
        <div className="diagram-wrap">
          <svg viewBox="0 0 580 120" className="diagram-svg" aria-hidden="true">
            <defs>
              <marker id="arrow2" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="currentColor" />
              </marker>
            </defs>
            <rect x="10" y="40" width="88" height="40" rx="4" className="diagram-box diagram-step" />
            <text x="54" y="65" className="diagram-text diagram-text-center">recvfrom</text>
            <path d="M98 60 L122 60" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow2)" />
            <rect x="122" y="40" width="70" height="40" rx="4" className="diagram-box diagram-step" />
            <text x="157" y="65" className="diagram-text diagram-text-center">copy</text>
            <path d="M192 60 L216 60" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow2)" />
            <rect x="216" y="40" width="88" height="40" rx="4" className="diagram-box diagram-step" />
            <text x="260" y="65" className="diagram-text diagram-text-center">push_packet</text>
            <path d="M304 60 L328 60" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow2)" />
            <rect x="328" y="40" width="72" height="40" rx="4" className="diagram-box diagram-queue" />
            <text x="364" y="65" className="diagram-text diagram-text-center">Queue</text>
            <path d="M400 60 L424 60" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow2)" />
            <rect x="424" y="40" width="78" height="40" rx="4" className="diagram-box diagram-step" />
            <text x="463" y="65" className="diagram-text diagram-text-center">pop_packet</text>
            <path d="M502 60 L526 60" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow2)" />
            <rect x="526" y="40" width="44" height="40" rx="4" className="diagram-box diagram-step" />
            <text x="548" y="58" className="diagram-text diagram-text-center">process</text>
            <text x="548" y="72" className="diagram-text diagram-text-center">_packet</text>
            <text x="54" y="105" className="diagram-text diagram-text-tiny diagram-text-center">listener</text>
            <text x="364" y="105" className="diagram-text diagram-text-tiny diagram-text-center">shared</text>
            <text x="548" y="105" className="diagram-text diagram-text-tiny diagram-text-center">worker</text>
          </svg>
        </div>
      </figure>

      {/* 3. Validation order flowchart */}
      <figure className="diagram-figure">
        <figcaption>Validation order in process_packet — strict order before trusting payload</figcaption>
        <div className="diagram-wrap diagram-wide">
          <svg viewBox="0 0 520 380" className="diagram-svg" aria-hidden="true">
            <defs>
              <marker id="arrow3" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="currentColor" />
              </marker>
            </defs>
            {/* Start */}
            <rect x="210" y="8" width="100" height="28" rx="14" className="diagram-box diagram-start" />
            <text x="260" y="27" className="diagram-text diagram-text-center">Start</text>
            <path d="M260 36 L260 52" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#arrow3)" />
            <rect x="200" y="52" width="120" height="32" rx="4" className="diagram-box diagram-step" />
            <text x="260" y="72" className="diagram-text diagram-text-center">1. Size cap check</text>
            <path d="M260 84 L260 100" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#arrow3)" />
            <rect x="200" y="100" width="120" height="32" rx="4" className="diagram-box diagram-step" />
            <text x="260" y="120" className="diagram-text diagram-text-center">2. Min size ≥ header?</text>
            <path d="M260 132 L260 148" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#arrow3)" />
            <rect x="200" y="148" width="120" height="32" rx="4" className="diagram-box diagram-step" />
            <text x="260" y="168" className="diagram-text diagram-text-center">3. Parse header</text>
            <text x="260" y="180" className="diagram-text diagram-text-tiny diagram-text-center">(ntohl / ntohs)</text>
            <path d="M260 180 L260 196" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#arrow3)" />
            <rect x="200" y="196" width="120" height="32" rx="4" className="diagram-box diagram-step" />
            <text x="260" y="216" className="diagram-text diagram-text-center">4. Magic word OK?</text>
            <path d="M260 228 L260 244" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#arrow3)" />
            <rect x="200" y="244" width="120" height="32" rx="4" className="diagram-box diagram-step" />
            <text x="260" y="264" className="diagram-text diagram-text-center">5. Length consistent?</text>
            <path d="M260 276 L260 292" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#arrow3)" />
            <rect x="200" y="292" width="120" height="32" rx="4" className="diagram-box diagram-step" />
            <text x="260" y="312" className="diagram-text diagram-text-center">6. Checksum OK?</text>
            <path d="M260 324 L260 340" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#arrow3)" />
            <rect x="180" y="340" width="160" height="32" rx="4" className="diagram-box diagram-ok" />
            <text x="260" y="360" className="diagram-text diagram-text-center">7. Decrypt & update stats</text>
            {/* Fail path: drop */}
            <path d="M320 116 L400 116 L400 358 L340 358" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" markerEnd="url(#arrow3)" opacity="0.7" />
            <text x="355" y="110" className="diagram-text diagram-text-tiny">fail → drop</text>
            <rect x="380" y="268" width="72" height="28" rx="4" className="diagram-box diagram-drop" />
            <text x="416" y="286" className="diagram-text diagram-text-tiny diagram-text-center">drop</text>
            <text x="416" y="345" className="diagram-text diagram-text-tiny diagram-text-center">dropped_packets++</text>
          </svg>
        </div>
      </figure>

      {/* 4. Producer–consumer sync */}
      <figure className="diagram-figure">
        <figcaption>Producer–consumer synchronization — mutex and condition variable</figcaption>
        <div className="diagram-wrap">
          <svg viewBox="0 0 440 160" className="diagram-svg" aria-hidden="true">
            <defs>
              <marker id="arrow4" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="currentColor" />
              </marker>
            </defs>
            <rect x="20" y="50" width="100" height="60" rx="4" className="diagram-box diagram-producer" />
            <text x="70" y="78" className="diagram-text diagram-text-center">Listener</text>
            <text x="70" y="98" className="diagram-text diagram-text-tiny diagram-text-center">lock → push</text>
            <text x="70" y="108" className="diagram-text diagram-text-tiny diagram-text-center">→ notify_one()</text>
            <rect x="170" y="50" width="100" height="60" rx="4" className="diagram-box diagram-queue" />
            <text x="220" y="75" className="diagram-text diagram-text-center">g_queue_mutex</text>
            <text x="220" y="92" className="diagram-text diagram-text-center">g_queue_cv</text>
            <text x="220" y="108" className="diagram-text diagram-text-tiny diagram-text-center">g_packet_queue</text>
            <rect x="320" y="50" width="100" height="60" rx="4" className="diagram-box diagram-worker" />
            <text x="370" y="78" className="diagram-text diagram-text-center">Workers</text>
            <text x="370" y="98" className="diagram-text diagram-text-tiny diagram-text-center">wait(lock,</text>
            <text x="370" y="108" className="diagram-text diagram-text-tiny diagram-text-center">predicate)</text>
            <path d="M120 80 L170 80" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow4)" />
            <path d="M270 80 L320 80" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrow4)" />
            <text x="70" y="140" className="diagram-text diagram-text-tiny diagram-text-center">lock_guard</text>
            <text x="220" y="140" className="diagram-text diagram-text-tiny diagram-text-center">shared</text>
            <text x="370" y="140" className="diagram-text diagram-text-tiny diagram-text-center">unique_lock</text>
          </svg>
        </div>
      </figure>
    </div>
  );
}
