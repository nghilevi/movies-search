import { Injectable } from '@angular/core';

export const LS_KEY = 'favorite-movies'

@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor() { }

  public saveData(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public getData(key: string) {
    return localStorage.getItem(key)
  }
  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

  public getFavoritesStore(){
    const favoritesStr = this.getData(LS_KEY)
    return favoritesStr ? JSON.parse(favoritesStr) : {}
  }
}