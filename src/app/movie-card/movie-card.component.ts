import { Component, Input } from '@angular/core';
import { MovieListItem } from '../shared/movies.model';
import { CommonModule } from '@angular/common';
import { FavoriteBtnComponent } from '../add-favorite-movie-btn/add-favorite-movie-btn.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  standalone: true,
  imports: [CommonModule, FavoriteBtnComponent],
})
export class MovieCardComponent {
  @Input('movie') movie: MovieListItem | null = null
}
