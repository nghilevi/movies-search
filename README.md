# Luzmo FE Test Task

You need to implement an MVP of a Single Page Application to watch movies using The Movie Database API.

## Requirements

When you open the application, a “Popular Movies” page should be displayed as a start page.
This page should be a list of popular movies with pagination or dynamic loading.

Each movie entry on the page should be presented as a "card" component and consist of: poster, title, release date, vote average and favorite button(as an example see: https://www.themoviedb.org/).

Also, there should be a search field, so when you enter some text there, the movies are filtered out as per the search query.

When you click on a movie card, a page with detailed information about this movie(poster, title, overview, genres, release date, vote average and favorite button) should be shown.

**[Optional]** Develop the ability to add/remove movies to/from favorites both from the list and on the page with a movie details. Save the list of such movies locally (localStorage/sessionStorage, for example). Consider viewing a list of favorite films somewhere in the application(separate page) and deleting them from favorites.

## Dev Notes

There is a provided test task skeleton that already has:

- an API Service with prepared methods;
- interfaces;
- test image to show how we can display posters with proper URLs.

You can use any components library to implement cards/buttons etc to boost the development speed. Think about this task as a scalable and maintainable production-ready application. Feel free to add TODOs to save your time but still share your thoughts' direction, at the same time don’t misuse it though.

Good luck! :)

## Development

This project was generated with Angular CLI version 16.

### Development server

Run `ng serve` for a dev server. Navigate to _http://localhost:4200/_. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the dist/ directory.

### Running unit tests

Run `ng test` to execute the unit tests via Karma.
