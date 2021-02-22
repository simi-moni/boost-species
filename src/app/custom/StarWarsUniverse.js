import EventEmitter from 'eventemitter3';
import max from '../../config';
import Species from './Species';

export default class StarWarsUniverse extends EventEmitter {
    constructor() {
        super();

        this.species = [];
        this._maxSpecies = max._maxSpecies;
    }

    static get events() {
        return {
            MAX_SPECIES_REACHED: 'max_species_reached',
            SPECIES_CREATED: 'species_created'
        };
    }

    get speciesCount() {
        return this.species.length;
    }

    createSpecies() {
        const species = new Species();
        const self = this;
        species.on(StarWarsUniverse.events.SPECIES_CREATED, function _onSpeciesCreated(species) {
            self.species.push(species);
            self.emit(StarWarsUniverse.events.SPECIES_CREATED, { speciesCount: self.speciesCount });
            if (self._maxSpecies === self.speciesCount) {
                self.emit(StarWarsUniverse.events.MAX_SPECIES_REACHED);
            } else {
                self.createSpecies();
            }
        });
        species.init(`https://swapi.booost.bg/api/species/${self.speciesCount + 1}`);
    }
}