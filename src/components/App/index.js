import React from 'react';
import PropTypes from 'prop-types';
//import logo from './logo.svg';
import './style.css';
import Header from '../common/Header';

class App extends React.Component {
  render() {
    return ([
      <Header key="header" />,
      <div className="container-fluid" key="content">
        {this.props.children}
      </div>
    ]);
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
};

export default App;
