import registerPresenter from '../presenter/registerPresenter.js';
import loginView from '../view/loginView.js';

export default class LoginPage {
  render(container) {
    registerPresenter.init(container);
  }

  destroy() {
  }
}
