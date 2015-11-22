> Note
> ====
> This is a work in progress and is not yet ready to be used.
> I will remove this comment once the project is stable enough.


Restomatic
=========
## What is it about?
*Restomatic* is an ad-hock REST server. This means you can "make up" your api as you go.
When you create new entities using simple REST requests, *Restomatic* will automagically
create the repository for you without having to define any special code.

If you are familiar with [FireBase's](https://www.firebase.com/) concept then you can think about
*Restomatic* as your own free private customizable FireBase server.

#### Good for front-end developers
This is a great way to jump start a project, especially if you are a front-end developer
that just want a simple rest service to talk to while you build you'r amazing app.

#### Good for backend-developers too
Using *Restomatic* is a good place to start planing your API without writing too much code
or wiring all thous annoying routs. You can later add hooks to the pipeline to customize the data
flow easily or inject your own url handler to serve custom data.

#### Good for QA
Instead of using live server, you can use *Restomatic* in your tests to mock a REST server.

## How To Use

##### Jumpstart

Running this code inside your node app will run Restomatic server.

```javascript
(function(){
    'use strict';

    var restomatic = require('./restomatic.js');

    restomatic.server.start();
}());
```
You can now access it by calling http://127.0.0.1:1337

##### Consuming data

//TODO: document the default Restomatic API

> Placeholder: word about the default FileDB

## Configuration

//TODO: document all the possible configurations

## Customization

//TODO: how to customize the different parts of Restomatic
##### Custom handlers

##### Database Adapter

##### Type convertors

##### Pipeline