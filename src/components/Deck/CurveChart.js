import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class CurveChart extends React.Component {

  componentDidUpdate() {
    var deckCards = this.props.deckCards;
    if (this.props.excludeSideboard) {
      deckCards = this.props.deckCards.filter(deckCard => deckCard.sideboard === 0);
    }
    var deckCardsGroupedCmc = _.groupBy(deckCards, 'cmc');
    var curveData = []
    _.forOwn(deckCardsGroupedCmc, function(cmcCards, cmc) {
      curveData.push({name: `${cmc} CMC`, value:cmcCards.length})
    });
    var curveOptions = {
      colors: ['#eeeeee', '#cccccc', '#aaaaaa', '#999999', '#666666', '#333333', '#000000'],
      title: 'Mana Curve',
      bar_spacing: '5',
      aspect_ratio: 1.5,
      hover: true,
      rounded_tops: true
    }

    window.drawBar(`#curve_bar${this.props.id || ''}`, curveData, curveOptions);
  }

  render() {

    return (
      <div id={`curve_bar${this.props.id || ''}`}></div>
    );
  }
}

CurveChart.propTypes = {
  deckCards: PropTypes.array.isRequired,
  excludeSideboard: PropTypes.bool,
  id: PropTypes.number
};

export default CurveChart;
