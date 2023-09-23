import { Injectable } from '@angular/core';

export const LS_KEY = 'favorite-movies'

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor() { }

  saveData(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  getData(key: string) {
    return localStorage.getItem(key)
  }
  removeData(key: string) {
    localStorage.removeItem(key);
  }

  clearData() {
    localStorage.clear();
  }

  getFavoritesStore(){
    const favoritesStr = this.getData(LS_KEY)
    return favoritesStr ? JSON.parse(favoritesStr) : {}
  }
}