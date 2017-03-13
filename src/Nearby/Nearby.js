import React, { Component } from 'react';
import axios from 'axios';
import Map from '../Map/Map';
import Stop from '../Stop/Stop';
import './Nearby.css'

export default class Nearby extends Component {
  constructor(props) {
    super(props)

    this.state = {
      stops: [],
      arrivals: [],
      activeStop: {}
    };

    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.setActiveTrip = this.setActiveTrip.bind(this);
  };

  componentDidMount() {
    axios.get(`/api/stops`)
      .then(response => {
        this.setState({
          stops: response.data
        })
      })
      .catch(err => {console.log(err)});
  };

  onMarkerClick(stop) {
    this.setState({ activeStop: stop });
    axios.get(`/api/stops/${stop.id}/arrivals`)
      .then(response => {
        console.log(response);
        this.setState({
          arrivals: response.data
        })
      })
      .catch(err => {console.log(err)})
  }

  setActiveTrip(arrival) {
    let activeTrip = null;

    if (arrival) {
      activeTrip = arrival
    }
    this.setState({ activeTrip })
  }

  render() {
    const { state, onMarkerClick, setActiveTrip } = this;
    const { stops, arrivals, activeStop, activeTrip } = state;
    return (
      <div className="Nearby">
        <Stop
          arrivals={ arrivals }
          stop={ activeStop }
          setActiveTrip={setActiveTrip}
        />
        <div className="map">
          <Map
            stops={ stops }
            arrivals={ arrivals }
            onMarkerClick={ onMarkerClick }
            activeTrip={ activeTrip }
            activeStop={ activeStop }
          />
        </div>
      </div>
    )
  }
}