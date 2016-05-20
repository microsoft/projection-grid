import $ from 'jquery';
import Backbone from 'backbone';
import template from './map-view.jade';

var mapKey = 'Aitu1GXEVDLOMeRerogqYje1eqGGfi_anQ0uPmUkIqnCgwm72G2zdJj9a-sDS0Qe';
var map = null;

function showCity(cityName) {
  $.getJSON('http://dev.virtualearth.net/REST/v1/Locations/?q=' + cityName + '&key=' + mapKey + '&jsonp=?', function (data) {
    var coordinates = data.resourceSets[0].resources[0].point.coordinates;
    var location = new window.Microsoft.Maps.Location(coordinates[0], coordinates[1]);
    map.setView({
      center: location,
      zoom: 10,
    });
  });
}

function hideMap() {
  $('.container-map').hide();
}

function showMap(cityName) {
  $('.container-map').show();
  if (!map) {
    map = new window.Microsoft.Maps.Map(document.getElementById('myMap'), {
      credentials: mapKey,
    });
  }
  showCity(cityName);

  function dismissOnClick(e) {
    if (!$(e.target).closest('#myMap').length) {
      hideMap();
      $('body').off('click', dismissOnClick);
    }
  }
  $('body').on('click', dismissOnClick);
}

hideMap();

export default class MapView extends Backbone.View {
  events() {
    return {
      'click button': e => {
        showMap(this.model.City);
        e.stopImmediatePropagation();
      },
    };
  }

  initialize() {
  }

  render() {
    this.$el.html(template(this.model));
    return this;
  }
}
