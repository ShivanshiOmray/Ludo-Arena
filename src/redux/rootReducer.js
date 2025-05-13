import {combineReducers} from 'redux';
import {gameSlice} from './reducers/gameSlice';

const rootReducer = combineReducers({
  game: gameSlice.reducer,
});

export default rootReducer;
