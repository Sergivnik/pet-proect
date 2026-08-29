import { combineReducers } from 'redux';
import { oderReducer } from './oderReducer.js';
import { reportReducer } from './reportReducer.js';
import { customerReducer } from './customerOrderReduser.js';
import { tasksReducer } from './tasksReducer.js';
import { driverReducer } from './driverReducer.js';
import { clientReducer } from './clientReduser.js';
import { stockReducer } from './stocks/stockReducer.js';

export default combineReducers({
  oderReducer,
  reportReducer,
  customerReducer,
  driverReducer,
  tasksReducer,
  clientReducer,
  stockReducer,
});
