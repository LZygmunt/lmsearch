import actionTypes from "../../utils/actionTypes";
import initState from "./initState";

const rootReducer = ( state = initState, action ) => {
  switch ( action.type ) {
    case actionTypes.SET_ARTICLES:
      return {
        ...state,
        allArticles: action.articles
      };
    case actionTypes.SET_COUNT_ARTICLES:
      return {
        ...state,
        countArticles: action.countArticles
      };
    case actionTypes.SET_FOUND_ARTICLES:
      return {
        ...state,
        foundArticles: action.foundArticles
      };
    case actionTypes.SET_FLAG:
      return {
        ...state,
        flag: action.flag
      };
    case actionTypes.SET_INDIVIDUALS:
      return {
        ...state,
        individuals: action.individuals
      };
    case actionTypes.SET_SEARCH_VALUE:
      return {
        ...state,
        searchValue: action.searchValue
      };
    case actionTypes.SET_PAGE:
      return {
        ...state,
        currentPage: action.page
      };
    case actionTypes.SET_INSTANCES:
      return {
        ...state,
        instances: action.instances
      };
    default:
      return state
  }
};

export default rootReducer;
