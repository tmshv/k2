import EventEmitter from 'events'
import L from 'leaflet'

export default class MapLayer extends EventEmitter{
    constructor() {
        super();
        this.layer = L.layerGroup();
    }
}
