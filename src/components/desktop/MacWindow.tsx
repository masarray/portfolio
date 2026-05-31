// @ts-nocheck
import React, { useRef } from 'react';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

const CONTROL_SELECTOR = '[data-window-control]';
const DRAG_THRESHOLD = 3;

export default function MacWindow({ windowItem, app, active, onFocus, onClose, onMinimize, onMaximize, onUpdate, children }) {
  const dragRef = useRef(null);

  const startDrag = (event) => {
    if (event.button !== 0 || windowItem.maximized) return;
    if (event.target.closest?.(CONTROL_SELECTOR)) return;

    onFocus();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: windowItem.x,
      y: windowItem.y,
      moved: false
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const moveDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    drag.moved = true;

    const nextX = clamp(drag.x + dx, 8, window.innerWidth - Math.min(180, windowItem.width * 0.3));
    const nextY = clamp(drag.y + dy, 38, window.innerHeight - 122);
    onUpdate({ x: nextX, y: nextY });
  };

  const endDrag = (event) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
      dragRef.current = null;
    }
  };

  const handleTitlebarDoubleClick = (event) => {
    if (event.target.closest?.(CONTROL_SELECTOR)) return;
    onMaximize();
  };

  const stopControlPointer = (event) => {
    event.stopPropagation();
  };

  const runControl = (fn) => (event) => {
    event.stopPropagation();
    fn();
  };

  return (
    <section
      className={`mac-window ${active ? 'is-focused' : ''} ${windowItem.maximized ? 'is-maximized' : ''}`}
      style={{
        left: windowItem.x,
        top: windowItem.y,
        width: windowItem.width,
        height: windowItem.height,
        zIndex: windowItem.z
      }}
      onPointerDown={onFocus}
    >
      <div
        className="window-titlebar"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={handleTitlebarDoubleClick}
      >
        <div className="traffic-lights" data-window-control onPointerDown={stopControlPointer} onMouseDown={stopControlPointer}>
          <button type="button" data-window-control className="traffic traffic-close" onPointerDown={stopControlPointer} onMouseDown={stopControlPointer} onClick={runControl(onClose)} aria-label="Close" />
          <button type="button" data-window-control className="traffic traffic-min" onPointerDown={stopControlPointer} onMouseDown={stopControlPointer} onClick={runControl(onMinimize)} aria-label="Minimize" />
          <button type="button" data-window-control className="traffic traffic-max" onPointerDown={stopControlPointer} onMouseDown={stopControlPointer} onClick={runControl(onMaximize)} aria-label="Maximize" />
        </div>
        <div className="window-title">
          <span className="tiny-app-dot" style={{ background: app?.color }} />
          {windowItem.title}
        </div>
        <div className="window-actions">•••</div>
      </div>
      <div className="window-body">{children}</div>
    </section>
  );
}
