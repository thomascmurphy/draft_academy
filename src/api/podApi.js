class PodApi {
  static getAllPods() {
    return fetch(`${process.env.REACT_APP_API_HOST}/api/v1/pods`).then(response => {
      return response.json();
    }).catch(error => {
      return error;
    });
  }

  static getPod(podId) {
    return fetch(`${process.env.REACT_APP_API_HOST}/api/v1/pods/${podId}`).then(response => {
      return response.json();
    }).catch(error => {
      return error;
    });
  }

  static createPod(pod) {
    var player_emails = pod.players.map(player => player.email);
    const request = new Request(`${process.env.REACT_APP_API_HOST}/api/v1/pods`, {
      method: 'POST',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({pod: pod, players: pod.players}),
      mode: 'cors'
    });

    return fetch(request).then(response => {
      return response.json();
    }).catch(error => {
      return error;
    });
  }

  static updatePod(pod) {
    const request = new Request(`${process.env.REACT_APP_API_HOST}/api/v1/pods/${pod.id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({pod: pod})
    });

    return fetch(request).then(response => {
      return response.json();
    }).catch(error => {
      return error;
    });
  }

  static deletePod(pod, playerId) {
    const request = new Request(`${process.env.REACT_APP_API_HOST}/api/v1/pods/${pod.id}?player_id=${playerId}`, {
      method: 'DELETE'
    });

    return fetch(request).then(response => {
      return response.json();
    }).catch(error => {
      return error;
    });
  }

  static getAllSets() {
    return fetch(`${process.env.REACT_APP_API_HOST}/api/v1/sets`).then(response => {
      return response.json();
    }).catch(error => {
      return error;
    });
  }



}



export default PodApi;
