import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import HomePage from './components/Home';
import PodsPage from './components/Pods';
import PodPage from './components/Pod';
import PackPage from './components/Pack';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/pods" component={PodsPage} >
      <Route path="/pods/:id" component={PodPage} />
    </Route>
    <Route path="/pods/:podId/recap" component={PodPage} />
    <Route path="/players/:email/pods" component={PodsPage} />
    <Route path="/players/:hash/pack" component={PackPage} />
  </Route>
);
