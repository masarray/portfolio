// @ts-nocheck
import React, { useEffect, useState } from 'react';

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDay(date) {
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function MenuBar({ activeApp, clearDesktop }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000 * 20);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <header className="menu-bar">
      <div className="menu-left">
        <button className="brand-mark" onClick={clearDesktop} aria-label="Show desktop">
          <span>A</span>
        </button>
        <strong>AriOS</strong>
        <button>{activeApp || 'Finder'}</button>
        <button>File</button>
        <button>View</button>
        <button>Window</button>
        <button>Help</button>
      </div>
      <div className="menu-right">
        <span className="system-icon">▣</span>
        <span className="system-icon">⌕</span>
        <span className="system-icon">◌</span>
        <span className="system-icon">▰</span>
        <span>{formatDay(now)}</span>
        <strong>{formatTime(now)}</strong>
      </div>
    </header>
  );
}
