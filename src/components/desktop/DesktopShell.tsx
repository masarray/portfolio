// @ts-nocheck
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { apps, dockOrder, owner, projects, servicePills } from '@/data/portfolio';
import LiveWallpaper from './LiveWallpaper';
import CursorEffects from './CursorEffects';
import MenuBar from './MenuBar';
import Dock from './Dock';
import MacWindow from './MacWindow';
import { AppContent } from './AppContent';

const STORAGE_KEY = 'ari-live-desktop-windows-v7';

function getInitialRoute() {
  const hash = window.location.hash.replace('#', '').trim();
  return apps[hash] ? hash : null;
}

function getSafePosition(app, offset = 0) {
  const base = app.defaultPosition || { x: 120, y: 100 };
  const maxX = Math.max(20, window.innerWidth - (app.defaultSize?.width || 820) - 24);
  const maxY = Math.max(52, window.innerHeight - (app.defaultSize?.height || 520) - 110);
  return {
    x: Math.min(base.x + offset, maxX),
    y: Math.min(base.y + offset, maxY)
  };
}

function getNextActiveWindowId(items) {
  const visible = items.filter((item) => !item.minimized);
  if (!visible.length) return null;
  return [...visible].sort((a, b) => b.z - a.z)[0]?.id ?? null;
}

export default function App() {
  const [windows, setWindows] = useState([]);
  const [activeApp, setActiveApp] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const zCounter = useRef(40);

  const nextZ = useCallback(() => {
    zCounter.current += 1;
    return zCounter.current;
  }, []);

  const visibleWindows = useMemo(() => windows.filter((item) => !item.minimized), [windows]);
  const hasVisibleWindows = visibleWindows.length > 0;

  const focusWindow = useCallback((id) => {
    const z = nextZ();
    setWindows((current) =>
      current.map((windowItem) =>
        windowItem.id === id ? { ...windowItem, z, minimized: false } : windowItem
      )
    );
    setActiveApp(id);
  }, [nextZ]);

  const openApp = useCallback((id) => {
    const app = apps[id];
    if (!app) return;

    const z = nextZ();
    setWindows((current) => {
      const existing = current.find((item) => item.id === id);
      if (existing) {
        return current.map((item) =>
          item.id === id ? { ...item, minimized: false, z } : item
        );
      }

      const position = getSafePosition(app, current.length * 18);
      return [
        ...current,
        {
          id,
          title: app.title,
          x: position.x,
          y: position.y,
          width: Math.min(app.defaultSize.width, window.innerWidth - 48),
          height: Math.min(app.defaultSize.height, window.innerHeight - 150),
          z,
          minimized: false,
          maximized: false
        }
      ];
    });

    setActiveApp(id);
    if (window.location.hash.replace('#', '') !== id) {
      window.history.replaceState(null, '', `#${id}`);
    }
  }, [nextZ]);

  const closeWindow = useCallback((id) => {
    setWindows((current) => {
      const next = current.filter((item) => item.id !== id);
      setActiveApp((currentActive) => (currentActive === id ? getNextActiveWindowId(next) : currentActive));
      return next;
    });

    if (window.location.hash.replace('#', '') === id) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  const minimizeWindow = useCallback((id) => {
    setWindows((current) => {
      const next = current.map((item) => (item.id === id ? { ...item, minimized: true } : item));
      setActiveApp((currentActive) => (currentActive === id ? getNextActiveWindowId(next) : currentActive));
      return next;
    });
  }, []);

  const toggleMaximize = useCallback((id) => {
    const z = nextZ();
    setWindows((current) =>
      current.map((item) => {
        if (item.id !== id) return item;
        if (item.maximized) {
          return {
            ...item,
            z,
            maximized: false,
            x: item.prev?.x ?? 120,
            y: item.prev?.y ?? 90,
            width: item.prev?.width ?? 820,
            height: item.prev?.height ?? 520
          };
        }
        return {
          ...item,
          z,
          maximized: true,
          prev: { x: item.x, y: item.y, width: item.width, height: item.height },
          x: 18,
          y: 46,
          width: window.innerWidth - 36,
          height: window.innerHeight - 142
        };
      })
    );
    setActiveApp(id);
  }, [nextZ]);

  const updateWindow = useCallback((id, patch) => {
    setWindows((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const clearDesktop = useCallback(() => {
    setWindows([]);
    setActiveApp(null);
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }, []);

  useEffect(() => {
    const route = getInitialRoute();
    if (route) {
      const timeout = window.setTimeout(() => openApp(route), 260);
      return () => window.clearTimeout(timeout);
    }
  }, [openApp]);

  useEffect(() => {
    const onHashChange = () => {
      const route = getInitialRoute();
      if (route) openApp(route);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [openApp]);

  useEffect(() => {
    try {
      const slim = windows.map(({ prev, ...rest }) => rest);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slim));
    } catch {
      // safe no-op
    }
  }, [windows]);

  return (
    <main className="desktop-root">
      <LiveWallpaper />
      <CursorEffects />
      <div className="desktop-vignette" />
      <MenuBar activeApp={activeApp ? apps[activeApp]?.short : 'Finder'} clearDesktop={clearDesktop} />

      <section className={`home-stage ${hasVisibleWindows ? 'home-stage--quiet' : ''}`} aria-hidden={hasVisibleWindows}>
        <div className="home-eyebrow">{owner.role}</div>
        <h1>{owner.headline} <span className="wave-hand">👋</span></h1>
        <p>{owner.subline}</p>
        <div className="home-pills">
          {servicePills.map((pill) => <span key={pill}>{pill}</span>)}
        </div>
        <div className="home-hint">↓ Click the dock below to open apps</div>
        <button className={`sound-button ${audioEnabled ? 'is-on' : ''}`} onClick={() => setAudioEnabled((v) => !v)} aria-label="Toggle ambient mode">
          {audioEnabled ? '◉' : '◌'}
        </button>
      </section>

      <div className="window-layer" aria-label="Desktop windows">
        {visibleWindows.map((windowItem) => (
          <MacWindow
            key={windowItem.id}
            windowItem={windowItem}
            app={apps[windowItem.id]}
            active={activeApp === windowItem.id}
            onFocus={() => focusWindow(windowItem.id)}
            onClose={() => closeWindow(windowItem.id)}
            onMinimize={() => minimizeWindow(windowItem.id)}
            onMaximize={() => toggleMaximize(windowItem.id)}
            onUpdate={(patch) => updateWindow(windowItem.id, patch)}
          >
            <AppContent appId={windowItem.id} openApp={openApp} projects={projects} owner={owner} />
          </MacWindow>
        ))}
      </div>

      <Dock
        apps={apps}
        order={dockOrder}
        openApp={openApp}
        activeIds={windows.filter((item) => !item.minimized).map((item) => item.id)}
        minimizedIds={windows.filter((item) => item.minimized).map((item) => item.id)}
        clearDesktop={clearDesktop}
      />
    </main>
  );
}
