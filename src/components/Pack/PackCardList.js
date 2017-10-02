import React from 'react';
import PropTypes from 'prop-types';
import { Link, IndexLink } from 'react-router';

class PackCardList extends React.Component {
  render() {
    var linkDisplay = {display: 'block', cursor: 'pointer'};
    return (
        <div className="row">
          {this.props.packCards.map(packCard =>
            <div className="col-sm-4 col-xs-6" key={'pack_card:' + packCard.id}>
              <a style={linkDisplay} onClick={packCard.deck_id ? null : this.props.onClick} data-value={packCard.id} style={{cursor: packCard.deck_id ? 'default' : 'pointer'}}>
                <img className="img-responsive" src={packCard.image_url} alt={packCard.id} style={{opacity: packCard.deck_id ? 0.5 : 1.0}}/>
              </a>
            </div>
          )}
        </div>
    );
  }
}

PackCardList.propTypes = {
  packCards: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired
};

export default PackCardList;
