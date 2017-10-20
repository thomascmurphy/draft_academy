import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Favicon from 'react-favicon';
import _ from 'lodash';
import './style.css';
import * as playerActions from '../../actions/playerActions';
import DeckBuilder from './DeckBuilder';
import NumberInput from '../common/NumberInput';

class DeckPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      pod: {},
      player: {},
      deck: {},
      deckCards: [],
      hash: this.props.hash,
      saving: false,
      plains: 0,
      islands: 0,
      swamps: 0,
      mountains: 0,
      forests: 0
    };
    this.toggleSideboard = this.toggleSideboard.bind(this);
    this.changeLands = this.changeLands.bind(this);
    this.addLands = this.addLands.bind(this);
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
    if (_.isEmpty(this.state.deck) || JSON.stringify(this.props.deck) != JSON.stringify(nextProps.deck)) {
      this.setState({deck: nextProps.deck});
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

  changeLands(event) {
    event.preventDefault();
    let update = {}
    update[event.target.name] = parseInt(event.target.value);
    this.setState(update);
  }

  addLands(event) {
    event.preventDefault();
    let update = {Plains: this.state.plains, Island: this.state.islands, Swamp: this.state.swamps, Mountain: this.state.mountains, Forest: this.state.forests}
    this.props.actions.addLands(this.state.deck.id, this.state.player.id, update);
    this.setState({plains: 0, islands: 0, swamps: 0, mountains: 0, forests: 0});
  }


  render() {
    var pod_complete = this.state.pod && this.state.pod.complete;
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            <div className="col-sm-6 col-xs-8">
              <h1>Deckbuilder</h1>
            </div>
            <div className="col-sm-2 col-xs-4 text-right">
              <button type="button" className="btn btn-success margin_top" data-toggle="modal" data-target="#landsModal">
                Add Lands
              </button>
            </div>
          </div>
          <DeckBuilder deckCards={this.state.deckCards} onClick={this.toggleSideboard}/>
          <div className="modal fade" id="landsModal" tabIndex="-1" role="dialog" aria-labelledby="landsModalLabel">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <h4 className="modal-title" id="landsModalLabel">Add Lands</h4>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-sm-2">
                      <NumberInput name="plains" label="Plains" onChange={this.changeLands} value={this.state.plains} max={20} min={0}/>
                    </div>
                    <div className="col-sm-2">
                      <NumberInput name="islands" label="Island" onChange={this.changeLands} value={this.state.islands} max={20} min={0}/>
                    </div>
                    <div className="col-sm-2">
                      <NumberInput name="swamps" label="Swamp" onChange={this.changeLands} value={this.state.swamps} max={20} min={0}/>
                    </div>
                    <div className="col-sm-2">
                      <NumberInput name="mountains" label="Mountain" onChange={this.changeLands} value={this.state.mountains} max={20} min={0}/>
                    </div>
                    <div className="col-sm-2">
                      <NumberInput name="forests" label="Forest" onChange={this.changeLands} value={this.state.forests} max={20} min={0}/>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" onClick={this.addLands} data-dismiss="modal">Save</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DeckPage.propTypes = {
  pod: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired,
  deck: PropTypes.object.isRequired,
  deckCards: PropTypes.array.isRequired,
  hash: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
  let pod = {}
  let player = {}
  let deck = {}
  let deckCards = state.deckCards.length > 0 ? state.deckCards : [];
  const hash = ownProps.params.hash;
  if (state.players.length > 0) {
    player = state.players.filter(player => player.hash == hash)[0];
    if (state.pods.length > 0) {
      pod = state.pods.filter(pod => pod.id == player.pod_id)[0];
    }
  }
  if (state.decks.length > 0 && player.id) {
    deck = state.decks.filter(deck => deck.player_id == player.id)[0];
    deckCards = (deck && deck.id) ? state.deckCards.filter(deckCard => deckCard.deck_id == deck.id) : deckCards;
  }
  return {pod: pod, player: player, deck: deck, deckCards: deckCards, hash: hash};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(playerActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckPage);
