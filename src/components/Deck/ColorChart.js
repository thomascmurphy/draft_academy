import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class ColorChart extends React.Component {

  componentDidUpdate() {
    var deckCards = this.props.deckCards;
    if (this.props.excludeSideboard) {
      deckCards = this.props.deckCards.filter(deckCard => deckCard.sideboard === 0);
    }

    var deckCardsColorCount = {White: 0, Blue: 0, Black: 0, Red: 0, Green: 0}
    deckCards.forEach(function(card) {
      deckCardsColorCount['White'] += (card.mana_cost.match(/W/g) || []).length;
      deckCardsColorCount['Blue'] += (card.mana_cost.match(/U/g) || []).length;
      deckCardsColorCount['Black'] += (card.mana_cost.match(/B/g) || []).length;
      deckCardsColorCount['Red'] += (card.mana_cost.match(/R/g) || []).length;
      deckCardsColorCount['Green'] += (card.mana_cost.match(/G/g) || []).length;
    });
    var pieData = []
    _.forOwn(deckCardsColorCount, function(count, color) {
      pieData.push({name: color, value: count})
    });
    const colorConversion = {Colorless: "#cccccc", White: "#f1f1f1", Blue: "#3da2ff", Black: "#000000", Red: "#fa3737", Green: "#158300"}
    var pieColors = pieData.map(colorInfo => colorConversion[colorInfo.name] || '#ffdd53')
    var pieOptions = {
        colors: pieColors,
        has_key: false,
        title: 'Color Profile'
    };

    window.drawPie(`#color_pie${this.props.id}`, pieData, pieOptions);
  }

  render() {
    return (
      <div id={`color_pie${this.props.id}`}></div>
    );
  }
}

ColorChart.propTypes = {
  deckCards: PropTypes.array.isRequired,
  excludeSideboard: PropTypes.bool,
  id: PropTypes.number
};

export default ColorChart;
