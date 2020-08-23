import React from 'react';
import logo from './logo.svg';
import './App.css';

import Builder from './pages/builder'
import RootReducer from './redux/reducer/root-reducer';
import {createStore } from 'redux';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import 'bootstrap/dist/css/bootstrap.min.css';
import './components/plugins/fontawesome-free/css/all.min.css';
import './components/css/adminlte.min.css';

class App extends React.Component {

  render() {
    const store = createStore(RootReducer);
    return (
      <Provider store={store}>
        <DndProvider backend={HTML5Backend}>
          <div className="App">
            <Builder />
          </div>
        </DndProvider>
      </Provider>
    );
  }
}

export default App;