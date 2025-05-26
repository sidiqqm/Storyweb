// src/presenter/addStoryPresenter.js

import addStoryView from '../view/addStoryView.js';
import { postStory } from '../model/api.js';
import { dbHelper } from '../utils/indexedDb.js';

const addStoryPresenter = {
  async init(container) {
    addStoryView.render(container);
    addStoryView.bindSubmit(this.handleSubmit.bind(this));
    
    // Cek koneksi dan sinkronkan data pending jika online
    if (navigator.onLine) {
      this.syncPendingStories();
    }
  },

  async handleSubmit({ description, imageBlob, lat, lon }) {
    if (!description || !imageBlob || lat === null || lon === null) {
      alert('Pastikan semua data diisi, foto diambil, dan lokasi dipilih.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Silakan login terlebih dahulu.');
      window.location.hash = '#/login';
      return;
    }

    const storyData = {
      description,
      imageBlob,
      lat,
      lon,
      token
    };

    if (navigator.onLine) {
      await this.postStoryOnline(storyData);
    } else {
      await this.saveStoryOffline(storyData);
    }
  },

  async postStoryOnline({ description, imageBlob, lat, lon, token }) {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', imageBlob, 'photo.jpg');
    formData.append('lat', lat);
    formData.append('lon', lon);

    try {
      await postStory(token, formData);
      alert('Cerita berhasil ditambahkan!');
      window.location.hash = '#/stories';
    } catch (error) {
      alert('Gagal menambahkan cerita: ' + error.message);
    }
  },

  async saveStoryOffline(storyData) {
    try {
      // Konversi blob ke base64 untuk penyimpanan di IndexedDB
      const base64Image = await this.blobToBase64(storyData.imageBlob);
      
      const pendingStory = {
        description: storyData.description,
        photo: base64Image,
        lat: storyData.lat,
        lon: storyData.lon,
        token: storyData.token
      };

      await dbHelper.addPendingStory(pendingStory);
      alert('Cerita disimpan secara offline dan akan dikirim saat koneksi tersedia.');
      window.location.hash = '#/stories';
    } catch (error) {
      console.error('Gagal menyimpan cerita offline:', error);
      alert('Gagal menyimpan cerita offline. Silakan coba lagi.');
    }
  },

  async syncPendingStories() {
    try {
      const pendingStories = await dbHelper.getAllPendingStories();
      
      for (const story of pendingStories) {
        try {
          // Konversi base64 kembali ke blob
          const blob = await this.base64ToBlob(story.photo, 'image/jpeg');
          
          const formData = new FormData();
          formData.append('description', story.description);
          formData.append('photo', blob, 'photo.jpg');
          formData.append('lat', story.lat);
          formData.append('lon', story.lon);

          await postStory(story.token, formData);
          
          // Hapus dari IndexedDB setelah berhasil dikirim
          await dbHelper.deletePendingStory(story.id);
        } catch (error) {
          console.error(`Gagal mengirim cerita pending ID ${story.id}:`, error);
          // Lanjut ke cerita berikutnya meskipun ada yang gagal
          continue;
        }
      }
      
      if (pendingStories.length > 0) {
        console.log(`${pendingStories.length} cerita offline berhasil disinkronkan.`);
      }
    } catch (error) {
      console.error('Gagal sinkronisasi cerita offline:', error);
    }
  },

  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  },

  base64ToBlob(base64, contentType = '') {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  },

  destroy() {
    if (typeof addStoryView.destroy === 'function') {
      addStoryView.destroy();
    }
  }
};

export default addStoryPresenter;