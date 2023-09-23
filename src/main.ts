import 'zone.js/dist/zone';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';

const routes: Routes = [
  {
    path: 'movies-search',
    pathMatch: 'full',
    loadComponent: () => import('./app/pages/movies-search/movies-search.component').then((c) => c.MoviesSearchComponent)
  },
  {
    path: 'movie/favorites',
    loadComponent: () => import('./app/pages/favorite-movies/favorite-movies.component').then((c) => c.FavoriteMoviesComponent)
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./app/pages/movie-detail/movie-detail.component').then((c) => c.MovieDetailComponent)
  },
  {
    path: '**',
    redirectTo: 'movies-search'
  },
];

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), provideRouter(routes)],
});
