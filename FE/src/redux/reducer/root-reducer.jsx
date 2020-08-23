import { combineReducers } from 'redux'
import BuilderReducer from './builder-reducer';

const RootReducer =  combineReducers({
    builder: BuilderReducer
});

export default RootReducer;