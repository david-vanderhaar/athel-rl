import React from 'react';
import './App.css';
import Nystrum from './nystrum/Nystrum';
import Original from './original/Original';

class App extends React.Component {
  render() {
    return (
      <div className="App container-fluid">
        <Nystrum />
        {/* <Original /> */}
      </div>
    );
  }
}

export default App;
