import { findIndex } from 'lodash';

const storeLimit = 8;
let HistoryStore = [];

export function UpdateHistoryStore(owner, repo_name, repo_id) {
  HistoryStore = localStorage.getItem('search_history') ? JSON.parse(localStorage.getItem('search_history')) : [];

  const entry = {
    avatar_url: owner.avatar_url,
    username: owner.login,
    repo_name,
    repo_id
  }

  //find index of entry within history
  const index = findIndex(HistoryStore, (o) => { return o.repo_id === repo_id });

  //check if repo_id exists, if it does, bubble that to the top
  if (index >= 0) {
    const tempEntry = HistoryStore[index];
    HistoryStore.splice(index, 1);
    HistoryStore.unshift(tempEntry);
  } else {
    HistoryStore.unshift(entry);
    if (HistoryStore.length > storeLimit) {
      HistoryStore.splice(-1, 1)
    }
  }

  return new Promise((resolve) => {
    localStorage.setItem('search_history', JSON.stringify(HistoryStore));
    resolve(HistoryStore);
  });
}

export function GetHistoryStore() {
  return localStorage.getItem('search_history') ? JSON.parse(localStorage.getItem('search_history')) : [];
}

export default { UpdateHistoryStore, GetHistoryStore }
