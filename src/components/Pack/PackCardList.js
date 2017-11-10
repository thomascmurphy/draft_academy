import React from 'react';
import PropTypes from 'prop-types';

class PackCardList extends React.Component {
  render() {
    return (
        <div className="row">
          {this.props.packCards.map(packCard =>
            <div className="col-sm-4 col-xs-6" key={'pack_card:' + packCard.id}>
              <a onClick={packCard.deck_id ? null : this.props.onClick} data-value={packCard.id} style={{display: 'block', cursor: packCard.deck_id ? 'default' : 'pointer'}}>
                <img className="img-responsive" src={packCard.image_url} alt={packCard.id} style={{opacity: packCard.deck_id ? 0.5 : 1.0}}/>
              </a>
              <div className={this.props.showRatings ? '' : 'hidden'}>
                <div>Overall Rating: {packCard.overall_rating}</div>
                <div>Base Rating: {packCard.rating}</div>
                <div>Color Rating: {packCard.color_rating}</div>
                <div>Cast Rating: {packCard.cast_rating}</div>
                <div>Curve Rating: {packCard.curve_rating}</div>
              </div>
            </div>
          )}
        </div>
    );
  }
}

PackCardList.propTypes = {
  packCards: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  showRatings: PropTypes.bool
};

export default PackCardList;
