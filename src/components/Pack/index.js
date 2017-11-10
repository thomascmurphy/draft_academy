import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Favicon from 'react-favicon';
import _ from 'lodash';
import './style.css';
import * as playerActions from '../../actions/playerActions';
import PackCardList from './PackCardList';
import DeckCardList from './DeckCardList';
import ColorChart from '../Deck/ColorChart';
import CurveChart from '../Deck/CurveChart';
import TypesChart from '../Deck/TypesChart';
import {browserHistory} from 'react-router';

class PackPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      pod: {},
      pod_players: [],
      player: {},
      pack: {},
      allPackCards: [],
      packCards: [],
      deckCards: [],
      hash: this.props.hash,
      saving: false,
      showPastPicks: false,
      nextPackCheckIntervalId: null
    };
    this.savePick = this.savePick.bind(this);
    this.togglePastPicks = this.togglePastPicks.bind(this);
    this.nextPackCheck = this.nextPackCheck.bind(this);
  }

  componentDidMount() {
    this.props.actions.loadPackCards(this.state.hash);
    this.props.actions.loadDeckCards(this.state.hash);
    this.props.actions.preloadImages(this.state.hash);
    sessionStorage.setItem('draft_academy_hash', this.state.hash);
    let nextPackCheckIntervalId = setInterval(this.nextPackCheck, 60000);
    this.setState({nextPackCheckIntervalId: nextPackCheckIntervalId});
  }

  componentWillUnmount() {
    clearInterval(this.state.nextPackCheckIntervalId)
  }

  componentWillReceiveProps(nextProps) {
    if (_.isEmpty(this.state.hash) || this.props.hash !== nextProps.hash) {
      this.setState({hash: nextProps.hash});
    }
    if (_.isEmpty(this.state.pod) || JSON.stringify(this.props.pod) !== JSON.stringify(nextProps.pod)) {
      this.setState({pod: nextProps.pod});
    }
    if (_.isEmpty(this.state.pod_players) || (JSON.stringify(this.props.pod_players) !== JSON.stringify(nextProps.pod_players) && nextProps.pod_players && nextProps.pod_players.length > 0)) {
      this.setState({pod_players: nextProps.pod_players});
    }
    if (_.isEmpty(this.state.player) || JSON.stringify(this.props.player) !== JSON.stringify(nextProps.player)) {
      this.setState({player: nextProps.player});
    }
    if (_.isEmpty(this.state.pack) || JSON.stringify(this.props.pack) !== JSON.stringify(nextProps.pack)) {
      this.setState({pack: nextProps.pack});
    }
    if (_.isEmpty(this.state.allPackCards) || JSON.stringify(this.props.allPackCards) !== JSON.stringify(nextProps.allPackCards)) {
      this.setState({allPackCards: nextProps.allPackCards});
    }
    if (_.isEmpty(this.state.packCards) || JSON.stringify(this.props.packCards) !== JSON.stringify(nextProps.packCards)) {
      this.setState({packCards: nextProps.packCards});
    }
    if (_.isEmpty(this.state.deckCards) || JSON.stringify(this.props.deckCards) !== JSON.stringify(nextProps.deckCards)) {
      this.setState({deckCards: nextProps.deckCards});
    }
  }

  nextPackCheck() {
    this.props.actions.loadPackCards(this.state.hash).then((response) => {
      if (this.state.pod.complete) {
        browserHistory.push(`/players/${this.state.hash}/deck`);
      }
    });
  }

  savePick(event) {
    event.preventDefault();
    this.setState({saving: true, showPastPicks: false});
    this.props.actions.makePick(event.currentTarget.getAttribute('data-value'), this.state.player.id).then((response) => {
      if (this.state.pod.complete) {
        browserHistory.push(`/players/${this.state.hash}/deck`);
      }
    });
  }

  togglePastPicks() {
    let newShowPastPicks = !this.state.showPastPicks;
    let packCards = collectPackCards(this.state.allPackCards, this.state.deckCards, this.state.pack, newShowPastPicks);
    this.setState({packCards: packCards});
    this.setState({showPastPicks: newShowPastPicks});
  }


  render() {
    var pack_title = 'Your Pack';
    var pick_title = '';
    var deck_number = '';
    var pack_number = this.state.pack.number;
    var pack_card_list = <p>Waiting for your next pack to be passed</p>;
    var favicon = this.state.packCards.length > 0 ? <Favicon url="/favicon_alert.ico" /> : <Favicon url="/favicon.ico" />;
    if (this.props.pack.number > 0) {
      pack_title = "Pack " + this.state.pack.number;
      pick_title = <small>(Pick {((this.state.deckCards.length % 15) + 1)})</small>;
      pack_card_list = <PackCardList packCards={this.state.packCards} onClick={this.savePick} showRatings={this.props.location.query['ratings'] === 'true'}/>;
      deck_number = <small>({this.state.deckCards.length} Cards)</small>;
    }
    return (
      <div className="row">
        <div className="col-md-7">
          <div className="row">
            <div className="col-md-6">
              {favicon}
              <h1>{pack_title} {pick_title}</h1>
            </div>
            <div className="col-md-6 text-right">
              <button type="button" className="btn btn-warning margin_right" style={{marginTop: '20px'}} data-toggle="modal" data-target="#tableModal">
                View Table
              </button>
              <button onClick={this.togglePastPicks} disabled={!(this.props.pack.number > 0)} className={this.state.showPastPicks ? 'btn btn-default' : 'btn btn-primary'} style={{marginTop: '20px'}}><span className={this.state.showPastPicks ? 'glyphicon glyphicon-eye-close' : 'glyphicon glyphicon-eye-open'}></span> {this.state.showPastPicks ? 'Hide Past Picks' : 'Show Past Picks'}</button>
            </div>
          </div>
          {pack_card_list}
        </div>
        <div className="col-md-5">
          <h1>Your Deck {deck_number}</h1>
          <DeckCardList deckCards={this.state.deckCards} />
          <div className="row" style={{marginTop: '20px'}}>
            <div className="col-sm-4">
              <ColorChart deckCards={this.props.deckCards} excludeSideboard={false}/>
            </div>
            <div className="col-sm-4">
              <CurveChart deckCards={this.props.deckCards} excludeSideboard={false}/>
            </div>
            <div className="col-sm-4">
              <TypesChart deckCards={this.props.deckCards} excludeSideboard={false}/>
            </div>
          </div>
        </div>

        <div className="modal fade" id="tableModal" tabIndex="-1" role="dialog" aria-labelledby="tableModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 className="modal-title" id="tableModalLabel">Table Order</h4>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-xs-12">
                    <div id="table_order">
                      <div id="table_triangles">
                        <span id="triangle_1" className={pack_number === 2 ? "glyphicon glyphicon-triangle-right reverse" : "glyphicon glyphicon-triangle-right"}/>
                        <span id="triangle_2" className={pack_number === 2 ? "glyphicon glyphicon-triangle-right reverse" : "glyphicon glyphicon-triangle-right"}/>
                        <span id="triangle_3" className={pack_number === 2 ? "glyphicon glyphicon-triangle-right reverse" : "glyphicon glyphicon-triangle-right"}/>
                        <span id="triangle_4" className={pack_number === 2 ? "glyphicon glyphicon-triangle-right reverse" : "glyphicon glyphicon-triangle-right"}/>
                        <span id="triangle_5" className={pack_number === 2 ? "glyphicon glyphicon-triangle-right reverse" : "glyphicon glyphicon-triangle-right"}/>
                        <span id="triangle_6" className={pack_number === 2 ? "glyphicon glyphicon-triangle-right reverse" : "glyphicon glyphicon-triangle-right"}/>
                        <span id="triangle_7" className={pack_number === 2 ? "glyphicon glyphicon-triangle-right reverse" : "glyphicon glyphicon-triangle-right"}/>
                        <span id="triangle_8" className={pack_number === 2 ? "glyphicon glyphicon-triangle-right reverse" : "glyphicon glyphicon-triangle-right"}/>
                      </div>
                      {this.state.pod_players.map((player, index) =>
                        <div id={`player_${index + 1}`} className="player" key={`table_player_${index}`}>
                          <span className={player.is_bot ? "glyphicon glyphicon-hdd" : "glyphicon glyphicon-user"}/><br/>
                          {player.name}
                          {player.pack_ids && player.pack_ids.length > 0 ? (
                            <div className="pack_count">
                              {player.pack_ids.length} x <span className="glyphicon glyphicon-inbox"/>
                            </div>
                          ) : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

PackPage.propTypes = {
  pod: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired,
  pack: PropTypes.object.isRequired,
  allPackCards: PropTypes.array.isRequired,
  packCards: PropTypes.array.isRequired,
  deckCards: PropTypes.array.isRequired,
  hash: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired
};

function collectPackCards(packCards, deckCards, pack, showPastPicks) {
  let firstPackPick = deckCards.filter(deckCard => deckCard.pack_id === pack.id).sort((card1, card2) => card1.pick_number - card2.pick_number)[0];
  let firstPackPickNumber = firstPackPick ? firstPackPick.pick_number : 99;
  let selected = packCards.filter(packCard => packCard.pack_id === pack.id && ((showPastPicks && packCard.pick_number >= firstPackPickNumber) || !packCard.deck_id));
  return selected.filter(el => el !== undefined);
}

function mapStateToProps(state, ownProps) {
  let pod = {};
  let pod_players = [];
  let player = {};
  let pack = {set_code: '', number: 0, complete: false};
  let packCards = [];
  let deckCards = state.deckCards.length > 0 ? state.deckCards : [];
  const hash = ownProps.params.hash;
  if (state.players.length > 0) {
    player = state.players.filter(player => player.hash === hash)[0];
    if (state.pods.length > 0) {
      pod = state.pods.filter(pod => pod.id === player.pod_id)[0];
      pod_players = pod.players ? pod.players : [];
    }
  }
  if (state.decks.length > 0 && player.id) {
    let deck = state.decks.filter(deck => deck.player_id === player.id)[0];
    deckCards = (deck && deck.id) ? state.deckCards.filter(deckCard => deckCard.deck_id === deck.id) : deckCards;
  }
  if (state.packs.length > 0 && state.packCards.length > 0) {
    let packId = state.packCards[0].pack_id;
    pack = Object.assign({}, state.packs.find(pack => pack ? pack.id === packId : false));
    packCards = collectPackCards(state.packCards, deckCards, pack, state.showPastPicks, false);
  }
  return {pod: pod, pod_players: pod_players, player: player, pack: pack, allPackCards: state.packCards, packCards: packCards, deckCards: deckCards, hash: hash};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(playerActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PackPage);
