import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private onSearchSub = new BehaviorSubject<string>('');
  onSearch$ = this.onSearchSub.asObservable().pipe(
    debounceTime(500),
    distinctUntilChanged()
  )

  search(searchStr: string){
    this.onSearchSub.next(searchStr)
  }

  get searchValue(){
    return this.onSearchSub.value
  }
}
