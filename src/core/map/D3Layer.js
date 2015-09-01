import L from 'leaflet';

import MapLayer from '../MapLayer'

export default class D3Layer extends MapLayer{
    constructor(buildings) {
        super();

        const map = this.map;
        var projectCoordToPoint = projector(map);
        var southWest = L.latLng(config_map.bounds[0]);
        var northEast = L.latLng(config_map.bounds[1]);
        var bottomRight = projectCoordToPoint(southWest);
        var topLeft = projectCoordToPoint(northEast);
        var w = bottomRight.x - topLeft.x;
        var h = bottomRight.y - topLeft.y;

        buildings.forEach(bld => {
            var coord = bld.citywalls.latlng;
            bld.coord = coord.reverse();
        });

        //var points = buildings.map(bld => {
        //return bld.geometry
        //    .reduce((list, obj) => {
        //        return list.concat(obj);
        //    }, [])
        //    .reduce((sum, point, i, points) => {
        //        sum[0] += point[0];
        //        sum[1] += point[1];
        //
        //        if (i == points.length - 1) {
        //            sum[0] /= points.length;
        //            sum[1] /= points.length;
        //        }
        //
        //        return sum;
        //    }, [0, 0]);
        //});

        var overlay_pane = map.getPanes().overlayPane;
        var svg = d3.select(overlay_pane)
            .append('svg')
            .attr('class', 'map-layer--no-mouse')
            .attr('width', w)
            .attr('height', h)
            .style('left', `${ topLeft.x }px`)
            .style('top', `${ topLeft.y }px`);
        var g = svg.append('g')
            .attr('class', 'leaflet-zoom-hide')
            .attr('transform', `translate(${ -topLeft.x }, ${ -topLeft.y })`);

        var circles = g.selectAll('circle')
            .data(buildings)
            .enter()
            .append('circle')
            .attr('r', getBuildingValue);
        //.each(pulse);

        function update() {
            if(map.getZoom() > 14){
                circles
                    .attr('opacity', 0)
            }else{
                circles
                    .attr('opacity', 1)
                    .attr('fill', 'none')
                    //.attr('stroke', '#ff9900')
                    .attr('stroke', getBuildingColor)
                    .attr('stroke-width', 1)
                    .attr('cx', function (bld) {
                        return projectCoordToPoint(bld.coord).x;
                    })
                    .attr('cy', function (bld) {
                        return projectCoordToPoint(bld.coord).y;
                    })
                ;
            }
        }

        function pulse(d) {
            function repeat() {
                var duration_in = 1300;
                var duration_out = 2300;
                var radius = 7;

                circle = circle.transition()
                    .duration(duration_out)
                    .attr('r', function () {
                        return 5;
                    })
                    .transition()
                    .duration(duration_in)
                    .attr('r', function () {
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

        map.on('viewreset', update);
        update();
    }
}
