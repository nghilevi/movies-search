import 'zone.js/dist/zone';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { FavoriteMoviesComponent } from './app/pages/favorite-movies/favorite-movies.component';
import { MovieDetailComponent } from './app/pages/movie-detail/movie-detail.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./app/pages/movies-search/movies-search.component').then((c) => c.MoviesSearchComponent)
  },
  {
    path: 'movie/favorites',
    component: FavoriteMoviesComponent
  },
  {
    path: 'movie/:id',
    component: MovieDetailComponent
  },
  {
    path: '**',
    redirectTo: ''
  },
];

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), provideRouter(routes)],
});
