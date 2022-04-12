# API-REST
Api rest desenvolvida para gerenciar operações de saldo e extrato bancário como teste de conhecimentos para 4CADIA
 
 ## Principais Elementos utilizados no desenvolvimento
 - node v10.14.0
 - express v4.17.1
 - npm v8.5.5
 - bcrypt v3.0.6
 - eslint v8.12.0
 - jest v27.5.1
 - supertest v6.2.2
 - docker v20.10.12
 - docker-compose v1.26.0
 - mongoose v5.10.6
 - mongodb v4.2
 
## Descrição
 A API foi elaborada com dois objetivos principais:
  - Gerenciar registros e login de usuários.
  - Gerenciar operações de crédito e débito para cálculo de extrato e saldo.
 
Para realizar essa tarefas, a api foi elaborada obedecendo os padrões REST, manipulando e gerenciando dados por meio de requisições HTTP enviadas por um cliente.

 - Como banco de dados, foi utilizado o Mongo DB implemendo duas collections:
  - **Users**, contendo os registros:
    - name
    - email
    - password
  - **Operations**, conten os registros:
    - idUser
    - code
    - description 
	- amount
    - date
    - hour 
	- type ["Credit","Debit"]

Para realizar o login, registro dos usuários forma criadas rotas abertas para envio das credências via POST HTTP. Estas credenciais devem ser enviadas em formato JSON obedecendo o nomes dados aos registros da collection no banco de dados. Além dessas duas funções, também há uma rota aberta para validação de token do  usuário.

Por outro lado, para todas as outras funcionalidades é necessário o envio de um token JWT no header da requisição. Este token é parte do padrão OAuth2 que protege as rotas da API autenticando o usuário e assegurando que apenas usuários cadastrados e autenticados consigam acessar e realizar operações sensíveis na API.

Além da operações de login, registro e validação de token são permitidas principais operações de gerenciamento dos usuários, como atualizações (PUT, PATH), busca de informações (GET) e deletar (DELETE). Entretanto, essas operações so podem ser executadas por meio de rotas protegidas. 

**IMPORTANTE** como a aplicação é objeto de um teste, não foram implementado esquemas de perfis de usuário, dessa forma, todos os usuários cadastrados possuem um único perfil e pode realizar quaisquer operação.

Por meio da collection operations são gravadas as operações de credito e débito dos usuário para que posteriormente sejam calculados o saldo e os extratos delas.

Como estratégia de implementação, uma rota foi elaborada isoladamente para calculo do saldo dos usuários. Essa rota recebe como parâmetros via GET HTTP, o id do usuário e retorna o saldo deste usuário. 

Por outro lado, os extratos são calculados agrupados por mês e ano. Dessa forma, evita-se que todos os registros sejam buscados no banco de dados, realizando estas buscas de acordo com a vontade do usuário de visualizar os extratos de cada mês. Assim, a rota de calculo doe extratos recebe como parâmetro via GET HTTP o id do usuário, o mês e o ano que deseja para realização do cálculo.

Todas as rotas que manipulam a collection operations são protegidas, necessitando o envio do token JWT no header das requisições para autenticação do usuário.

Além das funções de gerenciamento das collections por meio das rotas, também foram criados scripts de testes automatizados utilizando os bibliotecas Jest e Supertest, em que são implementados um total de 17 testes empregados nas rotas da aplicação.

Além dos testes automatizados, visando facilitar a escalabilidade e automatização de processos a api é executada utilizando docker-compose de forma que dois containers são criados na execução, um para o banco de dados e outro para a aplicação. Estes containers são conectados por uma network que deve ser construída via docker.

## Deploy
Assim como no projeto do front-end, para economizar tempo na execução deste teste foi realizado o deploy da API em um droplet da digital ocean registrado no domínio https://coutmastersolution.ml/.

**IMPORTANTE**: Toda a documentação para utilização da API contendo a descrição das rotas e o modelo das  informações trafegadas foram elaboradas utilizando o Swagger e podem ser consutadas acessando https://coutmastersolution.ml/api/doc

Para realizar o redirecionamento das rotas para o container que executa a aplicação o arquivo de configuração do NGINX foi elaborado para que ele seja utilizado como proxy reverso. Além disso, o utilizando o NGINX é inserido um certificado SSL, permitindo que apenas requisições feitas por meio de https seja aceitas na aplicação.

Foi elaborado um pipeline CI/CD utilizando jenkins para a automatizar o deploy da aplicação, entretanto não consegui realizar o deploy e todas as configurações do Jenkins no droplet da digital ocean a tempo de utilizá-lo adequadamente, conseguindo apenas simular este pipeline em localhost.

**IMPORTANTE**: No banco de dados do projeto existem alguns dados para visualização no fornt-end, caso deseje manipular a aplicação por meio das rotas descritas na documentação do swagger utilize este token JWT que tem validade de 10 dias.

**eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwiX2lkIjoiNjI1NGIyZTk5YzcyOGIwMDRmMmYxMzk0Iiwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsicGFzc3dvcmQiOiJpbml0IiwiZW1haWwiOiJpbml0IiwibmFtZSI6ImluaXQiLCJfaWQiOiJpbml0IiwiX192IjoiaW5pdCJ9LCJzdGF0ZXMiOnsiaWdub3JlIjp7fSwiZGVmYXVsdCI6e30sImluaXQiOnsiX2lkIjp0cnVlLCJuYW1lIjp0cnVlLCJlbWFpbCI6dHJ1ZSwicGFzc3dvcmQiOnRydWUsIl9fdiI6dHJ1ZX0sIm1vZGlmeSI6e30sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sInBhdGhzVG9TY29wZXMiOnt9LCJjYWNoZWRSZXF1aXJlZCI6e30sInNlc3Npb24iOm51bGwsIiRzZXRDYWxsZWQiOnt9LCJlbWl0dGVyIjp7Il9ldmVudHMiOnt9LCJfZXZlbnRzQ291bnQiOjAsIl9tYXhMaXN0ZW5lcnMiOjB9LCIkb3B0aW9ucyI6eyJza2lwSWQiOnRydWUsImlzTmV3IjpmYWxzZSwid2lsbEluaXQiOnRydWUsImRlZmF1bHRzIjp0cnVlfX0sImlzTmV3IjpmYWxzZSwiJGxvY2FscyI6e30sIiRvcCI6bnVsbCwiX2RvYyI6eyJfaWQiOiI2MjU0YjJlOTljNzI4YjAwNGYyZjEzOTQiLCJuYW1lIjoiUm9iZXJ0byBDYXJsb3MgU2lsdmEiLCJlbWFpbCI6InJjQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJEpOQXRRMHdlQ1REcUh6U2xFd0ouZXVHYWJUT0ZUTVFMQzBONEZOLmlhbm8yM2xnaHlDNkxTIiwiX192IjowfSwiJGluaXQiOnRydWUsImlhdCI6MTY0OTcxODA3MSwiZXhwIjoxNjUwNTgyMDcxfQ.SO27ku9ngZqBWbCuJNRFh19wWQKEqv8iZnWvBEhYQrE
**
- Credenciais de usuário que podem ser utilizadas
  - Id: 6254b2e99c728b004f2f1394
  - email: rc@gmail.com
  - password: Rcarlos20
##Execução 
- Para executar o projeto localmente deve-se seguir os seguintes passos:
 - Clonar o repositório
 - instalar o docker e docker-compose
 - executar o comando para criar a network que irá interligar o container da aplicação com o do mongoDb
   - **docker network create net-4cadia**
 - criar um arquivo .env na raiz do projeto, de forma análoga ao descrito do arquivo env-example do repositório
 - executar o comando **"docker-compose up"** dentro do diretório raiz do projeto
  





