import storyPresenter from '../presenter/storyPresenter.js';
import loginView from '../view/loginView.js';

export default class LoginPage {
  render(container) {
    storyPresenter.init(container);
  }

  destroy() {
  }
}
