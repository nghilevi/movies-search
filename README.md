## Overview

[DEMO](https://nghilevi.github.io/movies-search/)

- This project was generated with Angular CLI version 16.
- Tested on: Chrome 112.0.5615.49, Firefox 117.0.1
- Please see usage notes [here](#notes)
- **TODO**: 
    * For simplicity, currently only 1 observable (getMovies$) and 1 local variable for page (currentPage) are used for both searched and popular movies. It is better to have 2 separate observables for each category e.g searchedMovies$ and popularMovies$ to be able to cache their data (emitted values, current page) respectively which will optimize/enhance the app performance and UX further. 
    * There is a PR, which is WIP, available here: [https://github.com/nghilevi/movies-search/pull/1]https://github.com/nghilevi/movies-search/pull/1

### 1/ Search page
<img src="screenshots/1-search.png" />

### 1.2/ Search page on small screen size
<img src="screenshots/1.2-search.png" />

### 2/ Detail page
<img src="screenshots/2-detail.png" />

### 3/ Favorite page
<img src="screenshots/3-favorite.png" />

# Development

Clone the project and run the following commands to see the project on your browser

```bash
npm install
npm run start
```

go to  `http://localhost:4200/`

### Notes
- Click on the heart icon 🤍 to save/unsave movie to favorites collection
- You can access a specific movie detail by manually entering the url e.g http://localhost:4200/movie/1008042
- If you encounter any problems while navigating within the app, such as issues when clicking on the navigation bar buttons, please check the development log for any ChunkLoadError messages. If you come across this error, try clearing your cache and then relaunch the app.