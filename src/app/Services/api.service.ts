
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Publicacion {
  postId: number;
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient);

  private url =
    'https://jsonplaceholder.typicode.com/comments';

  obtenerEstudiantes(): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(this.url);
  }
}
