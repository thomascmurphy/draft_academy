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
      let curveTypesCount = {Creature: 0, Other: 0, Land: 0}
      cmcCards.forEach(function(card) {
        if (card.types.includes('Creature')) {
          curveTypesCount['Creature'] += 1;
        } else if (card.types.includes('Land')) {
          curveTypesCount['Land'] += 1;
        } else {
          curveTypesCount['Other'] += 1;
        }
      });
      curveData.push({name: [`${cmc} CMC (Creatures)`, `${cmc} CMC (Other)`], value:[curveTypesCount['Creature'], curveTypesCount['Other']]})
    });
    var curveOptions = {
      colors: ["#df8246", "#6bb8b6"],
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
