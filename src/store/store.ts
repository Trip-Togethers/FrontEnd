import { createStore, combineReducers } from "redux";
import postReducer from "./postReducer"; 
import { planReducer }  from './planReducer';

const rootReducer = combineReducers({
  post: postReducer,
  plan: planReducer,
});


const store = createStore(rootReducer);

export default store;
export type RootState = ReturnType<typeof rootReducer>;