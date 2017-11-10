import React from 'react';
import PropTypes from 'prop-types';
import DeckBuilder from '../Deck/DeckBuilder';

const PodPlayerDeckList = ({players}) => {
  return (
    <div>
      <ul className="nav nav-tabs" role="tablist">
        {players.map((player, index) =>
          <li role="presentation" className={index===0 ? 'active' : ''} key={`tab_${player.id}`}>
            <a href={`#player_${player.id}`} aria-controls={`player_${player.id}`} role="tab" data-toggle="tab">{player.name}</a>
          </li>
        )}
      </ul>

      <div className="tab-content">
        {players.map((player, index) =>
          <div role="tabpanel" className={index===0 ? 'tab-pane active' : 'tab-pane'} id={`player_${player.id}`} key={`deck_${player.id}`}>
            <h2>{player.name}</h2>
            <DeckBuilder deckCards={player.deck_cards} />
          </div>
        )}
      </div>

    </div>
  );
};

PodPlayerDeckList.propTypes = {
  players: PropTypes.array.isRequired
};

export default PodPlayerDeckList;
