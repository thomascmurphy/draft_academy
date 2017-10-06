import * as types from '../actions/actionTypes';
import initialState from './initialState';

export default function packCardReducer(state = initialState.packCards, action) {
  switch(action.type) {
    case types.LOAD_PACK_CARDS_SUCCESS:
      return Object.assign([], state, action.pack_cards);
    case types.LOAD_PACK_CARD_SUCCESS:
      return [
        ...state.filter(packCard => packCard.id !== action.pack_card.id),
        Object.assign({}, action.pack_card)
      ];
    default:
      return state;
  }
}
