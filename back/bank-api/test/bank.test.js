
const Bank = require ("../src/models/bankModel")
describe('Testes do modelo de Bank', () => {
    it('should return the Schema and return a new Bank Schema', () => {
        const bank = new Bank({
            "_id": 10,
            "name" : "Amora",
            "type" : "water",
            "abilities" : "whatever",
            "description" : "very strong pokemon", 
            "coach": "Naiane"
        })
        expect(bank.name).toBe('Amora')
    })
})