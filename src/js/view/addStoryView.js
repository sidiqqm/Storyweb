const addStoryView = {
  render(container) {
    container.innerHTML = `
      <main id="main-content">
        <h2>Bagikan Ceritamu</h2>
        <form id="addStoryForm" class="story-form">
          <label for="description">Masukkan Deskripsi:</label>
          <textarea id="description" required aria-required="true"></textarea>

          <label for="video">📷 Ambil Gambar dari Kamera:</label>
          <video id="video" width="300" autoplay playsinline style="display: none;"></video>
          <button type="button" id="captureBtn" class="button">📸 Ambil Foto</button>

          <canvas id="canvas" width="300" height="225" style="display: none;"></canvas>
          <img id="preview" alt="Pratinjau hasil foto" style="max-width: 300px; display: none;" />

          <fieldset>
            <legend>Pilih Lokasi</legend>
            <div id="mapPicker" style="height: 300px;"></div>
            <p>🌐 Koordinat Terpilih: <strong>Latitude:</strong> <span id="latDisplay">-</span> | <strong>Longitude:</strong> <span id="lonDisplay">-</span></p>
          </fieldset>

          <button type="submit" class="button submit-btn">Tambahkan Cerita</button>
        </form>
      </main>
    `;

    this.initCamera();
    this.initMap();
  },

  async initCamera() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const preview = document.getElementById("preview");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.stream = stream;
      video.srcObject = stream;
      video.style.display = 'block';

      const captureBtn = document.getElementById("captureBtn");
      captureBtn.addEventListener("click", () => {
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          preview.src = URL.createObjectURL(blob);
          preview.style.display = "block";
          preview.blob = blob;

          // Stop kamera setelah ambil foto
          if (this.stream) {
            this.stream.getTracks().forEach((track) => track.stop());
            this.stream = null;
          }

          video.srcObject = null;
          video.style.display = "none";
        }, "image/jpeg");
      });
    } catch (err) {
      alert("Tidak bisa mengakses kamera: " + err.message);
    }
  },

  initMap() {
    this.selectedLat = null;
    this.selectedLon = null;

    const map = L.map("mapPicker").setView([-6.2, 106.8], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    let marker;
    map.on("click", (e) => {
      this.selectedLat = e.latlng.lat;
      this.selectedLon = e.latlng.lng;

      document.getElementById("latDisplay").textContent = this.selectedLat.toFixed(5);
      document.getElementById("lonDisplay").textContent = this.selectedLon.toFixed(5);

      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng).addTo(map);
      }
    });
  },

  bindSubmit(handler) {
    document.getElementById("addStoryForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const description = document.getElementById("description").value;
      const preview = document.getElementById("preview");
      const imageBlob = preview.blob;
      const lat = this.selectedLat;
      const lon = this.selectedLon;
      handler({ description, imageBlob, lat, lon });
    });
  },

  destroy() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    const video = document.getElementById("video");
    if (video && video.srcObject) {
      video.srcObject.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
  }
};
export default addStoryView;
