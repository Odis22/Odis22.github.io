
//Create map
var map, marker, infowindow;
var richmond = {lat: 29.567496, lng: -95.713618};


//array of markers
var markers = [];
var textSearchrequest;
var unit = 8046.72;
radius = unit;


var self = this;
self.allPlaces = ko.observableArray([]);
self.rangeValue = ko.observable(1);
this.placesSearch = ko.observable("");
  self.searchText = ko.observable('');
	
	self.filterPlaces = ko.computed(function() {
		var search = self.searchText().toLowerCase();
		var returnArray = [];
// hide all markers
  for (var i=0; i<markers.length; i++) {
    markers[i].setVisible(false);
  }
  for (var j=0,place; j<self.allPlaces().length; j++) {
    place = self.allPlaces()[j];
	var doesMatch = place.name.toLowerCase().indexOf(search) >= 0;
     if (doesMatch) {
// add those places where name contains search text
      returnArray.push(place);
      for(var e = 0; e < markers.length; e++) {      
// makes those markers visible
        if(place.place_id === markers[e].place_id) { 
          markers[e].setVisible(true);
        }
      }
    }
  }
  return returnArray;
});
   



//for the use with knockout binding
var data = {
  'Locations': {
    'arrLocations': []
  }
};

var viewModel = {
  location: ko.observable(),
  placetypes: ['gym', 'restaurant', 'store', 'stadium','supermarket','school','amusement_park', 'night_club', 'church','school'],
  Locations: ko.observableArray(data.Locations.arrLocations),
  keyword: ko.observable(''),
  focusMarker: function(place) {

        var marker;
        for (var i = 0; i < markers.length; i++) {
            if (place.place_id === markers[i].place_id) {
                google.maps.event.trigger(markers[i], 'click');
            }
        }
}
};


//Create a map
function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: richmond,
    zoom: 13,
    mapTypeId: 'roadmap',
    mapTypeControl: false
  });
  
  drawMyMarker();
	var bounds = map.getBounds();

  infowindow = new google.maps.InfoWindow();


  var request = {
    location: richmond,
	radius: radius,
    type: ['bar']
  };

  //set the please search service.
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);


  viewModel.Locations.subscribe(function (newValue) {
    console.debug("changing", newValue);
    //remove old marker items
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    
var keyword = self.placesSearch();
	
    var requestByUser = {
      location: richmond,
      radius: radius,
      keyword: self.placesSearch(),
      type: newValue
    };

   

 
      service.nearbySearch(requestByUser, callback);

  });
  
  function drawMyMarker() {
    myLatlng = new google.maps.LatLng(29.567496, -95.713618);
    myMarker = new google.maps.Marker({
        map: map,
        title: 'My location',
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        position: myLatlng
    });
}

  

	self.rangeValue.subscribe(function(newvalue) {
        radius = unit * newvalue;
    });
	


    toRadians = function (num) {
        return num * Math.PI / 180;
    };

    function callback(results, status, pagination) {

        if (status === google.maps.places.PlacesServiceStatus.OK) {
            self.allPlaces.removeAll();
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
                bounds.extend(results[i].geometry.location);


                var R = 3961;
                let destinationLat = results[i].geometry.location.lat();
                let destinationLng = results[i].geometry.location.lng();
                var f1 = toRadians(29.567496);
                var f2 = toRadians(destinationLat);
                var deltaLat = destinationLat - 29.567496;
                var deltaLng = destinationLng - (-95.713618);
                var delt1at = toRadians(deltaLat);
                var deltlng = toRadians(deltaLng);
                var a = Math.sin(delt1at / 2) * Math.sin(delt1at / 2) +
                    Math.cos(f1) * Math.cos(f2) *
                    Math.sin(deltlng / 2) * Math.sin(deltlng / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c;
                distance = +(Math.round(d + "e+2") + "e-2");
                results[i].distance = distance + "miles";

            }
            map.fitBounds(bounds);
            results.forEach(getAllPlaces);
        }
    }




    function createMarker(place) {
        var bounds = new google.maps.LatLngBounds();
        var photos = place.photos; // photos of the place from place service
        var photoUrl = ''; // Url of place photo
        if (!photos) {
            photoUrl = 'not found';
        } else {
            photoUrl = photos[0].getUrl({
                'maxWidth': 200,
                'maxHeight': 200
            });
        }
        self.fourSquareAPI = '';
        var url;
        var twitter;
        var formattedPhoneNumber;
		
		var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

        var marker = new google.maps.Marker({
            map: map,
            place_id: place.place_id,
			icon: image,
            title: place.name,
			visible: true,
            animation: google.maps.Animation.DROP,
            position: place.geometry.location
        });
		
		var rating;
        if (place.rating !== undefined) {
            rating = place.rating;
		} else {
			rating = "google does not have a rating available";
		}
		place.rating = rating;
		
        if (place.vicinity !== undefined) {
            address = place.vicinity;
        } else if (place.formatted_address !== undefined) {
            address = place.formatted_address;
        }
        place.address = address;

        var contentString = '';
        var client_id = '1JM24EFDXPAAABQRAZQD5MBRRNDONBTF1ZBCX0SDPE2P5XND';
        var client_secret = 'S4AYKN2LZIJEGLKXCSWGQAOOBDVAYGPC2HU11DRPSGRBSFQ0';
        // foursquare api url
        var foursquare = "https://api.foursquare.com/v2/venues/search?v=20161016&ll=" + place.geometry.location.lat() + "," + place.geometry.location.lng() + "&query=" + encodeURIComponent(place.name) + "&client_id=NJRWCXZ0BLUWN0KXAB1NY4XHKSSZJ0WAXRKFMUY3KBBCSA2D&client_secret=CDS2BRNZFO1MYBV0220LN4QYVGGVN0JPMRIAFHVSGRM1RDJ1";

        // start ajax and grab: venue name, phone number and twitter handle
        $.getJSON(foursquare)
            .done(function (response) {
				let info = '';
				if (response.response.venues[0]) {
					if (response.response.venues[0].contact.formattedPhone ) {
						info += response.response.venues[0].contact.formattedPhone +"<br>";
					}
					if (response.response.venues[0].url) {
						info += "<a href='"+response.response.venues[0].url+"' target='_new'>website</a><br>";
					}
					if (response.response.venues[0].contact.twitter) {
						info += "twitter: @"+response.response.venues[0].contact.twitter+"<br>";
					}
				} else {
					info = "information not found";
					console.log(this.url);
				}
				
				
				
				if(photoUrl === 'not found') {
					contentString = '<div class="infoWindowContainer"></div><div class="infoWindowText"><b>' + place.name + '</b><div>' + place.address + '</div><div> Rating: ' + place.rating + '</div></div>' + '<p>' + info ;
				} 
				else {
					contentString = '<div class="infoWindowContainer"><img class="infoWindowImage" src="' + photoUrl + '"></img></div><div class="infoWindowText"><b>' + place.name + '</b><div>' + place.address + '</div><div> Rating: ' + place.rating + '</div></div>' + '<p>' + info ;
				}

                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.setContent(contentString);
                    infowindow.open(map, this);
                    map.panTo(marker.position);
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    setTimeout(function () {
                        marker.setAnimation(null);
                    }, 1450);
					self.focusMarker;				
                });

            }).fail(function(error) {
                     alert("Foursquare API has failed, error details:" + error);
                 });
		
		
        markers.push(marker);
        return marker;
    }
	

    function getAllPlaces(place) {
        var placeit = {};
        placeit.place_id = place.place_id;
        placeit.position = place.geometry.location.toString();
        placeit.name = place.name;
		placeit.showPlace = ko.observable(true);
        placeit.distance = place.distance;

        var address;
        if (place.vicinity !== undefined) {
            address = place.vicinity;
        } else if (place.formatted_address !== undefined) {
            address = place.formatted_address;
        }
        placeit.address = address;


        self.allPlaces.push(placeit);
    }
	
	  function clearMarkers() {
    for (var i = 0; i < markers.length; i++ ) {
      if (markers[i]) {
        markers[i].setMap(null);
      }
    }

    // reset markers
    markers = []; 
}



  }
  
   // Google Map Error
 function googleError() {
     alert("Google Maps did not load");
 }

  //Notify on array changes for knockout part
  viewModel.Locations.notifySubscribers();
  //apply bindings
  ko.applyBindings(viewModel);

