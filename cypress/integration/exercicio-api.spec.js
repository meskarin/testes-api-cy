/// <reference types="cypress" />

import contrato from '../contracts/usuarios.contract'
describe('Testes da Funcionalidade Usuários', () => {

    it('Deve validar contrato de usuários', () => {
         cy.request('usuarios').then(response =>{
          return contrato.validateAsync(response.body)
         })   
    });

    it('Deve listar usuários cadastrados', () => {
         cy.request({
              method:'GET',
              url:'usuarios'
         })
         .then((response) => {
          expect(response.status).to.equal(200)
         })
    });

    it('Deve cadastrar um usuário com sucesso', () => {
         let nome = `Usuário de teste ${Math.floor(Math.random() * 100000000)}`
         let email = `email.${Math.floor(Math.random() * 100000000)}@outlook.com`
     cy.request({
          method:'POST',
          url:'usuarios',
          body:{
               "nome": nome,
               "email": email,
               "password": "12345678",
               "administrador": "true"
          }
     })
     .then((response) => {
      expect(response.status).to.equal(201)
      expect(response.body.message).to.equal("Cadastro realizado com sucesso")
     })
     });

    it('Deve validar um usuário com email inválido', () => {
     cy.cadastrarUsuario("rafael","rafael.ide@outlook.com","RafaelIde0602","true")
     cy.cadastrarUsuario("Naruto Uzumaki","rafael.ide@outlook.com","NarutoUzumaki32","true")
     .then((response) => {
          expect(response.status).to.equal(400)
          expect(response.body.message).to.equal("Este email já está sendo usado")
      })
    });

    it('Deve editar um usuário previamente cadastrado', () => {
         let usuario = `Anderson ${Math.floor(Math.random() * 100000000)}`
         let email = `Anderson.smith${Math.floor(Math.random() * 100000000)}@outlook.com`
         let senha = "Ide0602"
         let administrador = "true"

     cy.cadastrarUsuario(usuario,email,senha,administrador)
     .then(response => {
          let id = response.body._id
          cy.request({
               method:'PUT',
               url:`usuarios/${id}`,
               body:{
               "nome": "Novo nome", 
               "email": `Novo.email${Math.floor(Math.random() * 100000000)}@outlook.com`,
               "password": "123456789",
               "administrador": "true"
               }
          }).then(response =>{
               expect(response.status).to.equal(200)
               expect(response.body.message).to.equal('Registro alterado com sucesso')
          })
     })
          
     });

    it('Deve deletar um usuário previamente cadastrado', () => {
      let usuario = `Anderson ${Math.floor(Math.random() * 100000000)}`
      let email = `Anderson.smith${Math.floor(Math.random() * 100000000)}@outlook.com`
      let senha = "Ide0602"
      let administrador = "true"

      cy.cadastrarUsuario(usuario,email,senha,administrador)
      .then(response => {
           let id = response.body._id
           cy.request({
                method:'DELETE',
                url:`usuarios/${id}`              
           }).then(response =>{
               expect(response.status).to.equal(200)
               expect(response.body.message).to.equal('Registro excluído com sucesso')
          })
      })
    });

});

