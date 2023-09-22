import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieListItem } from 'src/app/shared/movies.model';
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
