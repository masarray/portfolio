// @ts-nocheck
import React, { useRef, useState } from 'react';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function DockIconArt({ id, app }) {
  return (
    <span className={`dock-glyph dock-art dock-art-${id}`} aria-hidden="true">
      {id === 'finder' && <><i className="finder-face-left" /><i className="finder-face-right" /><b /></>}
      {id === 'systems' && <><i className="system-core" /><b /></>}
      {id === 'terminal' && <><em>›_</em></>}
      {id === 'messages' && <><i className="message-bubble" /></>}
      {id === 'mail' && <><i className="mail-flap" /></>}
      {id === 'youtube' && <><i className="youtube-play" /></>}
      {id === 'github' && <><em>GH</em></>}
      {id === 'notes' && <><i className="notes-lines" /></>}
      {!['finder', 'systems', 'terminal', 'messages', 'mail', 'youtube', 'github', 'notes'].includes(id) && <em>{app.glyph}</em>}
    </span>
  );
}

export default function Dock({ apps, order, openApp, activeIds, minimizedIds, clearDesktop }) {
  const [mouseX, setMouseX] = useState(null);
  const [hoverId, setHoverId] = useState(null);
  const iconRefs = useRef({});
  const trashRef = useRef(null);

  const metricsFor = (id, ref) => {
    if (mouseX === null || !ref?.current) return { scale: 1, lift: 0 };
    const rect = ref.current.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const distance = Math.abs(mouseX - center);
    const influence = clamp(1 - distance / 122, 0, 1);
    const eased = influence * influence * (3 - 2 * influence);
    return {
      scale: 1 + eased * 0.68,
      lift: -eased * 22
    };
  };

  return (
    <nav className="dock-wrap" aria-label="Application dock">
      <div
        className="dock-shelf"
        onMouseMove={(event) => setMouseX(event.clientX)}
        onMouseLeave={() => {
          setMouseX(null);
          setHoverId(null);
        }}
      >
        {order.map((id) => {
          const app = apps[id];
          const isActive = activeIds.includes(id);
          const isMinimized = minimizedIds.includes(id);
          if (!iconRefs.current[id]) iconRefs.current[id] = React.createRef();
          const { scale, lift } = metricsFor(id, iconRefs.current[id]);

          return (
            <button
              key={id}
              ref={iconRefs.current[id]}
              className={`dock-icon ${isActive ? 'is-active' : ''} ${isMinimized ? 'is-minimized' : ''}`}
              onMouseEnter={() => setHoverId(id)}
              onFocus={() => setHoverId(id)}
              onClick={() => openApp(id)}
              style={{ transform: `translateY(${lift}px) scale(${scale})` }}
              aria-label={`Open ${app.title}`}
            >
              <span className={`dock-tooltip ${hoverId === id ? 'is-visible' : ''}`}>{app.short}</span>
              <DockIconArt id={id} app={app} />
              <span className="dock-dot" />
            </button>
          );
        })}
        <span className="dock-divider" />
        {(() => {
          if (!trashRef.current) trashRef.current = React.createRef();
          const { scale, lift } = metricsFor('trash', trashRef.current);
          return (
            <button
              ref={trashRef.current}
              className="dock-icon trash-icon"
              onClick={clearDesktop}
              onMouseEnter={() => setHoverId('trash')}
              onFocus={() => setHoverId('trash')}
              style={{ transform: `translateY(${lift}px) scale(${scale})` }}
              aria-label="Clear desktop"
            >
              <span className={`dock-tooltip ${hoverId === 'trash' ? 'is-visible' : ''}`}>Desktop</span>
              <span className="dock-glyph trash-glyph"><i /></span>
            </button>
          );
        })()}
      </div>
    </nav>
  );
}
