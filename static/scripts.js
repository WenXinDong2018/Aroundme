// Google Map
let map;
//service for gogle places
let service;

//center of map
let center;

//place info
let placesInfo={}

//markers
let markers={};

//carousel index
let CarIndex = 0;

//allow multiple types in search
let storeResults;

let restuarantResults;

let maxZ=1;

// Execute when the DOM is fully loaded
$(document).ready(function() {
    // Get DOM node in which map will be instantiated
    let canvas = $("#map-canvas").get(0);

    // Styles for map
    // https://developers.google.com/maps/documentation/javascript/styling
    let styles =
    [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fdfcf8"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f8c967"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#e9bc62"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e98d58"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#db8555"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#806b63"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8f7d77"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b9d3c2"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#92998d"
      }
    ]
  }
]
    // Options for map
    // https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    let options = {
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        maxZoom: 17,
        panControl: true,
        styles: styles,
        zoom: 17,
        zoomControl: true
    };

    // Instantiate map
    map = new google.maps.Map(canvas, options);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            center = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            map.setCenter(center);
            setMarker();
            weather();
        }, function(){
            center = new google.maps.LatLng(41.3184,-72.9318);
            map.setCenter({lat: 41.3184, lng: -72.9318});
            setMarker();
            weather();
        });
    }
    else{
        center = new google.maps.LatLng(41.3184,-72.9318);
        map.setCenter({lat: 41.3184, lng: -72.9318});
        setMarker();
        weather();
    }

    // Configure UI once Google Map is idle (i.e., loaded)
    google.maps.event.addListenerOnce(map, "idle", configure);
});

function setMarker(){
  let markerIcon = {
    url: 'http://image.flaticon.com/icons/svg/252/252025.svg',
    scaledSize: new google.maps.Size(50, 50),
    labelOrigin:new google.maps.Point(23,60),

  };
  let marker = new google.maps.Marker({
      draggable:true,
      animation: google.maps.Animation.DROP,
      position: map.getCenter(),
      icon:markerIcon,
      label:{
        text:"Around Me",
        fontSize:"16px",
        fontWeight:"800",
        color:"#af3513"
      }
  });
  marker.setMap(map);
  google.maps.event.addListener(marker, 'dragend', function(){
    center=marker.getPosition();
    $('.info').remove();
    placesInfo={};
    $.each(markers, function( index,row ){
      setMapOnAll(row,null);
    });
    markers={};
  });
}


// Show info for the first time
function getInfo(divId, content)
{
    // Start div
    let div = "<div class='info card card-body'>";
    if (typeof(content) == "undefined"){
        // http://www.ajaxload.info/
        div += "<img alt='loading' src='/static/ajax-loader.gif'/>";
    }
    else{
        div += content;
    }

    // End div
    div += "</div>";
    $(divId).append(div);
}

//show info div in divId
function showInfo(divId){
    $(divId).find(".info").show();
}
//hid info div in divId
function hideInfo(divId){
    $(divId).find(".info").hide();
}

//find restuarants
function restuarants(){
    //new google.maps.LatLng(-33.8665433,151.1956316)
    var request = {
        location: center,
        type: ['restaurant'],
        radius: '800'
    };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, cafe);
}

//find cafe
function cafe(results, status){
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    restuarantResults = results;
    let request = {
      location: center,
      type: ['cafe'],
      radius: '800'
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, function(results2,status2){
        if (status2 == google.maps.places.PlacesServiceStatus.OK) {
           $.each(results2, function( index,row ) { row["iconType"]=2});
            results=$.merge(results2,restuarantResults);
            callback(results, status,"restuarants","#restuarants","dining.png","coffee.png");
        }
    });
  }
}

//find restuarants
function gym(){
    //new google.maps.LatLng(-33.8665433,151.1956316)
    var request = {
        location: center,
        type: ['gym'],
        radius: '800'
    };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, function(results, status){
    callback(results, status,"gym","#gym","man.png","");

  });
}


//what to do with places search results-->open parentDiv and set markers
function callback(results, status,placeType,parentDiv,iconType,iconType2) {

  if (status == google.maps.places.PlacesServiceStatus.OK) {

    markers[placeType]=[];

    placesInfo[placeType]={};
    //content for #restuarant in index.html
    let content = "<ul>";
    //for each restuarant
    $.each(results, function( index,row ) {
      let id = row["id"];

      placesInfo[placeType][id] = row;

      //add each restuarant to #restuarant
      content +=  "<a href='#' onclick=\"openInfo(\'" + id + "\',\'"+placeType+"\')\"><li>" + row['name'] + "</li></a>";
      //set marker for each restuarant

      //restuarant icon
      if(typeof iconType2!==undefined && iconType2!==null && row["iconType"]==2){
        var icon = {
          url: "https://maps.google.com/mapfiles/kml/shapes/"+iconType2, // url
          scaledSize: new google.maps.Size(30, 30), // scaled size
        };
      }
      else
      {
        var icon = {
          url: "https://maps.google.com/mapfiles/kml/shapes/"+iconType, // url
          scaledSize: new google.maps.Size(30, 30), // scaled size
        };
      }


      let marker = new google.maps.Marker({
          position: row["geometry"]["location"],
          map:map,
        	icon: icon
      });
      //set info window for each restuarant
      let infowindow = new google.maps.InfoWindow();

      google.maps.event.addListener(infowindow, 'domready', function() {
        infoStyle();
      });

      //add listener, when user clicks marker, open up info window
      marker.addListener('click', function() {
        let map =infowindow.getMap();
        if (map!==null&& typeof map !== "undefined"){
          infowindow.close();
          return;
        }
        //if content of info window has not been set yet
        if (infowindow.content==null || typeof infowindow.content==undefined){
            placeDetail(id, placeType, function(){
            maxZ+=1
            infowindow.setZIndex(maxZ+1);
            infowindow.setContent(infoContentPlace(row));
            infowindow.open(map, marker);
          });
        }
        else
        {
          maxZ+=1
          infowindow.setZIndex(maxZ+1);
          infowindow.open(map, marker);
        }

      });

      row["marker"]=marker;
      row["infowindow"]=infowindow;

      markers[placeType].push(marker);
    });
    content+="</ul>";
    //show #restuarant div
    getInfo(parentDiv,content);
  }
}

//find stores + supermarkets
function stores(){
  //new google.maps.LatLng(-33.8665433,151.1956316)
  let request = {
      location: center,
      type: ['convenience_store'],
      radius: '800'
  };
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, supermarkets);
}

//find supermarkets
function supermarkets(results, status){
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    storeResults = results;
    let request = {
      location: center,
      type: ['supermarket'],
      radius: '800'
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, function(results2,status2){
        if (status2 == google.maps.places.PlacesServiceStatus.OK) {
            $.each(results2, function( index,row ) { row["iconType"]=2});
            results=$.merge(results2,storeResults);
            callback(results, status,"stores","#stores","convenience.png","grocery.png");
        }
    });
  }
}


//set info window style
function infoStyle(){
  // Reference to the DIV which receives the contents of the infowindow using jQuery
 var iwOuter = $('.gm-style-iw');

 var iwBackground = iwOuter.prev();

 // Remove the background shadow DIV
 iwBackground.children(':nth-child(2)').css({'display' : 'none'});

 // Remove the white background DIV
 iwBackground.children(':nth-child(4)').css({'display' : 'none'});

  // Changes the desired tail shadow color.
  iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'white 0px 1px 6px', 'z-index' : '1'});
  //close button
  var iwCloseBtn = iwOuter.next();

  // Apply the desired effect to the close button
  iwCloseBtn.css({
    opacity: '0.7', // by default the close button has an opacity of 0.7
    right: '50px', top: '0px', // button repositioning
    border: '7px solid #7c871b', // increasing button border and new color
    'border-radius': '13px', // circular effect
    'box-shadow': '0 0 5px #515911' // 3D effect to highlight the button
  });
}


//write out content for info box of place
function infoContentPlace(row)
{
  let infoContent = {};

  if (row["formatted_address"]==null){
      infoContent['Address'] = row['vicinity'];
  }
  else{
      infoContent['Address'] = row['formatted_address'];
  }
  if (row["rating"]!=null){
      infoContent['Rating'] = row['rating'];
  }
  if (row["formatted_phone_number"]!=null){
      infoContent['Phone'] = row['formatted_phone_number'];
  }

  if (row["reviews"]!=null){
      infoContent['Reviews'] = [];

      $.each(row["reviews"], function(index, value) {
          if (index >= 5) {
                 return false;
          }
      //I only put this to show what these variables do for you
          infoContent['Reviews'].push(value['text']);
      });
  }

  let content = "<div style = '\"z-index\"=auto;' class = 'infoContent' id = " + row["id"] + ">";
  //add title
  if (row["website"]!=null){
      content+= "<div class='title'><a href = \'"+row["website"]+"\'>" + row['name'] + "</a></div>";
  }
  else{
      content+= "<div class='title'>" + row['name'] + "</div>";
  }
  //add carousel
  if (row["photos"]!=null){
    content+= carousel(row["photos"]);

  }

  content += "<div class = 'textContent'>";

  $.each(infoContent, function( index,row ) {
      if (index=="Reviews"){
          content +="<div><strong>" + index + ":</strong></div>";
          $.each(row, function(index, value) {
              content +="<div>" + value + "</div><br>";
          });
      }
      else{
          content +="<div><strong>" + index + ":</strong> " + row + "</div>";
      }
  });

  content+="</div></div>";

  return content;
}

//ask for additional info about the place(restuarant,store)
function placeDetail(id,placeType,callback){

  let placeInfo = placesInfo[placeType];
  let request = {
      placeId: placeInfo[id]["place_id"],
      fields: ['formatted_phone_number', 'formatted_address','website','reviews','photos']
  };
  service = new google.maps.places.PlacesService(map);
  service.getDetails(request, function(results, status){
      if (status == google.maps.places.PlacesServiceStatus.OK) {
          placeInfo[id]["formatted_address"] = results["formatted_address"];
          placeInfo[id]["formatted_phone_number"] = results["formatted_phone_number"];
          placeInfo[id]["website"] = results["website"];
          placeInfo[id]["reviews"] = results["reviews"];
          placeInfo[id]["photos"] = results["photos"];
      }
      callback();
  });
}

function carousel(photos){

  let imgURL_first = photos[0].getUrl({'maxWidth': 340, 'maxHeight': 800});

  let content="<div id='carouselExampleIndicators"+CarIndex+"' class='carousel slide' data-ride='carousel'>"+

    "<div class='carousel-inner crop'>"+
      "<div class='carousel-item active'>"+
      "<img class='d-block w-100' src=\'" +  imgURL_first + "\' alt='First slide'>"+
      "</div>";
  let num = 1;
  $.each(photos,function(index,row) {
    if (num>4 || row==null||index<=0){
          return;
    }
    if(row["height"]>row["width"]){
        return;
    }
    num+=1;
    let imgURL = row.getUrl({'maxWidth': 340, 'maxHeight': 340});
    content+="<div class='carousel-item'>"+
    "<img class='d-block w-100' src=\'" +  imgURL + "\'>"+
    "</div>";
  });

  content+="</div>";

  content+=
  "<a class='carousel-control-prev' href='#carouselExampleIndicators"+CarIndex+"' role='button' data-slide='prev'>" +
    "<span class='carousel-control-prev-icon' aria-hidden='true'></span>"+
    "<span class='sr-only'>Previous</span>"+
  "</a>"+
  "<a class='carousel-control-next' href='#carouselExampleIndicators"+CarIndex+"' role='button' data-slide='next'>"+
    "<span class='carousel-control-next-icon' aria-hidden='true'></span>"+
    "<span class='sr-only'>Next</span>"+
  "</a>"+
  "</div>";
    CarIndex+=1;
    return content;


}

//onclick hyperlink, open up infowindow
function openInfo(id,placeType)
{
  let placeInfo = placesInfo[placeType];
  let infowindow = placeInfo[id]["infowindow"];

  let marker = placeInfo[id]["marker"];
  let map = infowindow.getMap();
  // if infowindow is already open
  if(map !== null && typeof map !== "undefined"){
    infowindow.close();
    return;
  }
  //if content of infowindow has not been set yet
  if (infowindow.content==null || typeof infowindow.content == undefined ){
    placeDetail(id, placeType, function(){
      infowindow.setContent(infoContentPlace(placeInfo[id]));
      maxZ+=1
      infowindow.setZIndex(maxZ+1);
      infowindow.open(map, marker);
    });
  }
  else{
    maxZ+=1
    infowindow.setZIndex(maxZ+1);
    infowindow.open(map, marker);
  }
}

//onclick articles button
function articles(){


  $.getJSON("/articles",function(data) {
    var content = "<ul>";
    $.each(data, function( index,row ) {
        content +=  "<a href=" + row['link']+  " target='_blank'><li>" + row['title'] + "</li></a>";
    });
    content+="</ul>"
    getInfo("#articles",content);
  });
}

//onclick trend button. Open Info window with content from Json
function trends(){
  $.getJSON("/trends", {lat:center.lat,lng:center.lng}, function(data) {

    let content = "<div id = 'trendTitle'>"+data[1]+" trends</div>";
    content+="<ul>";
    $.each(data[0], function( index,row ) {
        content +=  "<a href=" + row['url']+  " target='_blank'><li>" + row['name'] + "</li></a>";
    });
    content+="</ul>";
    getInfo("#trends",content);
  });
}

//function to load weather info
function weather(){

  $.getJSON("/weather", {lat:center.lat,lng:center.lng}, function(data) {
    //     returned values : [curent, forecast,location]
    //set infor for current div
    let currentContent ="<p id = 'city'>" + data[2]["city"]+", <span id='country'>"+data[2]["country"]+"</span></p>"+
                        "<p class = 'degree currentDegree'>"+data[0]["temp"]+"F</p>"+
                        "<p class = 'text'>"+data[0]["text"]+"</p>";
    $('#currentWeather').html(currentContent);
    //set infor for forecast div
    let forecastContent = "<ul class = 'forecastDay'>";

    $.each(data[1], function( index,row ) {
        forecastContent +=  "<li>" +
                                "<div class = 'day'>"+row['day']+"</div>"+
                                "<div class = 'degree'>"+ row['high']+"/" + row['low']+"F</div>"+
                            "</li>";
    });
    forecastContent += "</ul'>";
    $('#forecast').html(forecastContent);

  });
}

function setMapOnAll(markerList,mapOrNull) {
  $.each(markerList, function( index, value ) {
      value.setMap(mapOrNull);
  });
}

// Configure application
function configure()
{
  //onclick articles
  onclickShowInfo("#articles .btn",'#articles',articles,null);

  //onclick articles
  onclickShowInfo("#gym .btn",'#gym',gym,"gym");

  //onclick restuarants
  onclickShowInfo("#restuarants .btn",'#restuarants',restuarants,"restuarants");

  //onclick stores
  onclickShowInfo("#stores .btn",'#stores',stores,"stores");

  //onclick trends
  onclickShowInfo("#trends .btn",'#trends',trends,null);

  $(document).on("click",".infoContent",function(e) {
    let id = $(this).attr("id");
    let infowindow;
    $.each(placesInfo, function( index,row ) {
      if (row[id]!==null || typeof row[id]!==undefined ){
        infowindow = row[id]["infowindow"];
        return;
      }
    });
    maxZ+=1
    infowindow.setZIndex(maxZ);
  });

  // Re-enable ctrl- and right-clicking (and thus Inspect Element) on Google Map
  // https://chrome.google.com/webstore/detail/allow-right-click/hompjdfbfmmmgflfjdlnkohcplmboaeo?hl=en
  document.addEventListener("contextmenu", function(event) {
      event.returnValue = true;
      event.stopPropagation && event.stopPropagation();
      event.cancelBubble && event.cancelBubble();
  }, true);

}

function onclickShowInfo(selector, parentDiv, callback, markerType){

    //onclick selector
  $(selector).click(function(e){
    if (e.target !== this)
      return;
    //if first time
    if(!$(parentDiv).find('.info').length){
      callback();
    }
    //if not for the first time
    else{
        //to show
      if ($(parentDiv).find('.info').is(':hidden')){
        showInfo(parentDiv);
        if(markerType!=null)
        {
          //show markers
          setMapOnAll(markers[markerType],map);
        }
      }
      //to hide
      else{
        hideInfo(parentDiv);
        if(markerType!=null)
        {
          //show markers
          setMapOnAll(markers[markerType],null);
        }
      }
    }
  });

}











