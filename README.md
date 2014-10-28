# Service Example

This repo is an example of service oriented architecture using different technologies. Based loosely on Reddit, the idea is to break up the major pieces of functionality into individual providers and consumers. Due to the nature of token based authentication, in the wild this service would need to be run over SSL to avoid man in the middle attacks. Everything here is **work in progress...**

## Tests

Once the individual projects are setup you can run the tests by running `./test.sh`.

![](https://dl.dropboxusercontent.com/u/4502950/Github/upsurge-tests.gif)

## Starting the Apps

There is a simple Procfile that can be used with [Foreman](https://github.com/ddollar/foreman) to start the apps. You'll need to install the dependencies for each project before getting started.

![](https://dl.dropboxusercontent.com/u/4502950/Github/forman-start.gif)

---
### [Auth](https://github.com/Emerson/ServicesExample/tree/master/Auth)
An example **Node** app that handles user management and provides token based authentication. Feel free to read the [user](https://github.com/Emerson/ServicesExample/blob/master/Auth/test/controllers/users.js) and [authentication](https://github.com/Emerson/ServicesExample/blob/master/Auth/test/controllers/authentications.js) controller tests for basic documentation. Because it's just an example/exercise, this service uses Sqlite and is not actual suitable for production deployments.

---
### [Stories](https://github.com/Emerson/ServicesExample/tree/master/Stories)
A fairly standard **Rails** app that manages story submission and story management. It ensures users are authenticated before letting them create, update, or destroy stories.

---
### [Web-UI](https://github.com/Emerson/ServicesExample/tree/master/Web-UI)
The first steps of an **Ember-CLI** app that will _(eventually)_ act as the front-end of the site.
