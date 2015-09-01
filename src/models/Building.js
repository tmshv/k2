import Feature from './Feature'
import chroma from 'chroma-js'
import {feature as config} from '../config'

function isYearInRange(year, range) {
    if (!(year instanceof Array)) return isYearInRange([parseInt(year)], range);
    if (year.length == 0) return false;
    if (year.length == 1) year = year[0];
    if (year.length == 2) year = (year[0] + year[1]) / 2;
    if (isNaN(year)) return false;

    const [min, max] = range;
    return year >= min && year <= max;
}

export default class Building extends Feature {
    static create(feature){
        const id = feature.properties['OSM_ID'];
        const i = new Building(id);

        Object.keys(feature.properties).forEach(k => {
            i.set(k, feature.properties[k]);
        });

        i.setGeometry(feature['geometry']);

        return i;
    }

    /**
     * Get type definition from config.
     * If specified type is not specified, it returns 'unknown' type definition.
     *
     * @param name String type name
     * @returns {*} type definition
     */
    static type(name){
        const map = config.building.types;
        if(map.has(name)) return map.get(name);
        return map.get('unknown');
    }

    static typeColor(name){
        const type = Building.type(name);
        return type.color;
    }

    static typeRating(name){
        const type = Building.type(name);
        return type.rating;
    }

    get coord() {
        return this.get('coord');
    }

    get type(){
        return this.get('type');
    }

    get year(){
        return this.get('year');
    }

    constructor(id) {
        super(id);

        this.set('type', 'unknown');
        this.setCoord([0, 0]);
    }

    setCoord(lat, lon) {
        this.set('coord', [lat, lon]);
    }

    getColor() {
        const color = Building.typeColor(this.type);
        const bright = config.building.yearRangeColorBrightness
            .reduce((bright, i) => {
                if(isYearInRange(this.year, i.range)) return i.value;
                return bright;
            }, 0);

        return chroma(color).darken(bright).hex();
    }

    getRating() {
        return Building.typeRating(this.type);
    }

    setGeometry(geometry){
        super.setGeometry(geometry);

        function recursive(geom) {
            if(typeof geom[0] === 'number') return geom;

            return geom.reduce((list, item) => {
                const r = recursive(item);
                if(typeof r[0] === 'number') list.push(r);
                else list = list.concat(r);
                return list;
            }, []);
        }

        const r = recursive(geometry.coordinates);
        const coord = r.reduce((coord, item) => {
            coord[0] += item[0];
            coord[1] += item[1];
            return coord;
        }, [0, 0]);

        coord[0] /= r.length;
        coord[1] /= r.length;

        this.setCoord(coord[0], coord[1]);
    }
}
