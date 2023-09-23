import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../shared/shared.model';
import { Movie, MovieListItem } from '../shared/movies.model';

type ParamValue = string | number | boolean;

@Injectable({
  providedIn: 'root',
})
export class MoviesApiService {
  private static baseUrl = 'https://api.themoviedb.org/3';
  private static apiKey = 'eafcbae007d456afdaf16e4b0324092d';

  private static getRequestUrl(path: string): string {
    return `${MoviesApiService.baseUrl}${path}`;
  }

  private static get apiKeyParams(): Record<string, ParamValue> {
    return {
      api_key: MoviesApiService.apiKey,
    };
  }

  private static extendParamsWithApiKey<T extends Record<string, ParamValue>>(
    params: T
  ): Record<string, ParamValue> {
    const apiKeyParams = MoviesApiService.apiKeyParams;

    return params && typeof params === 'object'
      ? { ...params, ...apiKeyParams }
      : apiKeyParams;
  }

  private static getUrlAndParams(
    path: string,
    params: Record<string, ParamValue>
  ): { url: string; params: Record<string, ParamValue> } {
    return {
      url: MoviesApiService.getRequestUrl(path),
      params: MoviesApiService.extendParamsWithApiKey(params),
    };
  }

  constructor(private http: HttpClient) {}

  getMovie(movieId: string): Observable<Movie> { // get movie by id
    const { url, params } = MoviesApiService.getUrlAndParams(
      `/movie/${movieId}`,
      {}
    );

    return this.http.get<Movie>(url, { params });
  }

  getPopularMovies(page = 1): Observable<PaginatedResult<MovieListItem>> {
    const { url, params } = MoviesApiService.getUrlAndParams('/movie/popular', {
      page,
    });

    return this.http.get<PaginatedResult<MovieListItem>>(url, { params });
  }

  searchMovies(
    query: string,
    page = 1
  ): Observable<PaginatedResult<MovieListItem>> {
    const { url, params } = MoviesApiService.getUrlAndParams('/search/movie', {
      page,
      query,
    });

    return this.http.get<PaginatedResult<MovieListItem>>(url, { params });
  }
}
