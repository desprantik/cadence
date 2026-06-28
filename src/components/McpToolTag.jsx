import { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getToolDescription } from '../data/mcpToolDescriptions';

const POPOVER_WIDTH = 260;
const GAP = 6;

function clampLeft(left) {
  const padding = 12;
  return Math.max(
    padding,
    Math.min(left, window.innerWidth - POPOVER_WIDTH - padding)
  );
}

export default function McpToolTag({ tool }) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, placement: 'below' });

  const description = getToolDescription(tool);

  const updatePosition = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove = spaceBelow < 100 && rect.top > 100;

    setPosition({
      top: placeAbove ? rect.top - GAP : rect.bottom + GAP,
      left: clampLeft(rect.left),
      placement: placeAbove ? 'above' : 'below',
    });
  }, []);

  const show = () => {
    updatePosition();
    setOpen(true);
  };

  const hide = () => setOpen(false);

  return (
    <>
      <span
        ref={anchorRef}
        className="platform-tool-tags__tag"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        tabIndex={0}
        aria-describedby={open ? `mcp-tool-tip-${tool}` : undefined}
      >
        {tool}
      </span>
      {open &&
        createPortal(
          <div
            id={`mcp-tool-tip-${tool}`}
            className={`mcp-tool-popover mcp-tool-popover--${position.placement}`}
            style={{
              top: position.placement === 'below' ? position.top : undefined,
              bottom:
                position.placement === 'above'
                  ? window.innerHeight - position.top
                  : undefined,
              left: position.left,
              width: POPOVER_WIDTH,
            }}
            role="tooltip"
            onMouseEnter={show}
            onMouseLeave={hide}
          >
            <p className="mcp-tool-popover__name">{tool}</p>
            <p className="mcp-tool-popover__desc">{description}</p>
          </div>,
          document.body
        )}
    </>
  );
}
