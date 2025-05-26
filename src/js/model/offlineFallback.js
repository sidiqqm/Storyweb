// src/model/offlineFallback.js
const offlineStoryDummy = {
  id: "offline-story-id",
  name: "Cerita Offline",
  description: "Anda sedang offline. Ini adalah cerita dummy yang ditampilkan sebagai fallback.",
  photoUrl: "https://via.placeholder.com/600x400?text=Offline+Image",
  createdAt: new Date().toISOString(),
  lat: -6.200000,
  lon: 106.816666,
};

export default offlineStoryDummy;
