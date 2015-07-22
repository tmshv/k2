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
            buildings.forEach(function(bld){
        		bld.poly = bld.poly.map(function(point){
        			return [point[1], point[0]];
        		});
        		L.polygon(bld.poly, {
                    stroke: false,
                    fillColor: '#000',
                    fillOpacity: 0.75
                }).addTo(map);
        	});
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
            console.log(points);
            points.forEach(function(point){
                L.marker([point[1], point[0]]).addTo(map);
                // L.circle(
                //     [point[1], point[0]],
                //     10,
                //     {
                //         stroke: false,
                //         fillColor: '#a22',
                //         fillOpacity: 0.75
                //     }
                // ).addTo(map);
            });
        });
});
