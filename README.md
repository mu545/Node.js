# Node.js

Sample codes of Node.js program

| Names | Description | Version |
| :- | :- | :-: |
| gmail-tool | Tool to access Gmail mailboxes  | 0.0.1 |
| whatsapp-client | Whatsapp client server | 0.0.1 |

## Gmail tool

Before run gmail tool following these steps
* Activing your Gmail APIs on your google console project
* Create credential with type OAuth client id
* Copy your credential file with name credentials.json to gmail-tool directory

## Whatsapp Client

Before run whatsapp client following these steps
* Install [docker](https://docs.docker.com/get-docker/) first if you don't have it in your machine
* Install [docker-compose](https://docs.docker.com/compose/install) after docker installed
* Go to whatsapp client directory `cd whatsapp-client`
* Set environment configuration
	- Copy file `app/app.env.example` to `app.env`
	- Copy file `mongodb/mongod.log.example` to `mongodb/mongod.log.example`
* Run the `docker-compose up -d` command to configure service of whatsapp client
* Now you can access your whatsapp client from api

Change database username and password before your initial run `docker-compose`
* Edit file `mongodb/mongo-init.js`
* Set property `user` to your new username and `pwd` to your new password under Whatsapp Database
* Edit file `app/app.env`
* Set `MONGO_USERNAME` with your new username
* Set `MONGO_PASSWORD` with your new password
* Dont forget to change `MONGO_STRING` to new mongo string connection from your new username and password
* Run the `docker-compose up -d --build` to rebuild your container with new username and password

