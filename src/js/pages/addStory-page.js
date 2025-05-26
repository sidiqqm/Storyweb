import addStoryPresenter from '../presenter/addStoryPresenter.js';
import loginView from '../view/loginView.js';

export default class AddStoryPage {
  render(container) {
    addStoryPresenter.init(container);
  }

  destroy() {
    if (typeof addStoryPresenter.destroy === 'function') {
      addStoryPresenter.destroy();
    }
  }
}
