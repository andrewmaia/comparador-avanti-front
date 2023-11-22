<!-- @format -->

## Intruções para fazer o deploy deste projeto em uma conta AWS

Para fazer deploy deste projeto basta configurar as credencias da AWS através do comando "aws configure" e apenas rodar o comando:

```bash
sam deploy -t codepipeline.yaml --stack-name comparador-avanti-front-pipeline --capabilities=CAPABILITY_IAM
```
Depois que a pilha comparador-avanti-front-pipeline for finalizada, a pipeline do projeto estará criada e será iniciada automaticamente.

**Passos a serem feitos na primeira vez que rodar a pipeline:**

1) O estágio "DeteccaoAlteracoesRepositorio" irá falhar caso tenha sido tenha utilizada uma nova conexão com o github. Para corrigir isso basta editar a ação "SourceCodeRepo" e configurar a conexão com o github.

2) No estágio "CriarBucketFrontDnsDistribuicao" a publicação da pilha "comparador-avanti-front-prod" irá ficar paralisada até que a validação do certificado SSL do ACM sejá finalizada manualmente:

![Screenshot_12](https://github.com/andrewmaia/comparador-avanti-front/assets/2144032/cfdbb62d-a6ff-4cc3-b492-e22743e471b5)

Siga os passos abaixo para finalizar a validação do certificado.

Acesse o Route 53  e encontre a zona hospedada do comparador avanti:

![Screenshot_9](https://github.com/andrewmaia/comparador-avanti-front/assets/2144032/c8851df6-f21c-43e8-a427-b0efbe31da5e)

Copie duas DNS's do registro do tipo NS e utilize-as no provedor onde foi comprado o DNS (no caso registro BR)

![Screenshot_10](https://github.com/andrewmaia/comparador-avanti-front/assets/2144032/9af4a983-aacf-4263-91cd-903ce821bac6)

Acesse o AWS Certificate Manager

![Screenshot_12](https://github.com/andrewmaia/comparador-avanti-front/assets/2144032/cfdbb62d-a6ff-4cc3-b492-e22743e471b5)

  
E clique em "Criar registro no Route 53"
   
![Screenshot_11](https://github.com/andrewmaia/comparador-avanti-front/assets/2144032/1e054ca0-1bd5-4f1c-abaa-6eeadd6f8695)

![Screenshot_14](https://github.com/andrewmaia/comparador-avanti-front/assets/2144032/c2376d3a-bcfd-4088-861f-4271c5c6164c)

Esse registro irá fazer a validação do certificado. A AWS demora alguns minutos para fazer essa validação. Quando a validação estiver ok o status do certificado irá ficar como a seguir:

![Screenshot_1](https://github.com/andrewmaia/comparador-avanti-front/assets/2144032/b5ea9ccd-433b-43ca-85d6-82f90aa7f534)

Depois que a validação é finalizada a pilha "comparador-avanti-front-prod" continua e a pipeline é finalizada.

3) Depois de finalizada a pipeline é necessário criar o registro no Route 53 que irá apontar para a distribuição do cloud front

Acesse a zona hospedada "comparadoravanti.com.br" no Route 53 novamente

![Screenshot_2](https://github.com/andrewmaia/comparador-avanti-front/assets/2144032/351eeb1e-6849-4131-9239-41e95a5be3cb)

Clique em criar registro

![Screenshot_3](https://github.com/andrewmaia/comparador-avanti-front/assets/2144032/223e58a1-e487-47a6-bbef-f4955eea07af)

Selecione a distribuição do Cloud Front conforme a imagem abaixo e clique em "Criar Registro"

![Screenshot_4](https://github.com/andrewmaia/comparador-avanti-front/assets/2144032/bbb64c2b-3e82-42bf-97c3-6c04747a933f)

![Screenshot_5](https://github.com/andrewmaia/comparador-avanti-front/assets/2144032/afdc1d79-9e8d-4325-b877-ef690bfd52cd)

Um novo registro é criado e o domínio agora está conectado a distribuição no CloudFront

![Screenshot_15](https://github.com/andrewmaia/comparador-avanti-front/assets/2144032/f7c90f31-1e1b-4974-891c-ccf71578251d)



## Infra como código

Este projeto contém o front composto de HTML, Java Script e CSS.
Para o deploy do Front através de código (Infra como código) foi utilizado o AWS SAM Cli. Para utilizar o SAM Cli é necessário:

- SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- Node.js - [Install Node.js 18](https://nodejs.org/en/), including the NPM package management tool.
- Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

O SAM Cli gera a infraestrura como código no arquivo template.yaml.
O arquivo template.yaml é gerado através do comando na raíz do repositório:

```bash
sam init
```

Obs: Este comando já foi executado para este projeto, por isso o arquivo template.yaml já está no repositório.

## Deploy do Front de forma manual em uma conta AWS

O SAM Cli permite fazer o deploy da infra como código do front através do arquivo template.yaml.
Para fazer o deploy em uma conta AWS é necessário que as credenciais aws já estejam configuradas através do comando:

```bash
aws configure
```

Depois rodar o build para gerar os arquivos que serão utilizados pelo SAM para criar a stack de recursos do front (Será criada uma pasta oculta chamada .aws-sam com os arquivos):

```bash
sam build
```

A seguir rode o comando que irá criar a pilha de recursos no Cloudformation na conta AWS:

```bash
sam deploy --guided
```

Obs: o atributo --guided habilita o passo a passo e salva o que você selecionar em samconfig.toml, depois de salva as configurações não é mais necessário rodar o comando sam deploy com o atributo --guided

## Exclusão do front em uma conta AWS

Depois de feito o deploy e criada a stack de recursos do front é possível excluir essa stack através do comando:

```bash
sam delete
```

## Deploy automático de infra e código através de Pipeline

Neste projeto o arquivo **codepipeline.yaml** e os arquivos da pasta pipeline foram criados manualmente (sem o comando sam pipeline init --bootstrap).

Depois foi commitado os arquivos de pipeline no repositório e rodado o comando:

```bash
sam deploy -t codepipeline.yaml --stack-name comparador-avanti-front-pipeline --capabilities=CAPABILITY_IAM
```

Assim é criada a stack da pipeline, qualquer alteração no código feita no repositório irá iniciar a pipeline que irá atualizar a propria pipeline (caso o arquivo **codepipeline.yaml** tenha sido alterado ou atualizar o site front.

Importante: A primeira vez que a pipeline rodar ela irá falhar no primeiro estágio. É necessário entrar manualmente no primeiro estágio e finalizar a configuração da conexão com o GITHUB.

## Como funciona a pipeline criada?

O código como infra gerado em codepipeline.yaml ira gerar uma pipeline com os seguintes estágios:

**Estágio 1 - Detecção de alterações no Repositório:** Qualquer commit feito no repositório irá iniciar a pipeline automaticamente.

**Estágio 2 - Atualização da Pipeline:** É neste estágio que ocorre a **auto-atualização da pipeline**. Aqui são executadas ações que irão pegar o conteudo do arquivo **codepipeline.yaml** e republicar a stack que gera a pipeline. Assim qualquer alteração nesse arquivo resultará numa auto-atualização da pipeline.

**Estágio 3 -Rodar Eslint:** Neste estágio é executado eslint para procurar erros nos arquivos javascript através do arquivo **buildspec_eslint.yml** da pasta pipeline.

**Estágio 4 -Criar Bucket Front DNS e Distribuição:** Neste estágio é criado o bucket onde é armezenado o site do front, a zona hospedada no Route 53, Certificado SSL e uma distribuição no CloudFront através do arquivo **buildspec_build_package.yml** da pasta pipeline.

**Estágio 5 - Rodar Webpack e Obter Arquivos Front:** Neste estágio é executado o webpack e selecionado os arquivos da pasta dist para publicar o site do front através do arquivo **buildspec_webpack_copiar_arquivos_front.yml** da pasta pipeline.

**Estágio 6 - CopiarArquivosParaBucket:** Neste estágio é copiado os arquivos do site do front no bucket.
