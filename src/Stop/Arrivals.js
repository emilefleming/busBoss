import React from 'react'
import Arrival from '../Arrival/Arrival';
import './Arrivals.css';
import Icon from '../Icon/Icon'
import FavoriteButton from '../Favorites/FavoriteButton';

export default function Arrivals(props) {
  const {
    arrivals,
    setHoverTrip,
    setClickedTrip,
    lastUpdated,
    stop,
    animate,
    toggleView,
    favorites,
    toggleFavorite,
    routerProps,
    centerMap
  } = props;

  const isFavorite = favorites.reduce((acc, favorite) => {
    if (favorite.stopId === stop.id && !favorite.routeId) {
      return acc = favorite;
    }
    return acc;
  }, false)

  return (
    <div className="Arrivals">
      <header>
        <div onClick={ () => { routerProps.history.push('/map') } }>
          <Icon i="arrow-left" />
        </div>
        <div className="details" onClick={() => {centerMap({ lat: stop.lat, lng: stop.lon})}}>
          <h2>{ stop.name }</h2>
        </div>
        <div onClick={ toggleView }>
          <Icon i="map"/>
        </div>
      </header>
      <div className="loader">
        <div className={`loadBar ${animate ? 'loadAnimation' : ''}`}></div>
      </div>
      <div className="arrivalList" onMouseLeave={ () => {setHoverTrip(null)} }>
        {
          arrivals.map(arrival =>
            <Arrival
              key={ arrival.tripId }
              arrival={ arrival }
              setHoverTrip={ setHoverTrip }
              setClickedTrip={ setClickedTrip }
              lastUpdated={ lastUpdated }
            />
          )
        }
        {
          !arrivals.length
            ? <div className="noArrivals">
                No departures in the next 30 minutes
              </div>
            : null
        }
      </div>
      <FavoriteButton
        isFavorite={ isFavorite }
        toggleFavorite={ toggleFavorite }
        stop={ stop }
      />
    </div>
  )
}
