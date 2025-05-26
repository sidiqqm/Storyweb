import { getStoryById, getToken } from "../model/api.js";
import detailView from "../view/detailView.js";
import offlineStoryDummy from "../model/offlineFallback.js";

const detailPresenter = {
  async init(container) {
    const token = getToken();
    if (!token) {
      alert("Anda harus login terlebih dahulu!");
      window.location.hash = "#/login";
      return;
    }

    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const storyId = params.get('id');

    if (!storyId) {
      detailView.renderError("ID cerita tidak ditemukan.");
      return;
    }

    try {
      const story = await getStoryById(storyId, token);
      detailView.render(story);
    } catch (err) {
      console.warn("Offline atau gagal fetch API, menggunakan dummy:", err.message);
      // Gunakan data dummy jika fetch gagal
      detailView.render(offlineStoryDummy);
    }
  },
};

export default detailPresenter;
