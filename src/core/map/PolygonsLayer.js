import L from 'leaflet'
import MapLayer from '../MapLayer'

export default class PolygonsLayer extends MapLayer {
    constructor(buildings) {
        super();

        buildings.forEach(bld => {
            this.addPolygon(bld.geometry, bld);
        });
    }

    addPolygon(geometry, bld) {
        const color = bld.getColor();
        var polygon = L.geoJson(geometry, {
            stroke: false,
            fillOpacity: 1,
            fillColor: color
        });

        polygon.on('click', () => {
            const [lon, lat] = bld.coord;
            const popup = L.popup()
                .setLatLng([lat, lon])
                .setContent(`
                            <div>
                                <p><b>${bld.get('name')}</b></p>
                                <p>Years: ${bld.get('year')}</p>
                                <p>Arch: ${bld.get('architects')}</p>
                                <p>Typology: ${bld.get('type') || '<i>unknown</i>'}</p>
                                <p>Addr: ${bld.get('address')}</p>
                                <p><a href="${bld.get('citywalls')}">Citywalls</a></p>
                            </div>
                        `);

            this.emit('popup', popup);
        });

        this.layer.addLayer(polygon);
    }
}
