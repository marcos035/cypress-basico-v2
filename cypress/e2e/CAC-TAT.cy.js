/// <reference types="Cypress" />

describe('Central de atendimento ao cliente TAT', () => {

  beforeEach(() => {
    cy.visit('./src/index.html')
  })

  it('Validando o titulo da pagina', () => {


    cy.title().should('eql', 'Central de Atendimento ao Cliente TAT')
  })


  it('preenche os campos obrigatórios e envia o formulário', () => {

    cy.get('#firstName').type('Marcos')
    cy.get('#lastName').type('Fideles')
    cy.get('#email').type('Email@gmail.com')
    cy.get('#open-text-area').type('preciso que voces resolvam meu problema de falta de emprego mandis', { delay: 0 })
    cy.contains('button', 'Enviar').click()
    cy.get('span[class*="success"]').should('be.visible')
      .contains('Mensagem enviada com sucesso.')

  })
  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.get('#firstName').type('Marcos')
    cy.get('#lastName').type('Fideles')
    cy.get('#email').type('Email#gmail.com')
    cy.get('#open-text-area').type('preciso que voces resolvam meu problema de falta de emprego mandis', { delay: 0 })
    cy.contains('button', 'Enviar').click()
    cy.get('span[class*="error"]').should('be.visible')
      .contains('Valide os campos obrigatórios!')
  })

  it('validar numero de telefone', () => {
    cy.get('#firstName').type('Marcos')
    cy.get('#lastName').type('Fideles')
    cy.get('#email').type('Email@gmail.com')
    cy.get('#phone').type('sadsadasda').should('be.empty')
    cy.get('#open-text-area').type('preciso que voces resolvam meu problema de falta de emprego mandis', { delay: 0 })
    cy.contains('button', 'Enviar').click()
    cy.get('span[class*="success"]').should('be.visible')

  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.get('#firstName').type('Marcos')
    cy.get('#lastName').type('Fideles')
    cy.get('#email').type('Email@gmail.com')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('preciso que voces resolvam meu problema de falta de emprego mandis', { delay: 0 })
    cy.contains('button', 'Enviar').click()
    cy.get('span[class*="error"]').should('be.visible').contains('Valide os campos obrigatórios!')

  })
  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {

    var longText = 'preciso que voces resolvam meu problema de falta de emprego mandis'
    cy.get('#firstName').type('Marcos').should('have.value', 'Marcos')
      .clear().should('to.be.empty')
    cy.get('#lastName').type('Fideles').should('have.value', 'Fideles')
      .clear().should('to.be.empty')
    cy.get('#email').type('Email@gmail.com').should('have.value', 'Email@gmail.com')
      .clear().should('to.be.empty')
    cy.get('#phone-checkbox').click()
    cy.get('#phone').type('1212121').should('have.value', '1212121')
      .clear().should('to.be.empty')
    cy.get('#open-text-area').type(longText, { delay: 0 }).should('have.value', longText)
      .clear().should('to.be.empty')
    cy.contains('button', 'Enviar').click()
    cy.get('span[class*="error"]').should('be.visible')
      .contains('Valide os campos obrigatórios!')

  })
  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {

    cy.contains('button', 'Enviar').click()
    cy.get('span[class*="error"]').should('be.visible')
      .contains('Valide os campos obrigatórios!')
  })

  it('envia o formuário com sucesso usando um comando customizado', () => {

    cy.fillMandatoryFieldsAndSubmit('Marcos', 'Fideles', 'email@gmail.com', '12121212')
    cy.get('.success').contains('Mensagem enviada com sucesso.')
  })

  it('seleciona um produto (YouTube) por seu texto',()=>{

    cy.get('#product').select('YouTube')
    .should('have.value', 'youtube')

  } ) 

  it('seleciona um produto (Mentoria) por seu valor (value)', ()=>{

    cy.get('#product').select('mentoria')
    .should('have.value', 'mentoria')

  })

  it('seleciona um produto (Blog) por seu indice', ()=>{

    cy.get('#product').select(1)
    .should('have.value', 'blog')

  })

  it('marca o tipo de atendimento "Feedback"', ()=>{
 
    cy.get('input[type="radio"][value*="feedback"]').check()
    .should('have.value','feedback')
  })

  it('marca cada tipo de atendimento', ()=>{
 
    cy.get('input[type="radio"]').should('have.length',3)
    .each(function($radio){
        cy.wrap($radio).check()
        cy.wrap($radio).should('be.checked')
    })

  })
  it('marca ambos checkboxes, depois desmarca o último',()=>{
    cy.get('input[type*="checkbox"]').check()
    .should('be.checked')
    .last()
    .uncheck()
    .should('not.be.checked')
  })

  it('selecione um arquivo da pasta fixtures', ()=>{

    cy.get('input[type="file"]').should('not.have.value')
    .selectFile('cypress/fixtures/example.json')
    .then(($input)=>{
      expect($input[0].files[0].name).to.eql('example.json')

    })
  })

  it('seleciona um arquivo simulando um drag-and-drop', ()=>{

    cy.get('input[type="file"]').should('not.have.value')
    .selectFile('cypress/fixtures/example.json', {action:'drag-drop'})
    .then(($input)=>{
      expect($input[0].files[0].name).to.eql('example.json')

    })
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', ()=>{
    
    cy.fixture('example.json').as("example")
    cy.get('input[type="file"]').should('not.have.value')
    .selectFile('@example', '{action:drag-drop}')
    .then(($input)=>{
      expect($input[0].files[0].name).to.eql('example.json')

    })
  })

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', ()=>{
    cy.get('#privacy a').should('have.attr','target', '_blank')
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', ()=>{
    cy.get('#privacy a').invoke('removeAttr', 'target').click()

    cy.contains('Talking About Testing').should('be.visible')
    
  })
  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', ()=>{
    


  })

})