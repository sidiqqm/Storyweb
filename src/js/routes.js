import RegisterPage from './pages/register-page.js';
import LoginPage from './pages/login-page.js';
import StoryPage from './pages/story-page.js';
import AddStoryPage from './pages/addStory-page.js';
import DetailPage from './pages/detail-page.js';

let currentPage = null;
// router.js

const routes = {
  '/register': () => new RegisterPage(),
  '/login': () => new LoginPage(),
  '/stories': () => new StoryPage(),
  '/add-story': () => new AddStoryPage(),
  '/detail': () => new DetailPage(),
  '/': () => new RegisterPage(),
};


export async function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('DOMContentLoaded', handleRoute);
}

function getRoute() {
  const hash = window.location.hash || '#/';
  const pathWithQuery = hash.slice(1);
  const [path] = pathWithQuery.split('?');
  return path;
}

function handleRoute() {
  const path = getRoute();
  const app = document.getElementById('app');

  if (currentPage && typeof currentPage.destroy === 'function') {
    currentPage.destroy();
  }

  const pageBuilder = routes[path];
  if (pageBuilder) {
    const page = pageBuilder();
    page.render(app);
    currentPage = page;
  } else {
    app.innerHTML = `<p>Halaman tidak ditemukan.</p>`;
    currentPage = null;
  }
}
