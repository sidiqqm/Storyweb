const registerView = {
  render(container) {
    container.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <main id="main-content">
        <h2>Registrasi</h2>
        <form id="registerForm" aria-label="Form pendaftaran pengguna">
          <fieldset>
            <legend>Informasi Akun Baru</legend>

            <label for="name">Nama:</label>
            <input type="text" id="name" name="name" required aria-required="true" />

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required aria-required="true" />

            <label for="password">Kata Sandi:</label>
            <input type="password" id="password" name="password" required aria-required="true" />
          </fieldset>

          <button type="submit">Daftar</button>
        </form>
        <p>Sudah punya akun? <a href="#/login" id="goToLogin">Login di sini</a></p>
      </main>
    `;

    container.appendChild(wrapper);

    this._form = wrapper.querySelector("#registerForm");

    const loginLink = wrapper.querySelector("#goToLogin");
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      this.startTransitionToLogin();
    });
  },

  bindSubmit(handler) {
    if (!this._form) {
      throw new Error("Form belum dirender, panggil render() dulu sebelum bindSubmit()");
    }

    this._form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = this._form.querySelector("#name").value.trim();
      const email = this._form.querySelector("#email").value.trim();
      const password = this._form.querySelector("#password").value.trim();
      handler({ name, email, password });
    });
  },

  startTransitionToLogin() {
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        window.location.hash = "#/login";
      });
    } else {
      window.location.hash = "#/login";
    }
  },
};

export default registerView;
