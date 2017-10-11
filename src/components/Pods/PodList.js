import React from 'react';
import PropTypes from 'prop-types';
import { Link, IndexLink } from 'react-router';

const PodList = ({pods}) => {
  return (
      <table className="table">
        <tbody>
          {pods.map(pod =>
            <tr key={pod.id} className={pod.complete ? '' : 'success'}>
              <td><strong style={{marginRight: '5px'}}>{pod.name}</strong><span className="badge">{pod.complete ? 'Complete' : 'Ongoing'}</span></td>
              <td className="text-right">
                <Link to={!pod.complete ? `/players/${pod.player_hash}/pack` : `/pods/${pod.id}/recap`} className={!pod.complete ? "btn btn-xs btn-success" : "btn btn-xs btn-primary"}>{!pod.complete ? "Continue" : "Recap"}</Link>
                <Link to={`/players/${pod.player_hash}/deck`} className={"btn btn-xs btn-info margin_left" + (pod.complete ? "" : " hidden")}>Your Deck</Link>
                <button className={!pod.is_owner ? "hidden" : "btn btn-xs btn-danger margin_left"} data-podid={pod.id} data-playerid={pod.player_id}>Delete</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
  );
};

PodList.propTypes = {
  pods: PropTypes.array.isRequired,
  deletePod: PropTypes.func.isRequired
};

export default PodList;
