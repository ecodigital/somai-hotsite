# Hotsite SOMAI

## Dependências

 - node v0.10.x
 - npm v2.6.x

## Instalação

```sh
$ sudo npm install -g grunt-cli bower
$ git clone https://github.com/ecodigital/somai-hotsite.git
$ cd somai-hotsite
$ npm install && bower install
$ grunt build
```

## Rodando o app

Os arquivos do aplicativo estão no diretório `dist/`, que pode ser copiado para um servidor apache/nginx.

Para desenvolvimento você pode rodar um servidor simples em python:

```sh
$ cd dist
$ python -m SimpleHTTPServer
```

Acesse http://localhost:8000
