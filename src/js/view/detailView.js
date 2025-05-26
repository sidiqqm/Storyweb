const detailView = {
  render(story) {
    const container = document.createElement("div");
    container.id = "main-content";
    container.tabIndex = 0;

    const createdDate = new Date(story.createdAt).toLocaleDateString("id-ID");
    const osmLink = `https://www.openstreetmap.org/?mlat=${story.lat}&mlon=${story.lon}#map=15/${story.lat}/${story.lon}`;

    container.innerHTML = `
      <div class="detail-container">
        <h2>${story.name}</h2>
        <p class="story-date">🕒 Dibuat pada: ${createdDate}</p>
        <img src="${story.photoUrl}" alt="Foto oleh ${story.name}" style="max-width: 100%; max-height: 400px; border-radius: 12px;" />
        <p style="margin-top: 1rem;">${story.description}</p>
        <div id="map" style="width: 100%; height: 300px; margin-top: 1rem;"></div>
        <p><a href="${osmLink}" target="_blank" rel="noopener">🌍 Lihat di Peta Besar</a></p>
        <button onclick="window.history.back()" class="btn btn-secondary">⬅ Kembali</button>
      </div>
    `;

    const app = document.getElementById("app");
    app.innerHTML = "";
    app.appendChild(container);

    setTimeout(() => {
      if (story.lat && story.lon) {
        const map = L.map("map").setView([story.lat, story.lon], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(
          `<strong>${story.name}</strong><br>${story.description}`
        );
      }
    }, 0);
  },

  renderError(message) {
    const container = document.createElement("div");
    container.id = "main-content";

    container.innerHTML = `
    <div class="error-container">
      <h2>😕 Oops!</h2>
      <p class="error-message">${message}</p>
      ${
        !navigator.onLine
          ? `<p>Silakan periksa koneksi internet Anda dan coba lagi.</p>`
          : ""
      }
      <button onclick="window.history.back()" class="btn btn-secondary">
        ⬅ Kembali
      </button>
    </div>
  `;

    const app = document.getElementById("app");
    app.innerHTML = "";
    app.appendChild(container);
  },
};

export default detailView;
