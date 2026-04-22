import React, { useState } from 'react';

export default function TreeNode({ node, onSelect, level = 0, openFolders = [] }) {
  const [open, setOpen] = useState(false);
  const indent = level * 20;
  const showIndentLine = level > 0;
  // Synchronise l'état open avec openFolders
  React.useEffect(() => {
    if (node.slug) {
      setOpen(openFolders.includes(node.slug));
    }
  }, [node.slug, openFolders]);

  if (node.children) {
    return (
      <div className="resource-folder" style={{ marginLeft: indent, position: 'relative' }}>
        {showIndentLine && (
          <div style={{ position: 'absolute', left: -8, top: 0, bottom: 0, width: 0, borderLeft: '2px solid #e0e0e0', height: '100%' }} />
        )}
        <div className="resource-indent" style={{ display: 'flex', alignItems: 'center' }}>
          <div className="resource-folder-title" onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ display: 'inline-block', width: 12 }} />
              <i className="fas fa-folder" style={{ marginRight: 8, color: '#fbc02d', fontSize: '1rem' }} />
              {node.name}
            </span>
            <i className={open ? "fas fa-chevron-down" : "fas fa-chevron-right"} style={{ marginLeft: 8, color: '#888' }} />
          </div>
        </div>
        {open && node.children.map((child, i) => (
          <TreeNode key={i} node={child} onSelect={onSelect} level={level + 1} openFolders={openFolders} />
        ))}
      </div>
    );
  }
  const isZip = node.path && node.path.toLowerCase().endsWith('.zip');
  const fileIcon = isZip ? 'fa-file-archive' : 'fa-file-pdf';
  const iconColor = isZip ? '#ff6f00' : '#d32f2f';

  return (
    <div className="resource-file" onClick={() => onSelect(node)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.95rem', marginLeft: indent, position: 'relative' }}>
      {showIndentLine && (
        <div style={{ position: 'absolute', left: -8, top: 0, bottom: 0, width: 0, borderLeft: '2px solid #e0e0e0', height: '100%' }} />
      )}
      <span style={{ display: 'flex', alignItems: '' }}>
        <span style={{ display: 'inline-block', width: 12 }} />
        <i className={`fas ${fileIcon}`} style={{ marginRight: 6, marginTop: 4, color: iconColor, fontSize: '1rem' }} />
        <span style={{ fontSize: '0.97rem' }}>{node.title || node.name}</span>
      </span>
    </div>
  );
}
