import loginPresenter from '../presenter/loginPresenter.js';

export default class LoginPage {
  render(container) {
    loginPresenter.init(container);
  }

  destroy() {

  }
}
