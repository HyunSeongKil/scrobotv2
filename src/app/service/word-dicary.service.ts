import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WordDicaryService {
  BIZ_URI = `http://localhost:38080/scrobot/word-dicarys`;

  constructor(private http: HttpClient) {}

  listByWords(words: string[]): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/by-words?words=${words.join(',')}`).toPromise();
  }
}
