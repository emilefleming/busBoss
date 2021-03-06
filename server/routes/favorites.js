const router = require('express').Router();
const authorize = require('../authorize');
const knex = require('../../knex');
const fetchArrivals = require('../util/fetchArrivals');
const { camelizeKeys, decamelizeKeys } = require('humps');
const axios = require('axios');
const ev = require('express-validation');
const validations = require('../validations/favorites');


router.get('/:id', authorize, (req, res, next) => {
  knex('users_favorites')
    .where('user_id', req.claim.userId)
    .then(response => {
      const favorites = camelizeKeys(response);

      return Promise.all(
        favorites.map(favorite => {
          return new Promise((resolve, reject) => {
            let stop;
            axios.get(`http://api.pugetsound.onebusaway.org/api/where/stop/${favorite.stopId}.json?key=${process.env.OBA_KEY}`)
              .then(stopResponse => {
                stop = stopResponse.data;
                return fetchArrivals(favorite.stopId)
              })
              .then(arrivals => {
                stop.arrivals = arrivals;
                stop.favoriteRoute = favorite.routeId;
                stop.favoriteRouteName = favorite.routeName;
                stop.id = favorite.id;
                resolve(stop);
              })
              .catch(err => {
                console.log(err);
                resolve(stop);
              })
          })
        })
      );
    })
    .then(favorites => {
      res.send(favorites);
    })
    .catch(err => next(err));
});

router.get('/:id/list', authorize, (req, res, next) => {
  knex('users_favorites')
    .where('user_id', req.claim.userId)
    .then(response => {
      res.send(camelizeKeys(response));
    })
});

router.post('/:id', authorize, ev(validations.post), (req, res, next) => {
  const { stopId, routeId, routeName } = req.body;
  const newFavorite = decamelizeKeys({
    userId: req.claim.userId,
    stopId,
    routeId,
    routeName
  })

  knex('users_favorites')
    .insert(newFavorite, '*')
    .then(favorites => {
      res.send(camelizeKeys(favorites[0]));
    })
    .catch(err => next(err));
});

router.delete('/:id/:favoriteId', authorize, (req, res, next) => {
  knex('users_favorites')
    .del('*')
    .where({
      user_id: req.claim.userId,
      id: req.params.favoriteId
    })
    .then(response => {
      res.send(response)
    })
    .catch(err => next(err));
});

module.exports = router;
