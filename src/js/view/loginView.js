const loginView = {
  render(container) {
    container.innerHTML = `
      <section aria-label="Login Form">
        <h2>Login</h2>
        <form id="login-form">
          <label for="email">Email</label>
          <input type="email" id="email" required />

          <label for="password">Password</label>
          <input type="password" id="password" required />

          <button type="submit">Login</button>
        </form>
      </section>
    `;

    this._form = container.querySelector("#login-form");
    this._email = container.querySelector("#email");
    this._password = container.querySelector("#password");
  },

  bindSubmit(handler) {
    this._form.addEventListener("submit", (e) => {
      e.preventDefault();
      handler({
        email: this._email.value,
        password: this._password.value,
      });
    });
  },
};

export default loginView;
