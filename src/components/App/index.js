import React, {PropTypes} from 'react';
import logo from './logo.svg';
import './style.css';
import Header from '../common/Header';

class App extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <Header />
        {this.props.children}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
};

export default App;
