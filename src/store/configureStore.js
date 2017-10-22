import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../modules';
import createHelpers from './createHelpers';

export default function configureStore(initialState, helpersConfig) {
  const helpers = createHelpers(helpersConfig);
  const middleware = [thunk.withExtraArgument(helpers)];

  let enhancer;
  if (__DEV__) {
    let devToolsExtension = f => f;
    if (process.env.BROWSER && window.devToolsExtension) {
      devToolsExtension = window.devToolsExtension();
    }
    enhancer = compose(applyMiddleware(...middleware), devToolsExtension);
  } else {
    enhancer = applyMiddleware(...middleware);
  }

  return createStore(rootReducer, initialState, enhancer);
}
