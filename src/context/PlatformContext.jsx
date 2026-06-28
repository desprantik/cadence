import { createContext, useContext, useEffect, useState } from 'react';
import { getMarketplacePlatform } from '../data/platformMarketplace';
import {
  createPlatformFromCatalog,
  defaultPlatforms,
  loadPlatforms,
  savePlatforms,
} from '../data/platforms';

const PlatformContext = createContext(null);

export function PlatformProvider({ children }) {
  const [platforms, setPlatforms] = useState(loadPlatforms);
  const [authModalPlatformId, setAuthModalPlatformId] = useState(null);
  const [manualConnectPlatformId, setManualConnectPlatformId] = useState(null);
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);
  const [syncingId, setSyncingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    savePlatforms(platforms);
  }, [platforms]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const ensureInstalled = (id) => {
    const catalog = getMarketplacePlatform(id);
    setPlatforms((prev) => {
      if (prev.some((p) => p.id === id)) return prev;
      if (!catalog) return prev;
      return [...prev, createPlatformFromCatalog(catalog)];
    });
  };

  const authPlatform = platforms.find((p) => p.id === authModalPlatformId) ?? null;
  const manualPlatform = platforms.find((p) => p.id === manualConnectPlatformId) ?? null;

  const openMarketplace = () => setMarketplaceOpen(true);
  const closeMarketplace = () => setMarketplaceOpen(false);

  const startConnect = (id) => {
    ensureInstalled(id);
    setMarketplaceOpen(false);
    setAuthModalPlatformId(id);
  };

  const startManualConnect = (id) => {
    ensureInstalled(id);
    setMarketplaceOpen(false);
    setManualConnectPlatformId(id);
  };

  const cancelConnect = () => setAuthModalPlatformId(null);
  const cancelManualConnect = () => setManualConnectPlatformId(null);

  const completeConnect = (id, meta) => {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              connected: true,
              lastSynced: new Date().toISOString(),
              connectedAccount: meta.connectedAccount,
              authMethod: meta.authMethod,
              authLabel: meta.authLabel,
              mcpTools: meta.mcpTools,
              syncedCourses: meta.syncedCourses,
              coursesInProgress: meta.coursesInProgress,
              coursesCompleted: meta.coursesCompleted,
              connectionMode: 'mcp',
            }
          : p
      )
    );
    setAuthModalPlatformId(null);
    setToast('Platform connected via MCP');
  };

  const completeManualConnect = (id, meta) => {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              connected: true,
              lastSynced: new Date().toISOString(),
              connectedAccount: meta.connectedAccount,
              authMethod: meta.authMethod,
              authLabel: meta.authLabel,
              mcpTools: meta.mcpTools,
              syncedCourses: meta.syncedCourses,
              coursesInProgress: meta.coursesInProgress,
              coursesCompleted: meta.coursesCompleted,
              connectionMode: 'manual',
              manualSourceUrl: meta.manualSourceUrl,
              manualNote: meta.manualNote,
            }
          : p
      )
    );
    setManualConnectPlatformId(null);
    setToast('Platform added manually');
  };

  const disconnect = (id) => {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              connected: false,
              lastSynced: null,
              connectedAccount: null,
              authMethod: null,
              authLabel: null,
              mcpTools: null,
              syncedCourses: null,
              coursesInProgress: null,
              coursesCompleted: null,
              connectionMode: null,
              manualSourceUrl: null,
              manualNote: null,
            }
          : p
      )
    );
    setToast('Platform disconnected');
  };

  const syncNow = (id) => {
    const platform = platforms.find((p) => p.id === id);
    if (!platform?.connected) return;
    if (platform.connectionMode === 'manual') {
      setToast(`${platform.name} updated — manual entry`);
      return;
    }

    setSyncingId(id);
    setTimeout(() => {
      setPlatforms((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, lastSynced: new Date().toISOString() } : p
        )
      );
      setSyncingId(null);
      setToast(`${platform.name} synced via MCP`);
    }, 1200);
  };

  const removePlatform = (id) => {
    const platform = platforms.find((p) => p.id === id);
    if (!platform) return;

    setPlatforms((prev) => prev.filter((p) => p.id !== id));
    setToast(`${platform.name} removed from connections`);
  };

  const reset = () => setPlatforms(defaultPlatforms);

  return (
    <PlatformContext.Provider
      value={{
        platforms,
        authPlatform,
        manualPlatform,
        marketplaceOpen,
        syncingId,
        toast,
        openMarketplace,
        closeMarketplace,
        startConnect,
        startManualConnect,
        cancelConnect,
        cancelManualConnect,
        completeConnect,
        completeManualConnect,
        disconnect,
        syncNow,
        removePlatform,
        reset,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatforms() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatforms requires PlatformProvider');
  return ctx;
}
