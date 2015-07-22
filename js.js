document.addEventListener("DOMContentLoaded", function(){
	var f = [59.8922696, 30.4294064];
	var map = L.map("map")
		.setView(f, 13);
		
    // var host = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'

    var id = 'k2-e9fbbbec';
    var host = 'http://{s}.maps.omniscale.net/v2/{id}/style.grayscale/{z}/{x}/{y}.png'.replace('{id}', id);

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
                    fillColor: '#000',
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
