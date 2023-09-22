import { Component, Input, TrackByFunction } from '@angular/core';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { RouterModule } from '@angular/router';
import { MovieListItem } from '../shared/movies.model';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-movie-cards',
  templateUrl: './movie-cards.component.html',
  styleUrls: ['./movie-cards.component.scss'],
  standalone: true,
  imports: [RouterModule, NgFor, MovieCardComponent]
})
export class MovieCardsComponent {
  @Input() movies: MovieListItem[] | null = null
  trackByMovieId: TrackByFunction<MovieListItem> = (index, movie) => movie.id;
}
