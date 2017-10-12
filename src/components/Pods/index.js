import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as podActions from '../../actions/podActions';
import * as playerActions from '../../actions/playerActions';
import PodList from './PodList';

class PodsPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.deletePod = this.deletePod.bind(this);
  }

  componentDidMount() {
    let email = this.props.location.query['email'];
    if (email) {
      this.props.actions.loadPlayers(email);
    }
  }

  deletePod(event) {
    event.preventDefault();
    let pod = this.props.pods.filter(pod => pod.id == event.currentTarget.getAttribute('data-podid'))[0];
    this.props.actions.deletePod(pod, event.currentTarget.getAttribute('data-playerid'));
  }

  render() {
    const pods = this.props.pods;
    let content = <div className="well text-center">You have not been a part of any pods yet :(</div>
    if (pods && pods.length) {
      content = <PodList pods={pods} deletePod={this.deletePod} />
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

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Object.assign({}, playerActions, podActions), dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PodsPage);
