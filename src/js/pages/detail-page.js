import detailPresenter from "../presenter/detailPresenter.js";

class DetailPage {
  render(container) {
    detailPresenter.init(container);
  }

  destroy() {
    
  }
}

export default DetailPage;
