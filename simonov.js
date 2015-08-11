var map;

function projectCoordToPoint(latlng){
    return map.latLngToLayerPoint(latlng);
}

document.addEventListener("DOMContentLoaded", function(){
	var startCoord = L.latLng(59.8934, 30.4265);

	var southWest = L.latLng(59.7079, 30.8276);
	var northEast = L.latLng(60.1784, 29.5505);
	var bounds = L.latLngBounds(southWest, northEast);

	var id, host, access_token;
	map = L.map("map", {
		zoomControl:false,
		maxBounds: bounds,
	    maxZoom: 19,
	    minZoom: 10
	})
		.setView(startCoord, 13);
	
    //DARK MAPBOX (K2)
    id = 'tmshv.n53m7441';
    access_token = 'pk.eyJ1IjoidG1zaHYiLCJhIjoiM3BMLVc2MCJ9.PM9ukwAm-YUGlrBqt4V6vw';
    host = `https://{s}.tiles.mapbox.com/v4/${id}/{z}/{x}/{y}.png?access_token=${access_token}`;	

	L.tileLayer(host, {
        id: id,
		attribution: '<a href="http://osm.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

    fetch('constr_simonov.tsv')
        .then(function(res){
            return res.text();
        })
        .then(function(text){
            return text.split('\n')
                .map(function(row){
                    return row.split('\t');
                });
        })
        .then(function(buildings){
            var bottomRight = projectCoordToPoint(southWest);
            var topLeft = projectCoordToPoint(northEast);
            var w = bottomRight.x - topLeft.x;
            var h = bottomRight.y - topLeft.y;

            var points = buildings
                .map(function(b){
            		return [b.pop(), b.pop()]
    	        		.map(function(i){
    		        		return parseFloat(i);
    		        	});
            	})
                .filter(function(p){
                    return p[0] && p[1];
                })
                .map(function(coord){
                    return L.latLng(coord);
                });

            var overlay_pane = map.getPanes().overlayPane;
            var svg = d3.select(overlay_pane)
                .append('svg')
                .attr('width', w)
                .attr('height', h)
                .style('left', `${topLeft.x}px`)
                .style('top', `${topLeft.y}px`)
                ;
            var g = svg.append('g')
                .attr('class', 'leaflet-zoom-hide')
                .attr('transform', `translate(${-topLeft.x}, ${-topLeft.y})`)
                ;

            var circles = g.selectAll('circle')
                .data(points)
                .enter()
                .append('circle')
                .attr('r', 5)
                .each(pulse)

            function update(){
                circles
                    .attr('fill', 'none')
                    .attr('stroke', '#ff9900')
                    .attr('stroke-width', 1)
                    .attr('cx', function(d){
                        return projectCoordToPoint(d).x;
                    })
                    .attr('cy', function(d){
                        return projectCoordToPoint(d).y;
                    })
                ;
            }

            function pulse(d) {
                function repeat() {
                    // var zoom = map.getZoom();
                    // var radius = zoom;
                    // radius = 20 - radius;
                    // radius *= 2;
                    // if(zoom > 17){
                    //      setTimeout(repeat, 50);
                    //      return;
                    // }

                    var duration_in = 1300;
                    var duration_out = 2300;
                    var radius = 7;
                    
                    circle = circle.transition()
                        .duration(duration_out)
                        .attr('r', function(){
                            return 5;
                        })
                        .transition()
                        .duration(duration_in)
                        .attr('r', function(){
                            return radius;
                        })
                        .ease('quad-in-out')
                        .each('end', repeat);
                }

                var circle = d3.select(this)
                    .transition()
                    .duration(Math.random() * 100);
                repeat();                    
            }

            map.on("viewreset", update);
            update();
        });
});
