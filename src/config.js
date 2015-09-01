import CirclesLayer from './core/map/CirclesLayer'
import PolygonsLayer from './core/map/PolygonsLayer'

var mapbox_id = 'tmshv.n53m7441';
var mapbox_access_token = 'pk.eyJ1IjoidG1zaHYiLCJhIjoiZjYzYmViZjllN2MxNGU1OTAxZThkMWM5MTRlZGM4YTYifQ.uvMlwjz7hyyY7c54Hs47SQ';

function mapify(key, list){
    return list.reduce((map, record) => {
        map.set(record[key], record);
        return map;
    }, new Map());
}

export const map = {
    startCoord: [59.9515, 30.3094],
    startZoom: 11,
    maxZoom: 19,
    minZoom: 10,
    bounds: [
        [59.7079, 30.8276],
        [60.1784, 29.5505]
    ],

    tilesHost: 'dark',
    tilesHosts: mapify('name', [
        {name: 'dark', host: `https://{s}.tiles.mapbox.com/v4/${mapbox_id}/{z}/{x}/{y}.png?access_token=${mapbox_access_token}`},
        {name: 'toner', host: 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png'},
        {name: 'osm', host: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'}
    ]),

    controller: {
        layers: [
            { name: 'Circles', class: CirclesLayer, options: {minZoom: 0, maxZoom: 14}},
            { name: 'Polygons', class: PolygonsLayer, options: {minZoom: 15, maxZoom: 20}}
        ]
    }
};

export const feature = {
    building: {
        yearRangeColorBrightness: [
            {value: 3, range: [1919, 1927]},
            {value: 2, range: [1927, 1931]},
            {value: 0, range: [1931, 1935]}
        ],

        types: mapify('name', [
            {name: 'unknown', rating: 2, color: '#999999'},
            {name: 'public', rating: 10, color: '#70EB2D'},
            {name: 'social', rating: 7, color: '#FF9900'},
            {name: 'production', rating: 4, color: '#5100DE'},
            {name: 'living', rating: 5, color: '#EB4546'},
            {name: 'service', rating: 3, color: '#00E1F5'}
        ])
    }
};

export const endpoint = {
    features: 'features.geojson'
};
