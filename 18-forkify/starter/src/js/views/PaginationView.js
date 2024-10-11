import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest("[class*='pagination__btn']");
      if (!btn) return;

      const goToPage = Number(btn.dataset.goto);
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateBtnMarkup(curPage + 1, curPage);
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return this._generateBtnMarkup(curPage - 1, curPage);
    }

    // Other page
    if (curPage < numPages) {
      return `
        ${this._generateBtnMarkup(curPage - 1, curPage)}
        ${this._generateBtnMarkup(curPage + 1, curPage)}
      `;
    }

    // Page 1, and there are NO other pages
    return '';
  }

  _generateBtnMarkup(page, curPage) {
    const nextPage = page > curPage;
    const iconDirection = nextPage ? 'right' : 'left';
    const classModifier = nextPage ? 'next' : 'prev';

    return `
        <button 
            data-goto="${page}" 
            class="
                btn--inline 
                pagination__btn--${classModifier}
            "
        >
            ${
              nextPage
                ? // If the button is for the next page we render the number then the arrow
                  `
                    <span>Page ${page}</span>
                    <svg class="search__icon">
                        <use 
                            href="${icons}#icon-arrow-${iconDirection}">
                        </use>
                    </svg>
                `
                : // if it is the previous page we render the arrow and then the number
                  `
                    <svg class="search__icon">
                        <use 
                            href="${icons}#icon-arrow-${iconDirection}">
                        </use>
                    </svg>
                    <span>Page ${page}</span>
                `
            }
          
        </button>
      `;
  }
}

export default new PaginationView();
