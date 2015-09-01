import React from 'react';
import merge from 'merge';
import MapController from '../core/MapController'
import Building from '../models/Building'
import {map as config_map, endpoint} from '../config'


export default class App extends React.Component {
    constructor() {
        super();

        var query = new Map(location.search
            .substr(1)
            .split('&')
            .map(i => {
                return i.split('=')
            })
        );

        this.state = {
            urlFeatures: query.has('file') ? query.get('file') : endpoint.features,
            tilesHost: query.has('tiles') ? query.get('tiles') : config_map.tilesHost,
        };
    }

    componentDidMount() {
        const th = this.state.tilesHost;
        const config = config_map.tilesHosts.has(th) ? merge(config_map, {tilesHost: th}) : config_map;
        const node = document.querySelector('.map');
        const map = new MapController(node, config);
        this.map = map;

        this.loadFeatures()
            .then(geojson => {
                return geojson.features;
            })
            .then(buildings => {
                return buildings.map(bld => {
                    return Building.create(bld);
                })
            })
            .then(buildings => {
                config_map.controller.layers.forEach(i => {
                    const Layer = i.class;
                    map.addLayer(i.name, new Layer(buildings), i.options);
                });

                return buildings;
            })
            .catch(error => {
                console.error(error, error.stack);
            });
    }

    loadFeatures() {
        return fetch(this.state.urlFeatures)
            .then(res => {
                return res.json();
            });
    }

    render() {
        return (
            <div className="app-container">
                <header>
                    <div className="logo"></div>
                </header>
                <div className="side"></div>
                <div className="main">
                    <div className="map"></div>
                </div>
            </div>
        );
    }
}
