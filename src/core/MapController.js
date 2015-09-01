import L from 'leaflet';

export default class MapController {
    get zoom() {
        return this.map.getZoom();
    }

    constructor(container, options) {
        const host = options.tilesHosts.get(options.tilesHost);

        this.tilesHost = host.host;
        this.startCoord = L.latLng(options.startCoord);
        this.startZoom = options.startZoom;
        this.maxZoom = options.maxZoom;
        this.minZoom = options.minZoom;
        const southWest = L.latLng(options.bounds[0]);
        const northEast = L.latLng(options.bounds[1]);
        this.bounds = L.latLngBounds(southWest, northEast);

        var map = L.map(container, {
            zoomControl: false,
            maxBounds: this.bounds,
            maxZoom: this.maxZoom,
            minZoom: this.minZoom,
            layers: [
                L.tileLayer(this.tilesHost)
            ],
            attributionControl: false
        });
        map.setView(this.startCoord, this.startZoom);
        map.on('viewreset', () => {
            this.update();
        });
        this.map = map;

        this.layers = new Map();
        this.layersOptions = new Map();
    }

    addLayer(name, layer, options) {
        this.layers.set(name, layer);
        this.layersOptions.set(name, options);
        this.update(name);

        layer.on('popup', (popup) => {
            this.map.openPopup(popup);
        })
    }

    removeLayer(name) {
        this.layers.delete(name);
        this.layersOptions.delete(name);
    }

    update(layerName = null) {
        const map = this.map;
        const zoom = this.zoom;

        var selected_layer_names = layerName ? [layerName] : [...this.layers.keys()];
        for(var [i, name] of selected_layer_names.entries()) {
            const layer = this.layers.get(name);
            const options = this.layersOptions.get(name);
            const min = options.minZoom;
            const max = options.maxZoom;
            if (zoom >= min && zoom <= max) map.addLayer(layer.layer);
            else map.removeLayer(layer.layer);
        }
    }

    /**
     * Creates closure function to transform:
     * [lat, lon] -> [screen x, screen y]
     *
     * @param latlng
     * @returns {*}
     */
    projector() {
        const map = this.map;
        return latlng => {
            return map.latLngToLayerPoint(latlng);
        }
    }
}
