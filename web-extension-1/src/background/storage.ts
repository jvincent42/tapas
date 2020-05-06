/* -- Simple Storage --------------------------------------------------- */

export interface LocalStorage {
  [index: string]: {
    counter: number;
    port: browser.runtime.Port;
  };
}

export const initializeTabData = (storage: LocalStorage, tabId: number, port: browser.runtime.Port): LocalStorage =>
  Object.assign({}, storage, {
    [tabId]: {
      counter: 0,
      port: port,
    },
  });

export const updateTabPort = (storage: LocalStorage, tabId: number, port: browser.runtime.Port): LocalStorage =>
  Object.assign({}, storage, {
    [tabId]: {
      ...storage[tabId],
      port: port,
    },
  });

export const incrementTabCounter = (storage: LocalStorage, tabId: number): LocalStorage =>
  Object.assign({}, storage, {
    [tabId]: {
      ...storage[tabId],
      counter: storage[tabId].counter + 1,
    },
  });

/* ------------------------------------------------------------------------- */
