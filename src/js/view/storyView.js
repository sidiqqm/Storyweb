
import { dbHelper } from '../utils/indexedDb.js';

const storyView = {
  render(stories, pendingStories = []) {
    const container = document.createElement("div");
    container.id = "main-content";
    container.tabIndex = 0;

    const listContainer = document.createElement("ul");

    if (stories.length === 0 && pendingStories.length === 0) {
      const noStoriesMessage = document.createElement("p");
      noStoriesMessage.textContent = "Tidak ada cerita untuk ditampilkan.";
      listContainer.appendChild(noStoriesMessage);
    } else {
      // Render cerita online
      stories.forEach((story, index) => {
        listContainer.appendChild(this.createStoryCard(story, index, false));
      });

      // Render cerita pending (offline)
      pendingStories.forEach((story, index) => {
        listContainer.appendChild(this.createStoryCard(story, index + stories.length, true));
      });
    }

    container.appendChild(listContainer);

    const app = document.getElementById("app");
    app.innerHTML = "";
    app.appendChild(container);
  },

  createStoryCard(story, index, isPending) {
    const storyItem = document.createElement("li");
    storyItem.classList.add("story-card");
    if (isPending) storyItem.classList.add("pending-story");

    const mapId = `map-${index}`;
    const osmLink = isPending ? '#' : `https://www.openstreetmap.org/?mlat=${story.lat}&mlon=${story.lon}#map=15/${story.lat}/${story.lon}`;
    const createdDate = new Date(story.createdAt).toLocaleDateString("id-ID");

    // Untuk cerita pending, gunakan placeholder name
    const name = isPending ? 'Anda' : story.name;
    
    storyItem.innerHTML = `
      <div class="story-container">
        <h3>${name} ${isPending ? '<span class="pending-badge">(Pending)</span>' : ''}</h3>
        <p class="story-date">🕒 Dibuat pada: ${createdDate}</p>
        <div class="story-flex">
          <div class="story-photo">
            <img 
              src="${isPending ? `data:image/jpeg;base64,${story.photo}` : story.photoUrl}" 
              alt="Foto dari cerita oleh ${name}" 
              style="max-width: 350px; max-height: 350px;" 
            />
          </div>
          ${story.lat && story.lon ? `
            <div class="story-map">
              <div id="${mapId}" class="map-box" aria-label="Peta lokasi cerita"></div>
              <p><a href="${osmLink}" target="_blank" rel="noopener">🌍 ${isPending ? 'Lokasi dipilih' : 'Lihat di Peta Besar'}</a></p>
            </div>
          ` : ''}
        </div>
        <div class="story-desc">
          <p>${story.description}</p>
        </div>
        ${isPending ? `
          <button class="btn btn-danger delete-pending" data-id="${story.id}">Hapus Cerita Pending</button>
        ` : `
          <button class="btn btn-primary" onclick="window.location.hash='#/detail?id=${story.id}'">Baca Selengkapnya</button>
        `}
      </div>
    `;

    // Tambahkan event listener untuk tombol hapus
    if (isPending) {
      const deleteBtn = storyItem.querySelector('.delete-pending');
      deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = parseInt(deleteBtn.dataset.id);
        const confirmed = confirm('Apakah Anda yakin ingin menghapus cerita pending ini?');
        if (confirmed) {
          try {
            await dbHelper.deletePendingStory(id);
            storyItem.remove();
            alert('Cerita pending berhasil dihapus.');
          } catch (error) {
            alert('Gagal menghapus cerita pending: ' + error.message);
          }
        }
      });
    }

    // Inisialisasi peta jika ada koordinat
    if (story.lat && story.lon) {
      setTimeout(() => {
        const map = L.map(mapId).setView([story.lat, story.lon], 13);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`<strong>${name}</strong><br>${story.description}`);

        // Nonaktifkan interaksi untuk peta kecil
        map.scrollWheelZoom.disable();
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();

        storyItem.addEventListener("click", () => {
          marker.openPopup();
          map.setView([story.lat, story.lon], 13);
        });
      }, 0);
    }

    return storyItem;
  },

  renderError(message) {
    const container = document.createElement("div");
    container.id = "main-content";
    container.tabIndex = 0;

    const error = document.createElement("p");
    error.className = "error-message";
    error.textContent = message;

    container.appendChild(error);

    const app = document.getElementById("app");
    app.innerHTML = "";
    app.appendChild(container);
  },
};

export default storyView;