document.addEventListener("DOMContentLoaded", function(){
	var startCoord = L.latLng(59.9515, 30.3094);

	var southWest = L.latLng(59.7079, 30.8276);
	var northEast = L.latLng(60.1784, 29.5505);
	var bounds = L.latLngBounds(southWest, northEast);

	var id, host, access_token;
	var map = L.map("map", {
		zoomControl:false,
		maxBounds: bounds,
	    maxZoom: 19,
	    minZoom: 10
	})
		.setView(startCoord, 13);
	
	//DEFAULT OSM	
    host = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'

    //GRAYSCALE OMNISCALE
    id = 'k2-e9fbbbec';
    host = `http://{s}.maps.omniscale.net/v2/${id}/style.grayscale/{z}/{x}/{y}.png`;

    //DARK MAPBOX (K2)
    id = 'tmshv.n53m7441';
    access_token = 'pk.eyJ1IjoidG1zaHYiLCJhIjoiM3BMLVc2MCJ9.PM9ukwAm-YUGlrBqt4V6vw';
    host = `https://{s}.tiles.mapbox.com/v4/${id}/{z}/{x}/{y}.png?access_token=${access_token}`;	

	L.tileLayer(host, {
        id: id,
		attribution: '<a href="http://osm.org/copyright">OpenStreetMap</a>'
	}).addTo(map);
	
    fetch('osm_polys.txt')
        .then(function(res){
            return res.text();
        })
        .then(function(text){
            return text.split("\n")
                .map(function(raw){
                	var data = raw.split("\t");
                	try{
                		var bld = {
                    		id: data[0],
	                    	poly: JSON.parse(data[1])
	                    }
	                    return bld;
                	}catch(e){
                		return {
                			id: data[0],
                			poly: []
                		}
                	}
                });
        })
        .then(function(buildings){
            var buildings_group = L.layerGroup();
            buildings.forEach(function(bld){
        		bld.poly = bld.poly.map(function(point){
        			return [point[1], point[0]];
        		});
        		L.polygon(bld.poly, {
                    stroke: false,
                    fillColor: '#ff9900',
                    // fillColor: '#999',
                    fillOpacity: 0.75
                }).addTo(buildings_group);
        	});

            function update_buildings(){
                if (map.getZoom() < 13) {
                    map.removeLayer(buildings_group);
                }else{
                    map.addLayer(buildings_group);
                }
            }

            map.on('zoomend', update_buildings);
            update_buildings();
        });

    fetch('constr_points.csv')
        .then(function(res){
            return res.text();
        })
        .then(function(text){
            return text.split("\n")
                .map(function(row){
                    return row.split(",").map(function(coord){
                        return parseFloat(coord);
                    });
                });
        })
        .then(function(points){
            var markers = new L.MarkerClusterGroup();
            points.forEach(function(point){
                var coord = [point[1], point[0]]
                // L.marker(coord).addTo(map);
                markers.addLayer(new L.Marker(coord));
            });
            map.addLayer(markers);
        });
});
