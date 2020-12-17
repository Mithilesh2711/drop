import React, { Component } from 'react';
import Main from './components/MainComponent';
import './App.css';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';

const store = ConfigureStore();

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <HashRouter>
          <div>
            <Main />
          </div>
        </HashRouter>
      </Provider>
    );
  }
}

export default App;
