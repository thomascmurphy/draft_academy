import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function deckCardReducer(state = initialState.deckCards, action) {
  switch(action.type) {
    case types.LOAD_DECK_CARDS_SUCCESS:
      return Object.assign([], state, action.deck_cards);
    case types.LOAD_DECK_CARD_SUCCESS:
      return [
        ...state.filter(deckCard => deckCard.id !== action.deck_card.id),
        Object.assign({}, action.deck_card)
      ];
    default:
      return state;
  }
}
