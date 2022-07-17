
const Pokedex = require ("../src/models/pokedexModel")
describe('Testes do modelo de Pokedex', () => {
    it('should return the Schema and return a new Pokedex', () => {
        const pokedex = new Pokedex({
            "_id": 10,
            "name" : "Amora",
            "type" : "water",
            "abilities" : "whatever",
            "description" : "very strong pokemon", 
            "coach": "Naiane"
        })
        expect(pokedex.name).toBe('Amora')
    })
})