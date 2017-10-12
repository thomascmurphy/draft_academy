import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class TypesChart extends React.Component {

  componentDidUpdate() {
    var deckCards = this.props.deckCards;
    if (this.props.excludeSideboard) {
      deckCards = this.props.deckCards.filter(deckCard => deckCard.sideboard === 0);
    }
    var deckCardsTypesCount = {Creature: 0, Other: 0, Land: 0}
    deckCards.forEach(function(card) {
      if (card.types.includes('Creature')) {
        deckCardsTypesCount['Creature'] += 1;
      } else if (card.types.includes('Land')) {
        deckCardsTypesCount['Land'] += 1;
      } else {
        deckCardsTypesCount['Other'] += 1;
      }
    });
    var donutData = []
    _.forOwn(deckCardsTypesCount, function(count, type) {
      donutData.push({name: type, value: count})
    });
    const colorConversion = {Creature: "#df8246", Other: "#6bb8b6", Land: "#a7c23c"}
    var donutColors = donutData.map(colorInfo => colorConversion[colorInfo.name] || '#ffdd53')
    var donutOptions = {
        colors: donutColors,
        has_key: false,
        donut_thickness: '10%',
        full_donut: false,
        rounded: true,
        title: 'Cards'
    };
    window.drawDonut('#types_donut', donutData, donutOptions);
  }

  render() {
    return (
      <div id="types_donut"></div>
    );
  }
}

TypesChart.propTypes = {
  deckCards: PropTypes.array.isRequired,
  excludeSideboard: PropTypes.bool
};

export default TypesChart;
