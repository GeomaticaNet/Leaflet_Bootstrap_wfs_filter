// myleaflet.js
//===========================================================================================
/* 
FUNCION QUE ARREGLA EL BUG DE LOS BORDES DE LAS TESELAS DE LEAFLET EN CHROME.
COPIAR Y PEGAR EN CADA PROYECTO.
*/

(function () {
    var originalInitTile = L.GridLayer.prototype._initTile;
    L.GridLayer.include({
        _initTile: function (tile) {
            originalInitTile.call(this, tile);

            var tileSize = this.getTileSize();

            tile.style.width = tileSize.x + 1 + "px";
            tile.style.height = tileSize.y + 1 + "px";
        },
    });
})();

/*===========================================================================================
    FUNCIÓN QUE CONTROLA CUANDO SE PRESIONA ENTER EN EL CUADRO DE TEXTO DE BÚSQUEDA
===========================================================================================*/

$(document).ready(function () {

    $("input[type=text]").val(""); // Borra el contenido del cuadro de texto.
    $(".alert").hide();            // Oculta la alerta.
    $("#search-value").on("keydown", function (e) {
        // Si el usuario presiona la tecla Enter (código de tecla 13) en el teclado.
        if (e.keyCode == 13) {
            e.preventDefault();
            searchWFS(); // Llama a la función que busca el item introducido.
        }
    });
});

//==========================================================================================

var qLayer = null;
var queryBox = null;
var wfsPolylayer;
var wfsSelangor = new L.featureGroup();
var newGroup = new L.featureGroup();

// Geoserver settings
// URL WMS MALASIA CORTA https://nas-st.dyndns.org/geoserver/sghg4583/wms?
// URL WMS MALASIA LARGA https://nas-st.dyndns.org/geoserver/sghg4583/wms?service=wms&version=1.3.0&request=GetCapabilities

var url_geoserver = "https://nas-st.dyndns.org/geoserver/sghg4583/wms?";
var url_geoserver_wfs = "https://nas-st.dyndns.org/geoserver/sghg4583/ows?";


var url_geoserver_utm = "https://www.geoinfo.utm.my/geoserver/pbt.pengerang/wms?";

// Get WMS layer from Geoserver
var wmsSelangor = new L.tileLayer.wms(url_geoserver, {
    layers: "sghg4583:selangor_postgis",
    format: "image/png8",
    transparent: true,
    tiled: true,
    opacity: 0.6,
    zIndex: 100,
    //cql_filter: "dun='N.36 Damansara Utama'",
    attribution: "Datos desde Geoserver"
});

// Consulta CQL filtrada
//https://nas-st.dyndns.org/geoserver/sghg4583/ows?service=wfs&version=1.1.0&request=GetFeature&typeNames=sghg4583:selangor_postgis&outputFormat=application/json&cql_filter=dun=%27N.36%20Damansara%20Utama%27

//cql_filter=dun=%27N.36%20Damansara%20Utama%27




var wmsJohor = new L.tileLayer.wms(url_geoserver_utm, {
    layers: "pbt.pengerang:mukim",
    format: "image/png8",
    transparent: true,
    tiled: true,
    opacity: 1.0,
    zIndex: 100,
    attribution: "Datos desde Geoserver UTM"
});


// Get WFS layer from Geoserver
var wfsURL = url_geoserver_wfs + "service=wfs&version=1.1.0&request=GetFeature&typeNames=sghg4583:selangor_postgis&outputFormat=application/json";


// WFS styling
var geojsonWFSstyle = {
    fillColor: "#8ea8c3",
    fillOpacity: 0.4,
    color: "#23395b",
    weight: 1,
    opacity: 0.6
};

async function getWFSgeojson() {

    try {
        const response = await fetch(wfsURL);
        return await response.json();
    } catch (err) {
        console.log(err);
    }
}

getWFSgeojson().then(data => {
    //console.log(data);
    wfsPolylayer = L.geoJSON([data], {
        onEachFeature: function (f, l) {
            //console.log('f', f);
            l.on({
                mouseover: highlightFeature,
                mouseout: resetHighlight
            });
            var customOptions = {
                "maxWidth": "500px",
                "className": "customPop"
            }
            var popupContent = "<div><b>" + f.properties.parlimen + "</b></div>" + f.properties.dun + "</div>";
            l.bindPopup(popupContent, customOptions);
        },
        style: geojsonWFSstyle
    }).addTo(wfsSelangor);
    map.fitBounds(wfsPolylayer.getBounds());
});

// Get other WFS service
function countryFilter(feature) {
    //console.log('feature', feature);
    if (feature.id == "MYS") {
        return true;
    }
}

var url = "https://nas-st.dyndns.org/countries.geo.json"

// Get JSON using jQuery for Country (MYS) polygons
$.getJSON(url, function (geojsonData) {
    var geojsonLayer = new L.geoJSON(geojsonData, {
        filter: countryFilter,
        style: function (feature) {
            return {
                "weight": 0,
                "fillColor": "yellow",
                "fillOpacity": 0.3
            }
        }
    }).addTo(newGroup);
});
// Get JSON using jQuery for Boundary polylines
var geojsonLayer2;
$.getJSON(url, function (geojsonData) {
    geojsonLayer2 = new L.geoJSON(geojsonData, {

        style: function (feature) {
            return {
                "weight": 2,
                "color": "red",
                "fillOpacity": 0
            }
        }
    });
    controlLayers.addOverlay(geojsonLayer2, "Límites de países (GeoJSON)");
});


// Map Attributes
var mAttr = "";

// OSM Tiles
var osmUrl = "https://{s}.tile.osm.org/{z}/{x}/{y}.png";
var osm = L.tileLayer(osmUrl, { attribution: mAttr });

// CartoDB Tiles
var cartodbUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";
var cartodb = L.tileLayer(cartodbUrl, { attribution: mAttr });


var mapbox = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWF0dTI5ODIiLCJhIjoiY2ozbnE4aHU2MDAyajJ3bGdwMDV3N2M0cSJ9.t7at_aruzOdsPgL43MrxpQ'
});


var map = L.map("map", {
    center: [3.197288, 101.577180],
    zoom: 9,
    minZoom: 3,
    layers: [wfsSelangor, mapbox]
});

// Get map's center
var centerBounds = map.getBounds().getCenter();


// Web services layers

var baseLayers = {

    "Mapbox": mapbox,
    "OpenStreetMap": osm

};

// Overlay Layers
var overlayMaps = {
    "Selangor (WMS)": wmsSelangor,
    "Selangor (WFS)": wfsSelangor,
    "Johor UTM (WMS)": wmsJohor,
    "Malaysia (GeoJSON)": newGroup
};

// Add base layers
var controlLayers = L.control.layers(baseLayers, overlayMaps, { collapsed: false }).addTo(map);

// Add ScaleBar to map
L.control.scale({ metric: true, imperial: false, maxWidth: 100 }).addTo(map);

// Re-order map z-Index
map.on("overlayadd", function (e) {
    wfsSelangor.bringToBack();
    newGroup.bringToBack();
    geojsonLayer2.bringToBack();
});

// Zoom extend button (cuando haglo clic va hacia el zoom indicado)
$(".default-view").on("click", function () {
    map.fitBounds(wfsSelangor.getBounds());
});

// Mouse coordinates
map.on("mousemove", function (e) {
    //console.log('e',e);
    //console.log('e.LatLng', e.latlng);
    $(".map-coordinate").html("Lat: " + e.latlng.lat + "<br />Lon: " + e.latlng.lng);
});

// Mouse over effect (WFS layer)
var info = L.control();
info.update = function (prop) {
    //console.log('prop', prop);
    searchResults.innerHTML = (prop ? "<p class=''><b class='boundaryName'>" + prop.parlimen + "</b><br />" + prop.dun + "</div></p>" : "");
};

// Function to highlight polygon features when mouse move/over
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 3,
        color: "#666",
        dashArray: 1,
        fillOpacity: 0.7,
        fillColor: "#c7e9c0"
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}

// Function to reset highlight visualization
function resetHighlight(e) {
    wfsPolylayer.resetStyle(e.target);
    info.update();
}

// Function to clear results ( from Clear Button)
function clearResult() {
    document.getElementById("search-value").value = "";
    document.getElementById("wfsResult").innerHTML = "";


    // Clear existing WFS query layer/result
    if (qLayer != null) {
        map.removeLayer(qLayer);
    }

    // Zoom to original extent
    map.setView(centerBounds, 9);

    return false;
}

// Function to search keyword from WFS service
function searchWFS() {
    // Clear existing WFS query layer/result
    if (qLayer != null) {
        map.removeLayer(qLayer);
    }


    // Get value from inputbox
    queryBox = document.getElementById("search-value").value;

    if (!queryBox) {
        $('#alert_empty').fadeTo(2000, 500).slideUp(500, function () {
            $(".alert").slideUp(500);
        });
        return false;
    }

    var queryLayer = "strStripAccents(dun)"; // strStripAccents ignora los benditos acentos.
    var cqlFilter = "&cql_filter=strToLowerCase(" + queryLayer + ") ILIKE '%" + queryBox + "%'";
    //  var cqlFilter = "&cql_filter=strToLowercase(" + queryLayer + ") ILIKE '%" + queryBox + "%'";

    const encoded = encodeURI(cqlFilter);

    var wfs_url = url_geoserver_wfs + "service=wfs&version=1.1.0&request=GetFeature&typeNames=sghg4583:selangor_postgis&outputFormat=application/json" + encoded + "";


    // WFS result styling
    var geojsonStyle = {
        fillColor: "#ff7800",
        fillOpacity: 0.4,
        color: "red",
        weight: 2,
        opacity: 1
    };

    async function getGeojson() {

        try {
            const response = await fetch(wfs_url);
            return await response.json();
        } catch (err) {
            console.log(err);
        }
    }
    // Display search result (return as polygon)


    getGeojson().then(data => {
        if (data.totalFeatures > 0) {

            document.getElementById("wfsResult").innerHTML = data.totalFeatures + " resultado(s) encontrados.";
            qLayer = L.geoJSON([data], {
                onEachFeature: function (f, l) {
                    var popupContent = "<div><b>" + f.properties.parlimen + "</b></div>" + f.properties.dun + "</div>";
                    l.bindPopup(popupContent);
                },
                style: geojsonStyle
            }).addTo(map);
            map.fitBounds(qLayer.getBounds());
        } else {
            document.getElementById("wfsResult").innerHTML = "";

            $('#alert_noResult').fadeTo(2000, 500).slideUp(500, function () {
                $(".alert").slideUp(500);
            });
        }

    });

}


