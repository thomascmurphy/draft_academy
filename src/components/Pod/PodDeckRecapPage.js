import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import './style.css';
import * as podActions from '../../actions/podActions';
import PodPlayerDeckList from './PodPlayerDeckList';

class PodDeckRecapPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      pod: {},
      players: [],
      decks: [],
      packCards: []
    };
  }

  componentDidMount() {
    let podId = this.props.params.podId;
    this.props.actions.loadPod(podId);
  }

  componentWillReceiveProps(nextProps) {
    if (_.isEmpty(this.state.pod) || this.props.pod.id !== nextProps.pod.id) {
      this.setState({pod: nextProps.pod});
    }
    if (JSON.stringify(this.props.players) !== JSON.stringify(nextProps.players)) {
      this.setState({players: nextProps.players});
    }
    if (JSON.stringify(this.props.decks) !== JSON.stringify(nextProps.decks)) {
      this.setState({decks: nextProps.decks});
    }
    if (JSON.stringify(this.props.packCards) !== JSON.stringify(nextProps.packCards)) {
      this.setState({packCards: nextProps.packCards});
    }
  }

  render() {
    let showRecap = this.state.pod.complete || this.props.location.query.cheat
    let content = showRecap ? <PodPlayerDeckList players={this.state.players} /> : <div className="well">This pod is still ongoing...</div>
    return ([
      <div className="row" key="pod_header">
        <div className="col-sm-6 hidden-xs">
          <h2>Pod: {this.state.pod.name} <small>({this.state.pod.pack_1_set}, {this.state.pod.pack_2_set}, {this.state.pod.pack_3_set})</small></h2>
        </div>
      </div>,
      <div className="row" key="pod_content">
        <div className="col-md-12">
          {content}
        </div>
      </div>
    ]);
  }
}

PodDeckRecapPage.propTypes = {
  pod: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

const getPod = (state, props) => state.pod || Object.assign({}, state.pods.find(pod => pod.id === parseInt(props.params.podId)));
const getPlayers = (state, props) => state.players;
const getDecks = (state, props) => state.decks;
const getPackCards = (state, props) => state.packCards;


function collectPodPlayers(state, props) {
  let pod = getPod(state, props);
  let players = getPlayers(state, props);
  let decks = getDecks(state, props);
  let packCards = getPackCards(state, props);

  let selected = players.map(player => {
    if (player.pod_id === pod.id) {
      let playerDeck = Object.assign({}, decks.find(deck => deck.player_id === player.id));
      let playerDeckCards = Object.assign([], packCards.filter(packCard => packCard.deck_id === playerDeck.id));
      player['deck'] = playerDeck;
      player['deck_cards'] = playerDeckCards.sort((card1, card2) => card1.pick_number - card2.pick_number);
    }
    return player;
  });
  return selected.filter(el => el !== undefined);
}


function mapStateToProps(state, ownProps) {
  let pod = {name: '', pack_1_set: '', pack_2_set: '', pack_3_set: '', player_ids: []};
  let players = [];
  if (state.pods.length > 0) {
    pod = Object.assign({}, state.pods.find(pod => pod.id === parseInt(ownProps.params.podId)));
    players = collectPodPlayers(state, ownProps);
  }
  let props = {pod: pod, players: players, decks: state.decks, packCards: state.packCards};
  return props;
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(podActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PodDeckRecapPage);
