import L from 'leaflet'
import MapLayer from '../MapLayer'

export default class CirclesLayer extends MapLayer{
    constructor(buildings) {
        super();

        buildings.forEach(bld => {
            const [lon, lat] = bld.coord;
            const radius = bld.getRating() * 20;
            var circle = L.circle([lat, lon], radius, {
                fill: false,
                color: bld.getColor(),
                weight: 1,
                opacity: 1
            });
            this.layer.addLayer(circle);
        });
    }
}
