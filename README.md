# 🛡️ Projeto Apoio: Gestão de Abrigos

## 🛩️ 1. Apresentação da Ideia 
Este projeto nasceu da necessidade urgente de organização durante as crises climáticas e enchentes que assolam diversas regiões do Brasil. A ideia surgiu ao observar que, em momentos de desastre, a solidariedade é enorme, mas a logística de informação é falha. Percebemos que muitos abrigos ficam superlotados enquanto outros têm vagas, e que doações muitas vezes chegam onde não são necessárias. O foco aqui foi criar uma ponte confiável entre quem precisa e quem quer ajudar.

## 
<img width="1288" height="753" alt="image" src="https://github.com/user-attachments/assets/07fc0587-7a82-4175-82f2-af0b00a60047" />

## 🚀 Documentação da API (Endpoints)
### Para testar as funcionalidades, você pode usar o Postman ou Insomnia com os seguintes endereços:

* Listar Abrigos

  * Rota: GET /api/shelters
  * Descrição: Retorna todos os abrigos cadastrados.
 
* Cadastrar Abrigo

  * Rota: POST /api/shelters
  * Corpo (JSON):

```
{
  "name": "Nome do Abrigo",
  "address": "Endereço Completo",
  "city": "Cidade",
  "capacity": 100,
  "contact_phone": "999999999"
}
```
* Check-in de Pessoa

  * Rota: POST /api/shelters/:id/checkin

  * Descrição: Registra uma pessoa e atualiza as vagas (usa Transação SQL).

## ⁉️ 2. Problema Escolhido
Decidir resolver a falta de centralização e atualização em tempo real dos dados dos abrigos. O problema principal é a desinformação logística:

* Dificuldade de saber quais abrigos ainda possuem vagas.
* Falta de clareza sobre quais itens de necessidade básica (água, roupas, higiene) são prioridade em cada local específico.
* Gestão manual e lenta da entrada de pessoas (check-in) nos pontos de acolhimento.

## 😎 3. Solução Proposta

* O sistema é uma plataforma de gestão centralizada para abrigos. 

### A solução permite:
* Mapeamento e Cadastro: Registro de abrigos com endereço, contato e capacidade total.
* Monitoramento de Vagas: Um sistema de check-in que atualiza automaticamente o número de vagas ocupadas e disponíveis.
* Gestão de Necessidades: Cada abrigo pode listar suas carências específicas com níveis de urgência, orientando os doadores para que o recurso certo chegue ao lugar certo.
* Interface Responsiva: Consulta rápida para que socorristas e cidadãos encontrem o ponto de apoio mais próximo e disponível.

## 💻 4. Estrutura do Sistema
### O projeto foi desenvolvido com uma arquitetura moderna e escalável, dividida em três pilares principais:

* Front-end: Desenvolvido em React.js. Focado em uma interface intuitiva, utilizando componentes funcionais e hooks para uma experiência de usuário fluida. A estilização foi pensada para ser limpa e acessível em dispositivos móveis.

* Back-end: Construído com Node.js e o framework Express. A API segue o padrão RESTful, lidando com rotas de cadastro, consulta, exclusão e lógica de check-in em tempo real com controle de transações.

* Banco de Dados: Utilizamos o PostgreSQL, um banco de dados relacional robusto. A estrutura foi desenhada para garantir a integridade dos dados através de chaves estrangeiras e relacionamentos entre as tabelas de abrigos, ocupantes e necessidades.

## 🎯 5. Tecnologias Utilizadas e Diferenciais Técnicos
### Para garantir um sistema rápido, seguro e escalável, utilizamos as seguintes tecnologias (Stacks):

* React.js (Front-end): Utilizado para criar uma interface dinâmica e reativa, permitindo que as informações de vagas e necessidades sejam visualizadas de forma clara.

* Node.js & Express (Back-end): Escolhidos pela alta performance no processamento de requisições assíncronas, fundamentais para um sistema que recebe múltiplos acessos simultâneos.

* PostgreSQL (Banco de Dados): Um banco relacional que nos permitiu estruturar dados complexos com segurança.

* Axios: Para a comunicação fluida entre o front-end e a nossa API.

* GSAP: Para algumas animações intuitiva no site.

# 🕹️ Destaque Técnico: Integridade de Dados com Transações SQL
Um dos maiores diferenciais do projeto está implementado no shelterController.js, especificamente na lógica de Check-in. Em um cenário de emergência, onde várias pessoas podem tentar se cadastrar no mesmo abrigo ao mesmo tempo, não podemos permitir erros na contagem de vagas.

### Para resolver isso, implementamos Transações SQL:

* **BEGIN:** Iniciamos uma transação para garantir que uma série de operações seja tratada como um único bloco.

* **COMMIT:** O sistema só confirma a entrada do novo ocupante se a atualização da vaga no abrigo ocorrer com sucesso.

* **ROLLBACK:** Caso ocorra qualquer erro (como o abrigo lotar no exato momento da inserção), o sistema desfaz todas as alterações automaticamente. Isso evita "dados órfãos" e garante que o número de vagas exibido seja sempre 100% real.
