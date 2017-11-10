import React from 'react';
import { Link, IndexLink } from 'react-router';

const Header = () => {
  let last_player_hash = sessionStorage.getItem('draft_academy_hash');
  let last_player_link = last_player_hash ? <li><Link to={`/players/${last_player_hash}/pack`}>Continue Draft</Link></li> : '';
  return (
    <nav className="navbar navbar-inverse navbar-static-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <IndexLink to="/" className="navbar-brand" activeClassName="active">Draft Academy</IndexLink>
        </div>

        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav">
            {last_player_link}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
