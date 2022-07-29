
const Bank = require ("../src/models/usersModel")
describe('Bank Api Tests', () => {
    it('should return the Schema and return a new Bank Schema', () => {
        const bank = new Bank({
            "_id": 10,
            "nome" : "Teste",
            "email": "teste@teste.com",
            "senha": "12345",
            "cpf": "98923181",
            "endereco": "rua x",
            "telefone": "928848405",

        })
        expect(bank.nome).toBe("Teste")
    })
})
