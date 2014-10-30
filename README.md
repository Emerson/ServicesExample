# Service Example

This repo is a personal exploration into the world of service oriented architecture. Based on the goal of eventually recreating Reddit, the idea is to break up the major pieces of functionality into individual providers and consumers using different technologies. Everything here is a **work in progress** and is not meant for production.

## Tests

Once the individual projects are setup you can run the tests by running `./test.sh`.

![](https://dl.dropboxusercontent.com/u/4502950/Github/upsurge-tests.gif)

## Starting the Apps

There is a simple Procfile that can be used with [Foreman](https://github.com/ddollar/foreman) to start the apps. You'll need to install the dependencies for each project before getting started.

![](https://dl.dropboxusercontent.com/u/4502950/Github/forman-start.gif)

---
### [Auth](https://github.com/Emerson/ServicesExample/tree/master/Auth)
An example **Node** app that handles user management and provides token based authentication. Feel free to read the [user](https://github.com/Emerson/ServicesExample/blob/master/Auth/test/controllers/users.js) and [authentication](https://github.com/Emerson/ServicesExample/blob/master/Auth/test/controllers/authentications.js) controller tests for basic documentation. Because it's just an example/exercise, this service uses Sqlite and is not actually suitable for production deployments. I've noticed a number of serious short comings with Sqlite, the worst being frequent database corruption.

---
### [Stories](https://github.com/Emerson/ServicesExample/tree/master/Stories)
A fairly standard **Rails** app that will manage story submission and story management. It ensures users are authenticated before letting them create, update, or destroy stories.

---
### [Web-UI](https://github.com/Emerson/ServicesExample/tree/master/Web-UI)
The first steps of an **Ember-CLI** app that will _(eventually)_ act as the front-end of the site. It's pretty limited at the moment, but the foundations are well written so far _(in my opinion)_.

## Notes

* Due to the nature of token based authentication, in the wild this ecosystem would need to be run over SSL to avoid man in the middle attacks.