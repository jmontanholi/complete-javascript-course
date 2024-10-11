import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/PaginationView';

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash;

    if (!id) return;

    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return resultsView.renderError('Please enter a valid query');

    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);

    console.log(model.state.search);
  } catch (error) {
    resultsView.renderError(err);
  }
};

const controlPagination = function (page) {
  resultsView.render(model.getSearchResultsPage(page));
  paginationView.render(model.state.search);
};

const controlServings = function (newServing) {
  model.updateServings(newServing);

  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  model.state.recipe.bookmarked
    ? model.deleteBookmark(model.state.recipe.id)
    : model.addBookmark(model.state.recipe);

  recipeView.update(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
