import { API_URL, API_KEY, RESULTS_PER_PAGE } from './config';
import { getJson } from './helpers';

export const state = {
  recipe: {},
  search: {
    page: 1,
    query: '',
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async function (recipeId) {
  try {
    const {
      data: { recipe },
    } = await getJson(`${API_URL}/recipes/${recipeId.slice(1)}?key=${API_KEY}`);

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      bookmarked: state.bookmarks.some(rec => rec.id === recipe.id),
    };
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const {
      data: { recipes },
    } = await getJson(`${API_URL}/recipes?search=${query}&key=${API_KEY}`);

    state.search.results = recipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
    }));
    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage; //Slice exludes end so end = 10 will actually get until element in index 9

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(
    ingredient =>
      // New quantity = old quantity * new servings / old servings
      (ingredient.quantity =
        (ingredient.quantity * newServings) / state.recipe.servings)
  );

  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(recipe => recipe.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }
};
