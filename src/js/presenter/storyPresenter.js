// src/presenter/storyPresenter.js

import { getStories } from "../model/api.js";
import { getToken } from "../model/api.js";
import storyView from "../view/storyView.js";
import { dbHelper } from "../utils/indexedDb.js";

const storyPresenter = {
  async init(container) {
    const token = getToken();
    if (!token) {
      alert("Anda harus login terlebih dahulu!");
      window.location.hash = "#/login";
      return;
    }

    try {
      let stories = [];
      let pendingStories = [];
      
      if (navigator.onLine) {
        stories = await getStories(token);
      } else {
        alert("Anda sedang offline. Hanya menampilkan cerita yang tersimpan secara lokal.");
      }
      
      // Selalu ambil cerita pending dari IndexedDB
      pendingStories = await dbHelper.getAllPendingStories();
      
      storyView.render(stories, pendingStories);
    } catch (error) {
      alert("Gagal memuat cerita: " + error.message);
    }
  },
};

export default storyPresenter;