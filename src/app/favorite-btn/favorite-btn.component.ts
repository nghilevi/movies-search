import { Component } from '@angular/core';

@Component({
  selector: 'app-favorite-btn',
  templateUrl: './favorite-btn.component.html',
  styleUrls: ['./favorite-btn.component.scss'],
  standalone: true,
})
export class FavoriteBtnComponent {
  isFavorite = false
  toggleFavorite(event: Event){
    event.stopPropagation()
    console.log('toggleFavorite')
    this.isFavorite = !this.isFavorite
  }
}
