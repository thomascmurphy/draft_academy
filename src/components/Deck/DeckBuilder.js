import React from 'react';
import PropTypes from 'prop-types';
import { Link, IndexLink } from 'react-router';
import _ from 'lodash';
import $ from 'jquery';

class DeckBuilder extends React.Component {

  componentDidUpdate(pie_data) {
    var deckCards = this.props.deckCards.filter(deckCard => deckCard.sideboard == 0);
    var deckCardsGroupedCmc = _.groupBy(deckCards, 'cmc');
    var curveData = []
    _.forOwn(deckCardsGroupedCmc, function(cmcCards, cmc) {
      curveData.push({name: `${cmc} CMC`, value:cmcCards.length})
    });
    var curveOptions = {colors: ['#6bb8b6'], title: 'Mana Curve', bar_spacing: '5', aspect_ratio: 1.5, hover: true}

    var deckCardsColorCount = {white: 0, blue: 0, black: 0, red: 0, green: 0}
    deckCards.forEach(function(card) {
      deckCardsColorCount['white'] += (card.mana_cost.match(/W/g) || []).length;
      deckCardsColorCount['blue'] += (card.mana_cost.match(/U/g) || []).length;
      deckCardsColorCount['black'] += (card.mana_cost.match(/B/g) || []).length;
      deckCardsColorCount['red'] += (card.mana_cost.match(/R/g) || []).length;
      deckCardsColorCount['green'] += (card.mana_cost.match(/G/g) || []).length;
    });
    var pieData = []
    _.forOwn(deckCardsColorCount, function(count, color) {
      pieData.push({name: color, value: count})
    });
    const colorConversion = {colorless: "#cccccc", white: "#f1f1f1", blue: "#3da2ff", black: "#000000", red: "#fa3737", green: "#158300"}
    var pieColors = pieData.map(colorInfo => colorConversion[colorInfo.name] || '#ffdd53')
    var pieOptions = {
        colors: pieColors,
        has_key: false,
        title: 'Color Profile'
    };

    window.drawBar('#curve_bar', curveData, curveOptions);
    window.drawPie('#color_pie', pieData, pieOptions);
  }

  render() {
    var deckCards = this.props.deckCards.filter(deckCard => deckCard.sideboard == 0);
    var deckCardsGroupedCmc = _.groupBy(deckCards, 'cmc');
    var sideboardCards = this.props.deckCards.filter(deckCard => deckCard.sideboard != 0);
    var cmcColumnCount = 12 / (Object.keys(deckCardsGroupedCmc).length || 1);
    cmcColumnCount = cmcColumnCount < 2 ? `1-5 col-xs-1` : Math.floor(cmcColumnCount);

    return ([
        <div className="row" key="deckbuilder_deck">
          <div className="col-sm-8">
            <div className="well" style={{minHeight: '400px'}}>
              <h3 className="no_margin_top">Your Deck <small>({deckCards.length} Cards)</small></h3>
              <div className="row">
                {Object.keys(deckCardsGroupedCmc).map((cmc,index) =>
                  <div className={`col-xs-${cmcColumnCount}`} key={`cmc${cmc}`}>
                    {deckCardsGroupedCmc[cmc].map(deckCard =>
                      <div className="deck_card img_zoom stacked large" key={'deck_card:' + deckCard.id} onClick={this.props.onClick} data-value={deckCard.id}>
                        <img className="img-responsive" src={deckCard.image_url} alt={deckCard.id}/>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
        </div>,
        <div className="row" key="deckbuilder_stats">
          <div className="col-sm-4 col-xs-6">
            <div id="color_pie"></div>
          </div>
          <div className="col-sm-4 col-xs-6">
            <div id="curve_bar"></div>
          </div>
        </div>
    ]);
  }
}

DeckBuilder.propTypes = {
  deckCards: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired
};

export default DeckBuilder;
