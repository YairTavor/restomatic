> Note
> ====
> This is a work in progress and is not yet ready to be used.
> I will remove this comment once the project is stable enough.


Restomatic
=========
## What is it about?
> WARNING! this section is bullshit! skip ahead to "How To Use" to get down to business.

*Restomatic* is an ad-hock REST server. This means you can "make up" your api as you go.
When you create new entities using simple REST requests, *Restomatic* will automagically
create the repository for you without having to define any special code.
You can then consume those yummy entities by using other delicious REST requests!

#### Good for front-end developers
This is a great way to jump start a project, especially if you are a front-end developer
that just want a simple rest service to talk to while you build you'r amazing app.
>FACT: REST services are better listeners than most of your fiends.

#### Good for backend-developers too
Using *Restomatic* is a good place to start planing your API without writing too much code
or wiring all thous annoying routs. You can later add hooks and parsers to customize the data
flow easily or inject your own url handler to serve custom data.

#### Good for Testing
Instead of using live server, you can use *Restomatic* in your tests to mock a REST server.
Just feed it with the entities you need, and BOOM! Instant testing server!
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

#### Command line arguments

There are several command line arguments you can use when firing *Restomatic*:

* `-i` to set ip address of the server
* `-p` to set the server port
* `-d` to enter debug mode. makes *Restomatic* talk so much you wish it would just shut up.
* `-h` or `/help` to show command arguments help.

for example:
`node [your app file] -i=127.0.0.1 -p:8080 -d`

//TODO: how to customize the different parts of Restomatic
#### Custom handlers

#### Database Adapter

#### Parsers
Parsers are components that know how to convert strings in different file formats
like JSON or XML to JavaScript object, and vise versa.

A parser is a simple object with pre-defined properties that the pipeline
looks for when dealing with request data.

Adding a parser is real easy. To add a parser, call the `restomatic.server.parsers.register()` function and
pass in your new parser:

```javascript
restomatic.server.parsers.register({
    // parser name
    name: 'csv',

    // all the mime types this parser should handle
    mime: ['text/csv', 'application/excel'],

    // return the given object in csv string format
    serialize: function(obj) {
        return '';
    },

    // return the csv string as a js object
    deserialize: function(csv) {
        return {};
    }
});
```
By default, *Restomatic* comes with a build-in JSON parser.

#### Pipeline

The pipeline is what drives all the steps needed to make the magic happen,
from when the request comes in till the response comes out.

There are 5 built-in steps:
* **Header Parser** - reads the request headers and figures out what type of parsers are the required
* **Body Parser** - converts the request body to the proper format
* **Url Filter** -
