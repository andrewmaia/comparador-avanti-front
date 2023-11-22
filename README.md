<!-- @format -->

## Intruções para fazer o deploy deste projeto em uma conta AWS

Para fazer deploy deste projeto basta configurar as credencias do AWS através do aws configure e apenas rodar o comando:

```bash
sam deploy -t codepipeline.yaml --stack-name comparador-avanti-front-pipeline --capabilities=CAPABILITY_IAM
```
A pipeline do projeto será criada.

**Passos a serem feitos na primeira vez que rodar a pipeline**


Na primeira vez que pipeline rodar ela irá falhar no primeiro estágio. É necessário entrar manualmente no primeiro estágio e finalizar a configuração da conexão com o GITHUB.




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

**Estágio 4 -Criar Bucket Front:** Neste estágio é criado o bucket onde é armezenado o site do front através do arquivo **buildspec_build_package.yml** da pasta pipeline.

**Estágio 5 - Rodar Webpack e Obter Arquivos Front:** Neste estágio é executado o webpack e selecionado os arquivos da pasta dist para publicar o site do front através do arquivo **buildspec_webpack_copiar_arquivos_front.yml** da pasta pipeline.

**Estágio 6 - CopiarArquivosParaBucket:** Neste estágio é copiado os arquivos do site do front no bucket.
