import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Favicon from 'react-favicon';
import _ from 'lodash';
import './style.css';
import * as playerActions from '../../actions/playerActions';
import DeckBuilder from './DeckBuilder';

class DeckPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      pod: {},
      player: {},
      deckCards: [],
      hash: this.props.hash,
      saving: false
    };
    this.toggleSideboard = this.toggleSideboard.bind(this);
  }

  componentDidMount() {
    this.props.actions.loadPackCards(this.state.hash);
    this.props.actions.loadDeckCards(this.state.hash);
    this.props.actions.preloadImages(this.state.hash);
    sessionStorage.setItem('draft_academy_hash', this.state.hash);
    let nextPackCheckIntervalId = setInterval(this.nextPackCheck, 60000);
    this.setState({nextPackCheckIntervalId: nextPackCheckIntervalId});
  }

  componentWillReceiveProps(nextProps) {
    if (_.isEmpty(this.state.hash) || this.props.hash != nextProps.hash) {
      this.setState({hash: nextProps.hash});
    }
    if (_.isEmpty(this.state.pod) || JSON.stringify(this.props.pod) != JSON.stringify(nextProps.pod)) {
      this.setState({pod: nextProps.pod});
    }
    if (_.isEmpty(this.state.player) || JSON.stringify(this.props.player) != JSON.stringify(nextProps.player)) {
      this.setState({player: nextProps.player});
    }
    if (_.isEmpty(this.state.deckCards) || JSON.stringify(this.props.deckCards) != JSON.stringify(nextProps.deckCards)) {
      this.setState({deckCards: nextProps.deckCards});
    }
  }

  toggleSideboard(event) {
    event.preventDefault();
    let updateDeckCard = this.state.deckCards.filter(deckCard => deckCard.id == event.currentTarget.getAttribute('data-value'))[0];
    updateDeckCard.sideboard = updateDeckCard.sideboard === 0 ? 1 : 0;
    this.props.actions.updateDeckCard(updateDeckCard);
  }


  render() {
    var pod_complete = this.state.pod && this.state.pod.complete;
    return (
      <div className="row">
        <div className="col-md-12">
          <h1>Deckbuilder</h1>
          <DeckBuilder deckCards={this.state.deckCards} onClick={this.toggleSideboard}/>
        </div>
      </div>
    );
  }
}

DeckPage.propTypes = {
  pod: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired,
  deckCards: PropTypes.array.isRequired,
  hash: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  let pod = {}
  let player = {}
  let deckCards = state.deckCards.length > 0 ? state.deckCards : [];
  const hash = ownProps.params.hash;
  if (state.players.length > 0) {
    player = state.players.filter(player => player.hash == hash)[0];
    if (state.pods.length > 0) {
      pod = state.pods.filter(pod => pod.id == player.pod_id)[0];
    }
  }
  if (state.decks.length > 0 && player.id) {
    let deck = state.decks.filter(deck => deck.player_id == player.id)[0];
    deckCards = (deck && deck.id) ? state.deckCards.filter(deckCard => deckCard.deck_id == deck.id) : deckCards;
  }
  return {pod: pod, player: player, deckCards: deckCards, hash: hash};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(playerActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckPage);
