import React from 'react';
import PropTypes from 'prop-types';
import { Link, IndexLink } from 'react-router';

class DeckBuilder extends React.Component {
  render() {
    var deckCards = this.props.deckCards.filter(deckCard => deckCard.sideboard == 0)
    var sideboardCards = this.props.deckCards.filter(deckCard => deckCard.sideboard != 0)
    return (
        <div className="row">
          <div className="col-sm-8">
            <div className="well" style={{minHeight: '400px'}}>
              <h3 className="no-margin-top">Your Deck</h3>
              {deckCards.map(deckCard =>
                <div className="deck_card img_zoom" key={'deck_card:' + deckCard.id} onClick={this.props.onClick} data-value={deckCard.id}>
                  <img className="img-responsive" src={deckCard.image_url} alt={deckCard.id}/>
                </div>
              )}
            </div>
          </div>
          <div className="col-sm-4">
            <h3>Your Sideboard</h3>
            {sideboardCards.map(sideboardCard =>
              <div className="deck_card img_zoom mini" key={'sideboard_card:' + sideboardCard.id} onClick={this.props.onClick} data-value={sideboardCard.id}>
                <img className="img-responsive" src={sideboardCard.image_url} alt={sideboardCard.id}/>
              </div>
            )}
          </div>
        </div>
    );
  }
}

DeckBuilder.propTypes = {
  deckCards: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired
};

export default DeckBuilder;
