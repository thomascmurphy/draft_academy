import * as types from './actionTypes';
import playerApi from '../api/playerApi';

export function loadPlayersSuccess(players) {
  return {type: types.LOAD_PLAYERS_SUCCESS, players};
}

export function filterPodsSuccess(pods) {
  return {type: types.LOAD_PODS_SUCCESS, pods};
}

export function loadPackCardsSuccess(pack_cards) {
  return {type: types.LOAD_PACK_CARDS_SUCCESS, pack_cards};
}

export function loadPackCardSuccess(pack_card) {
  return {type: types.LOAD_PACK_CARD_SUCCESS, pack_card};
}

export function loadDeckCardsSuccess(deck_cards) {
  return {type: types.LOAD_DECK_CARDS_SUCCESS, deck_cards};
}

export function loadDeckCardSuccess(deck_card) {
  return {type: types.LOAD_DECK_CARD_SUCCESS, deck_card};
}

export function filterPacksSuccess(packs) {
  return {type: types.LOAD_PACKS_SUCCESS, packs};
}

export function filterDecksSuccess(decks) {
  return {type: types.LOAD_DECKS_SUCCESS, decks};
}

export function loadPlayers(email, pin) {
  return function(dispatch) {
    return playerApi.getPlayers(email, pin).then(response => {
      dispatch(loadPlayersSuccess(response.players));
      dispatch(filterPodsSuccess(response.pods));
    }).catch(error => {
      throw(error);
    });
  };
}

export function loadPackCards(hash) {
  return function(dispatch) {
    return playerApi.getPack(hash).then(response => {
      dispatch(loadPackCardsSuccess(response.pack_cards));
      dispatch(filterPacksSuccess([response.pack]));
      dispatch(loadPlayersSuccess([response.player]));
      dispatch(filterPodsSuccess([response.pod]));
    }).catch(error => {
      throw(error);
    });
  };
}

export function loadDeckCards(hash) {
  return function(dispatch) {
    return playerApi.getDeck(hash).then(response => {
      dispatch(loadDeckCardsSuccess(response.deck_cards));
      dispatch(filterDecksSuccess([response.deck]));
      dispatch(loadPlayersSuccess([response.player]));
    }).catch(error => {
      throw(error);
    });
  };
}

export function makePick(packCardId, playerId) {
  return function(dispatch) {
    return playerApi.makePick(packCardId, playerId).then(response => {
      dispatch(loadPackCardsSuccess(response.pack_cards));
      dispatch(loadDeckCardsSuccess(response.deck_cards));
      dispatch(filterPacksSuccess([response.pack]));
      dispatch(filterPodsSuccess([response.pod]));
    }).catch(error => {
      throw(error);
    });
  };
}

export function updateDeckCard(deckCard) {
  return function(dispatch) {
    return playerApi.updateDeckCard(deckCard).then(response => {
      dispatch(loadDeckCardSuccess(response.deck_card));
    }).catch(error => {
      throw(error);
    });
  };
}

export function preloadImages(hash) {
  return function(dispatch) {
    return playerApi.getCardImages(hash).then(response => {
      let images = response.card_image_urls.map((card_image_url) => {
        let img=new Image();
        img.src=card_image_url;
      });
    }).catch(error => {
      throw(error);
    });
  };
}
