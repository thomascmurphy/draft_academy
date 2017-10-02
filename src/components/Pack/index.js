import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import './style.css';
import * as playerActions from '../../actions/playerActions';
import PackCardList from './PackCardList';
import DeckCardList from './DeckCardList';

class PackPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      pack: {},
      allPackCards: [],
      packCards: [],
      deckCards: [],
      hash: this.props.hash,
      saving: false,
      showPastPicks: false
    };
    this.savePick = this.savePick.bind(this);
    this.togglePastPicks = this.togglePastPicks.bind(this);
  }

  componentDidMount() {
    this.props.actions.loadPackCards(this.state.hash);
    this.props.actions.loadDeckCards(this.state.hash);
    this.props.actions.preloadImages(this.state.hash);
    sessionStorage.setItem('draft_academy_hash', this.state.hash);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.hash != nextProps.hash) {
      //console.log('receiveprops: player', nextProps);
      this.setState({hash: nextProps.hash});
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

  savePick(event) {
    event.preventDefault();
    this.setState({saving: true, showPastPicks: false});
    this.props.actions.makePick(event.currentTarget.getAttribute('data-value'));
  }

  togglePastPicks() {
    let newShowPastPicks = !this.state.showPastPicks;
    let packCards = collectPackCards(this.state.allPackCards, this.state.pack, newShowPastPicks);
    this.setState({packCards: packCards});
    this.setState({showPastPicks: newShowPastPicks});
  }


  render() {
    var pack_title = 'Your Pack';
    var pick_title = '';
    var deck_number = '';
    var pack_card_list = <p>Waiting for your next pack to be passed</p>;
    var past_picks_button = this.state.showPastPicks ? 'Hide Past Picks' : 'Show Past Picks';
    if (this.props.pack.number > 0) {
      pack_title = "Pack " + this.state.pack.number;
      pick_title = <small>(Pick {((this.state.deckCards.length + 1) % 15)})</small>;
      pack_card_list = <PackCardList packCards={this.state.packCards} onClick={this.savePick} />;
      deck_number = <small>({this.state.deckCards.length} Cards)</small>;
    }
    return (
      <div className="row">
        <div className="col-md-7">
          <div className="row">
            <div className="col-md-8">
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
  pack: PropTypes.object.isRequired,
  allPackCards: PropTypes.array.isRequired,
  packCards: PropTypes.array.isRequired,
  deckCards: PropTypes.array.isRequired,
  hash: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired
};

function collectPackCards(packCards, pack, showPastPicks) {
  let selected = packCards.map(packCard => {
    if (packCard.pack_id == pack.id && (showPastPicks || !packCard.deck_id)) {
      return packCard;
    }
  });
  return selected.filter(el => el != undefined);
}

function mapStateToProps(state, ownProps) {
  let pack = {set_code: '', number: 0, complete: false};
  let packCards = [];
  let deckCards = state.deckCards.length > 0 ? state.deckCards : [];
  const hash = ownProps.params.hash;
  if (state.packs.length > 0 && state.packCards.length > 0) {
    let packId = state.packCards[0].pack_id;
    pack = Object.assign({}, state.packs.find(pack => pack ? pack.id == packId : false));
    packCards = collectPackCards(state.packCards, pack, state.showPastPicks);
  }
  return {pack: pack, allPackCards: state.packCards, packCards: packCards, deckCards: deckCards, hash: hash};
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(playerActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PackPage);
