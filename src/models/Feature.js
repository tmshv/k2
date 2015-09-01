import EventEmitter from 'events'

export default class Feature extends EventEmitter{
    /**
     * This class represents a GeoJSON Feature object.
     * @param id
     */
    constructor(id) {
        super();
        this.id = id;
        this.properties = new Map();
        this.geometry = {
            type: 'Point',
            coordinates: [0, 0]
        }
    }

    get(key) {
        return this.properties.get(key);
    }

    set(key, value) {
        return this.properties.set(key, value);
    }

    has(key) {
        return this.properties.has(key);
    }

    setGeometry(geometry) {
        this.geometry = geometry;
    }

    toGeoJSON() {
        const prop = {};
        for(var [k, v] of this.properties.entries()) {
            prop[k] = v;
        }

        return {
            type: 'Feature',
            id: this.id,
            geometry: this.geometry,
            properties: prop
        }
    }
}