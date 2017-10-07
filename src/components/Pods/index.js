import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import * as podActions from '../../actions/podActions';
import PodList from './PodList';

class PodsPage extends React.Component {
  render() {
    const pods = this.props.pods;
    let content = <div className="well text-center">You have not been a part of any pods yet :(</div>
    if (pods && pods.length) {
      content = <PodList pods={pods} />
    }
    return ([
      <h1 key="pods_header">Your Pods</h1>,
      <div className="row" key="pods_content">
        <div className="col-md-6">
          {content}
        </div>
        <div className="col-md-6">
          {this.props.children}
        </div>
      </div>
    ]);
  }
}


PodsPage.propTypes = {
  pods: PropTypes.array.isRequired,
  children: PropTypes.object
};

function mapStateToProps(state, ownProps) {
  if (state.pods && state.pods.length > 0) {
    return {
      pods: state.pods
    };
  } else {
    return {
      pods: []
    }
  }
}

export default connect(mapStateToProps)(PodsPage);
