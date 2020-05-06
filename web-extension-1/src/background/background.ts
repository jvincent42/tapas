import { LocalStorage, initializeTabData, updateTabPort, incrementTabCounter } from './storage';

let simpleStorage: LocalStorage = {};

/* ------------------------------------------------------------------------- */

const tabExists = (storage: LocalStorage, tabId: number) => storage[tabId] !== undefined;

const publishTabCounter = (storage: LocalStorage, tabId: number) => {
  const currentTab = storage[tabId];
  currentTab.port.postMessage({ counter: currentTab.counter });
};

/* ------------------------------------------------------------------------- */

const handleContentScriptConnection = (
  storage: LocalStorage,
  tabId: number,
  port: browser.runtime.Port,
): LocalStorage => {
  let newStorage;
  if (tabExists(storage, tabId)) {
    newStorage = updateTabPort(storage, tabId, port);
  } else {
    newStorage = initializeTabData(storage, tabId, port);
  }
  publishTabCounter(newStorage, tabId);
  return newStorage;
};

/* ------------------------------------------------------------------------- */

const handlePopupClick = (storage: LocalStorage, tabId: number): LocalStorage => {
  let newStorage = storage;
  if (tabExists(storage, tabId)) {
    newStorage = incrementTabCounter(storage, tabId);
    publishTabCounter(newStorage, tabId);
  }
  return newStorage;
};

/* ------------------------------------------------------------------------- */

const handleConnections = async (port: browser.runtime.Port) => {
  const [activeTab] = await browser.tabs.query({ currentWindow: true, active: true });

  if (activeTab && activeTab.id) {
    if (port.name === 'content_script/lifecycle') {
      simpleStorage = handleContentScriptConnection(simpleStorage, activeTab.id, port);
    }
    if (port.name === 'popup') {
      simpleStorage = handlePopupClick(simpleStorage, activeTab.id);
    }
  }
};

const setupBackground = async () => {
  browser.runtime.onConnect.addListener(handleConnections);
};

browser.runtime.onInstalled.addListener(setupBackground);
