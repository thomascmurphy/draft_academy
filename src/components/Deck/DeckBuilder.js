import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ColorChart from './ColorChart';
import CurveChart from './CurveChart';
import TypesChart from './TypesChart';

class DeckBuilder extends React.Component {

  // componentDidUpdate(pie_data) {
  //   var deckCards = this.props.deckCards.filter(deckCard => deckCard.sideboard === 0);
  //   var deckCardsGroupedCmc = _.groupBy(deckCards, 'cmc');
  //   var curveData = []
  //   _.forOwn(deckCardsGroupedCmc, function(cmcCards, cmc) {
  //     curveData.push({name: `${cmc} CMC`, value:cmcCards.length})
  //   });
  //   var curveOptions = {
  //     colors: ['#eeeeee', '#cccccc', '#aaaaaa', '#999999', '#666666', '#333333', '#000000'],
  //     title: 'Mana Curve',
  //     bar_spacing: '5',
  //     aspect_ratio: 1.5,
  //     hover: true,
  //     rounded_tops: true
  //   }
  //
  //   var deckCardsColorCount = {white: 0, blue: 0, black: 0, red: 0, green: 0}
  //   deckCards.forEach(function(card) {
  //     deckCardsColorCount['white'] += (card.mana_cost.match(/W/g) || []).length;
  //     deckCardsColorCount['blue'] += (card.mana_cost.match(/U/g) || []).length;
  //     deckCardsColorCount['black'] += (card.mana_cost.match(/B/g) || []).length;
  //     deckCardsColorCount['red'] += (card.mana_cost.match(/R/g) || []).length;
  //     deckCardsColorCount['green'] += (card.mana_cost.match(/G/g) || []).length;
  //   });
  //   var pieData = []
  //   _.forOwn(deckCardsColorCount, function(count, color) {
  //     pieData.push({name: color, value: count})
  //   });
  //   const colorConversion = {colorless: "#cccccc", white: "#f1f1f1", blue: "#3da2ff", black: "#000000", red: "#fa3737", green: "#158300"}
  //   var pieColors = pieData.map(colorInfo => colorConversion[colorInfo.name] || '#ffdd53')
  //   var pieOptions = {
  //       colors: pieColors,
  //       has_key: false,
  //       title: 'Color Profile'
  //   };
  //
  //   window.drawBar('#curve_bar', curveData, curveOptions);
  //   window.drawPie('#color_pie', pieData, pieOptions);
  // }

  copyDeckList(event) {
    event.preventDefault();
    let deckId = event.currentTarget.getAttribute('data-deckid');
    var deckList = document.querySelector(`#decklist_${deckId}`);
    deckList.focus();
    deckList.select();
    var msg = "";
    try {
      var successful = document.execCommand('copy');
      msg = successful ? 'Copied to clipboard.' : 'Something went wrong.';
    } catch (err) {
      msg = 'Unable to copy.'
    }
    window.toolTipFlash(`#copy_decklist_btn_${deckId}`, msg);
  }

  render() {
    var deck_id = _.get(this.props.deckCards, '[0].deck_id');
    var deckCards = this.props.deckCards.filter(deckCard => deckCard.sideboard === 0);
    var deckCardsGroupedCmc = _.groupBy(_.sortBy(deckCards, 'name'), 'cmc');
    var sideboardCards = this.props.deckCards.filter(deckCard => deckCard.sideboard !== 0);
    var cmcColumnCount = Math.min(12 / (Object.keys(deckCardsGroupedCmc).length || 1), 3);
    cmcColumnCount = cmcColumnCount < 2 ? `1-5 col-xs-1` : Math.floor(cmcColumnCount);
    var exportItems = [];
    var deckCardsGroupedName = _.groupBy(deckCards, 'name');
    _.forOwn(deckCardsGroupedName, function(nameCards, name) {
      exportItems.push(`${nameCards.length}x ${name}`);
    });

    return ([
        <div className="row" key="deckbuilder_deck">
          <div className="col-sm-8">
            <div className="well" style={{minHeight: '400px', paddingBottom: '150px'}}>
              <div className="row">
                <div className="col-xs-8">
                  <h3 className="no_margin_top">Deck <small>({deckCards.length} Cards)</small></h3>
                </div>
                <div className="col-xs-4 text-right">
                  <button type="button" id={`copy_decklist_btn_${deck_id}`} className="btn btn-primary" onClick={this.copyDeckList} data-toggle="tooltip" data-placement="top" title="" data-deckid={deck_id}>
                    Copy Decklist
                  </button>
                  <div style={{width: '1px', height: '1px', overflow: 'hidden', position: 'absolute'}}>
                    <textarea id={`decklist_${deck_id}`} value={exportItems.join('\n')} readOnly={true}></textarea>
                  </div>
                </div>
              </div>
              <div className="row">
                {Object.keys(deckCardsGroupedCmc).map((cmc,index) =>
                  <div className={`col-xs-${cmcColumnCount}`} key={`cmc${cmc}`}>
                    {deckCardsGroupedCmc[cmc].map(deckCard =>
                      <div className="deck_card img_zoom stacked large" key={'deck_card:' + deckCard.id} onClick={this.props.disableEdit ? null : this.props.onClick} data-value={deckCard.id}>
                        <img className="img-responsive" src={deckCard.image_url} alt={deckCard.id}/>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <h3>Sideboard</h3>
            {sideboardCards.map(sideboardCard =>
              <div className="deck_card img_zoom mini" key={'sideboard_card:' + sideboardCard.id} onClick={this.props.disableEdit ? null : this.props.onClick} data-value={sideboardCard.id}>
                <img className="img-responsive" src={sideboardCard.image_url} alt={sideboardCard.id}/>
              </div>
            )}
          </div>
        </div>,
        <div className="row" key="deckbuilder_stats">
          <div className="col-sm-4 col-xs-6">
            <ColorChart deckCards={this.props.deckCards} excludeSideboard={true} id={deck_id}/>
          </div>
          <div className="col-sm-4 col-xs-6">
            <CurveChart deckCards={this.props.deckCards} excludeSideboard={true} id={deck_id}/>
          </div>
          <div className="col-sm-4 col-xs-6">
            <TypesChart deckCards={this.props.deckCards} excludeSideboard={true} id={deck_id}/>
          </div>
        </div>
    ]);
  }
}

DeckBuilder.propTypes = {
  deckCards: PropTypes.array.isRequired,
  onClick: PropTypes.func,
  disableEdit: PropTypes.bool
};

export default DeckBuilder;
