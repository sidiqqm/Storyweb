import registerView from "../view/registerView.js";
import { registerUser } from "../model/api.js";

const registerPresenter = {
  init(container) {
    registerView.render(container);
    registerView.bindSubmit(async ({ name, email, password }) => {
      try {
        await registerUser(name, email, password);
        alert("Registrasi berhasil! Silakan login.");
        window.location.hash = "#/login";
      } catch (error) {
        alert("Gagal registrasi: " + error.message);
      }
    });
  },
};

export default registerPresenter;
