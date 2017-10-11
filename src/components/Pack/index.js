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

class PackPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      pod: {},
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
    if (this.props.hash != nextProps.hash) {
      //console.log('receiveprops: player', nextProps);
      this.setState({hash: nextProps.hash});
    }
    if (JSON.stringify(this.props.pod) != JSON.stringify(nextProps.pod)) {
      //console.log('receiveprops: load pack', nextProps);
      this.setState({pod: nextProps.pod});
    }
    if (JSON.stringify(this.props.player) != JSON.stringify(nextProps.player)) {
      //console.log('receiveprops: load pack', nextProps);
      this.setState({player: nextProps.player});
    }
    if (JSON.stringify(this.props.pack) != JSON.stringify(nextProps.pack)) {
      //console.log('receiveprops: load pack', nextProps);
      this.setState({pack: nextProps.pack});
    }
    if (JSON.stringify(this.props.allPackCards) != JSON.stringify(nextProps.allPackCards)) {
      //console.log('receiveprops: load pack cards', this.props.packCards, nextProps.packCards);
      this.setState({allPackCards: nextProps.allPackCards});
    }
    if (JSON.stringify(this.props.packCards) != JSON.stringify(nextProps.packCards)) {
      //console.log('receiveprops: load pack cards', this.props.packCards, nextProps.packCards);
      this.setState({packCards: nextProps.packCards});
    }
    if (JSON.stringify(this.props.deckCards) != JSON.stringify(nextProps.deckCards)) {
      //console.log('receiveprops: load deck cards', this.props.deckCards, nextProps.deckCards);
      this.setState({deckCards: nextProps.deckCards});
    }
  }

  nextPackCheck() {
    this.props.actions.loadPackCards(this.state.hash);
  }

  savePick(event) {
    event.preventDefault();
    this.setState({saving: true, showPastPicks: false});
    this.props.actions.makePick(event.currentTarget.getAttribute('data-value'), this.state.player.id);
  }

  togglePastPicks() {
    let newShowPastPicks = !this.state.showPastPicks;
    let packCards = collectPackCards(this.state.allPackCards, this.state.deckCards, this.state.pack, newShowPastPicks);
    this.setState({packCards: packCards});
    this.setState({showPastPicks: newShowPastPicks});
  }


  render() {
    var pod_complete = this.state.pod && this.state.pod.complete;
    var pack_title = 'Your Pack';
    var pick_title = '';
    var deck_number = '';
    var pack_card_list = <p>Waiting for your next pack to be passed</p>;
    var past_picks_button = this.state.showPastPicks ? 'Hide Past Picks' : 'Show Past Picks';
    var favicon = this.state.packCards.length > 0 ? <Favicon url="/favicon_alert.ico" /> : <Favicon url="/favicon.ico" />;
    if (this.props.pack.number > 0) {
      pack_title = "Pack " + this.state.pack.number;
      pick_title = <small>(Pick {((this.state.deckCards.length % 15) + 1)})</small>;
      pack_card_list = <PackCardList packCards={this.state.packCards} onClick={this.savePick} />;
      deck_number = <small>({this.state.deckCards.length} Cards)</small>;
    }
    return (
      <div className="row">
        <div className="col-md-7">
          <div className="row">
            <div className="col-md-8">
              {favicon}
              <h1>{pack_title} {pick_title}</h1>
            </div>
            <div className="col-md-4">
              <button onClick={this.togglePastPicks} className={this.state.showPastPicks ? 'btn btn-default' : 'btn btn-primary'} style={{marginTop: '20px'}}><span className={this.state.showPastPicks ? 'glyphicon glyphicon-eye-close' : 'glyphicon glyphicon-eye-open'}></span> {this.state.showPastPicks ? 'Hide Past Picks' : 'Show Past Picks'}</button>
            </div>
          </div>
          {pack_card_list}
        </div>
        <div className="col-md-5">
          <h1>Your Deck {deck_number}</h1>
          <DeckCardList deckCards={this.state.deckCards} />
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
  let firstPackPick = deckCards.filter(deckCard => deckCard.pack_id == pack.id).sort((card1, card2) => card1.pick_number - card2.pick_number)[0];
  let firstPackPickNumber = firstPackPick ? firstPackPick.pick_number : 99;
  let deckCardsGroupedCmc = _.groupBy(deckCards, 'cmc');
  let deckCardsColorCount = {white: 0, blue: 0, black: 0, red: 0, green: 0}
  deckCards.forEach(function(card) {
    if (card) {
      deckCardsColorCount['white'] += (card.mana_cost.match(/W/g) || []).length;
      deckCardsColorCount['blue'] += (card.mana_cost.match(/U/g) || []).length;
      deckCardsColorCount['black'] += (card.mana_cost.match(/B/g) || []).length;
      deckCardsColorCount['red'] += (card.mana_cost.match(/R/g) || []).length;
      deckCardsColorCount['green'] += (card.mana_cost.match(/G/g) || []).length;
    }
  });
  let selected = packCards.map(packCard => {
    if (packCard.pack_id == pack.id && ((showPastPicks && packCard.pick_number >= firstPackPickNumber) || !packCard.deck_id)) {
      let colorRatings = [];
      packCard.colors.forEach(function(color) {
        let colorDeckCards = deckCardsColorCount[color.toLowerCase()];
        colorRatings.push((colorDeckCards / (deckCards.length + 10)) * 40)
      });
      let colorRating = colorRatings.length > 0 ? _.meanBy(colorRatings) : 5;
      packCard['color_rating'] = colorRating;
      let castRating = 10 / (packCard.colors.length + (packCard.mana_cost.match(/\{.+\}/g) || []).length + packCard.cmc + 1);
      packCard['cast_rating'] = castRating;
      let curveRating = ((deckCards.length + 1) / ((deckCardsGroupedCmc[packCard.cmc] || 0).length + 1)) / (Math.pow(packCard.cmc - 2, 2) + 1);
      packCard['curve_rating'] = curveRating;
      return packCard;
    }
  });
  return selected.filter(el => el != undefined);
}

function mapStateToProps(state, ownProps) {
  let pod = {}
  let player = {}
  let pack = {set_code: '', number: 0, complete: false};
  let packCards = [];
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
  if (state.packs.length > 0 && state.packCards.length > 0) {
    let packId = state.packCards[0].pack_id;
    pack = Object.assign({}, state.packs.find(pack => pack ? pack.id == packId : false));
    packCards = collectPackCards(state.packCards, deckCards, pack, state.showPastPicks, false);
  }
  return {pod: pod, player: player, pack: pack, allPackCards: state.packCards, packCards: packCards, deckCards: deckCards, hash: hash};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(playerActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PackPage);
