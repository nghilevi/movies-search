import { Component, OnInit } from '@angular/core';
import { MoviesApiService } from '../../services/movies.api-service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, map, of } from 'rxjs';
import { FavoriteBtnComponent } from 'src/app/components/add-favorite-movie-btn/add-favorite-movie-btn.component';
import { Movie, Genre } from 'src/app/shared/movies.model';
export interface MovieDetail extends Movie {
  genresNames: string
 }

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FavoriteBtnComponent],
})
export class MovieDetailComponent implements OnInit {

  constructor(private route: ActivatedRoute, private MoviesApiService: MoviesApiService) {}

  movie$: Observable<MovieDetail> = of()

  ngOnInit(): void {
    this.route.url
      .subscribe(paths => {
        const movieId = paths[1].path
        this.movie$ = this.MoviesApiService.getMovie(movieId).pipe(
          map((movie: Movie) => {
            return {...movie, genresNames: movie.genres.map((g: Genre) => g.name).join(', ')}
          })
        )
      });
  }
}
