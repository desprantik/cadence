import { useState } from 'react';
import McpToolTag from './McpToolTag';

const COLLAPSED_VISIBLE = 2;

export default function PlatformToolTags({ tools }) {
  const [expanded, setExpanded] = useState(false);

  if (!tools?.length) return null;

  const hiddenCount = Math.max(0, tools.length - COLLAPSED_VISIBLE);
  const visibleTools = expanded ? tools : tools.slice(0, COLLAPSED_VISIBLE);

  return (
    <div className={`platform-tool-tags${expanded ? ' platform-tool-tags--expanded' : ''}`}>
      <div className="platform-tool-tags__row">
        {visibleTools.map((tool) => (
          <McpToolTag key={tool} tool={tool} />
        ))}
        {!expanded && hiddenCount > 0 && (
          <button
            type="button"
            className="platform-tool-tags__more"
            onClick={() => setExpanded(true)}
            aria-expanded={false}
            aria-label={`Show ${hiddenCount} more MCP tools`}
          >
            +{hiddenCount}
          </button>
        )}
        {expanded && hiddenCount > 0 && (
          <button
            type="button"
            className="platform-tool-tags__more platform-tool-tags__more--less"
            onClick={() => setExpanded(false)}
            aria-expanded
            aria-label="Show fewer MCP tools"
          >
            Show less
          </button>
        )}
      </div>
    </div>
  );
}
