document.addEventListener("DOMContentLoaded", function(){
	var f = [59.8922696, 30.4294064];
	var map = L.map("map")
		.setView(f, 13);
		
	L.tileLayer('//{s}.tile.osm.org/{z}/{x}/{y}.png', {
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
        // .then(function(buildings){
        // 	buildings.poly = buildings.poly.map(function(poly){
        // 		return poly.map(function(poly){
        // 			return [poly[1], poly[0]]	
        // 		});
        // 	})
        // 	return buildings;
        // })
        .then(function(buildings){
            buildings.forEach(function(bld){
        		bld.poly = bld.poly.map(function(point){
        			return [point[1], point[0]];
        		});
        		L.polygon(bld.poly).addTo(map);
        	});
        });
});
