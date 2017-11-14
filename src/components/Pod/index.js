import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import './style.css';
import * as podActions from '../../actions/podActions';
import PodPlayerList from './PodPlayerList';

class PodPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      pod: {},
      players: [],
      packs: [],
      decks: [],
      packCards: [],
      pickNumber: 1,
      pickCount: 45
    };
    this.changePickNumber = this.changePickNumber.bind(this);
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
    if (JSON.stringify(this.props.packs) !== JSON.stringify(nextProps.packs)) {
      this.setState({packs: nextProps.packs});
    }
    if (JSON.stringify(this.props.decks) !== JSON.stringify(nextProps.decks)) {
      this.setState({decks: nextProps.decks});
    }
    if (JSON.stringify(this.props.packCards) !== JSON.stringify(nextProps.packCards)) {
      this.setState({packCards: nextProps.packCards});
    }
    if (this.props.pickNumber !== nextProps.pickNumber) {
      this.setState({pickNumber: parseInt(nextProps.pickNumber)});
    }
  }

  changePickNumber(event) {
    let pickNumber = parseInt(event.target.value);
    this.setState({pickNumber: pickNumber});
    let players = collectPodPlayers(this.state, this.props, pickNumber);
    this.setState({players: players});
  }

  render() {
    let showRecap = this.state.pod.complete || this.props.location.query.cheat;
    let content = showRecap ? <PodPlayerList players={this.state.players} /> : <div className="well">This pod is still ongoing...</div>;
    return ([
      <div className="row bg-white shadow-bottom sticky_control" key="pod_header" data-spy="affix" data-offset-top="70" style={{padding: "10px 0px", height: "60px"}}>
        <div className="col-sm-6 hidden-xs">
          <h2 className="no_margin">Pod: {this.state.pod.name} <small>({this.state.pod.pack_1_set}, {this.state.pod.pack_2_set}, {this.state.pod.pack_3_set})</small></h2>
        </div>
        <div className="col-sm-6">
          <div className="row">
            <div className="col-xs-3">
              <h3 className="text-right no_margin">Pick #{this.state.pickNumber}</h3>
            </div>
            <div className="col-xs-9">
              <input type="range" name="pickNumber" onChange={this.changePickNumber} defaultValue={this.state.pickNumber} min="1" max={this.state.pickCount} step="1" disabled={!showRecap}/>
            </div>
          </div>
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

PodPage.propTypes = {
  pod: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired,
  pickNumber: PropTypes.number.isRequired,
  actions: PropTypes.object.isRequired
};

const getPod = (state, props) => state.pod || Object.assign({}, state.pods.find(pod => pod.id === parseInt(props.params.podId)));
const getPlayers = (state, props) => state.players;
const getPacks = (state, props) => state.packs;
const getDecks = (state, props) => state.decks;
const getPackCards = (state, props) => state.packCards;


function collectPodPlayers(state, props, pickNumber) {
  let pod = getPod(state, props);
  let players = getPlayers(state, props);
  let packs = getPacks(state, props);
  let decks = getDecks(state, props);
  let packCards = getPackCards(state, props);
  let selected = players.map(player => {
    if (player.pod_id === pod.id) {
      let playerDeck = Object.assign({}, decks.find(deck => deck.player_id === player.id));
      let playerPick = Object.assign({}, packCards.find(packCard => packCard.deck_id === playerDeck.id && packCard.pick_number === pickNumber));
      let playerPack = Object.assign({}, packs.find(pack => pack.id === playerPick.pack_id));
      let playerPackCards = Object.assign([], packCards.filter(packCard => packCard.pack_id === playerPack.id && (!packCard.pick_number || packCard.pick_number > pickNumber)));
      let playerDeckCards = Object.assign([], packCards.filter(packCard => packCard.deck_id === playerDeck.id && packCard.pick_number < pickNumber));
      player['pick'] = playerPick;
      player['pack'] = playerPack;
      player['deck'] = playerDeck;
      player['pack_cards'] = playerPackCards;
      player['deck_cards'] = playerDeckCards.sort((card1, card2) => card1.pick_number - card2.pick_number);
    }
    return player;
  });
  return selected.filter(el => el !== undefined);
}


// create a "selector creator" that uses lodash.isEqual instead of ===
// const createDeepEqualSelector = createSelectorCreator(
//   defaultMemoize,
//   isEqual
// )
//
// const collectPodPlayers = createDeepEqualSelector(
//   [getPickNumber, getPodId, getPods, getPlayers, getPacks, getDecks, getPackCards],
//   (pickNumber, podId, pods, players, packs, decks, packCards) => {
//     console.log(pickNumber, podId, pods, players, packs, decks, packCards);
//     if (!pickNumber) {pickNumber = 1;}
//     let pod = Object.assign({}, pods.find(pod => pod.id == podId));
//     let selected = players.map(player => {
//       if (player.pod_id == pod.id) {
//         let playerDeck = Object.assign({}, decks.find(deck => deck.player_id == player.id));
//         let playerPick = Object.assign({}, packCards.find(packCard => packCard.deck_id == playerDeck.id && packCard.pick_number == pickNumber));
//         let playerPack = Object.assign({}, packs.find(pack => pack.id == playerPick.pack_id));
//         let playerPackCards = Object.assign([], packCards.filter(packCard => packCard.pack_id == playerPack.id && (!packCard.pick_number || packCard.pick_number > pickNumber)));
//         let playerDeckCards = Object.assign([], packCards.filter(packCard => packCard.deck_id == playerDeck.id && packCard.pick_number < pickNumber));
//         player['pick'] = playerPick;
//         player['pack'] = playerPack;
//         player['deck'] = playerDeck;
//         player['pack_cards'] = playerPackCards;
//         player['deck_cards'] = playerDeckCards;
//         return player;
//       }
//     });
//     return {pod: pod, players: selected.filter(el => el != undefined), pickNumber: pickNumber};
//   }
// );


function mapStateToProps(state, ownProps) {
  let pod = {name: '', pack_1_set: '', pack_2_set: '', pack_3_set: '', player_ids: [], complete: 0};
  let players = [];
  let pickNumber = state.pickNumber || 1;
  if (state.pods.length > 0) {
    pod = Object.assign({}, state.pods.find(pod => pod.id === parseInt(ownProps.params.podId)));
    players = collectPodPlayers(state, ownProps, pickNumber);
  }
  let props = {pod: pod, players: players, packs: state.packs, decks: state.decks, packCards: state.packCards, pickNumber: pickNumber};
  return props;
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(podActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PodPage);
