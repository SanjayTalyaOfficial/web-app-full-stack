import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { formatDate, DatePipe } from '@angular/common';

import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente.js';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { Region } from './region';

import { URL_BACKEND } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  urlEndPoint = URL_BACKEND + '/api/clientes';

  constructor(private http: HttpClient,
              private router: Router) { }

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlEndPoint + '/regiones');
  }

  getClientes(page: number): Observable<any> {
    /* CLIENTES converted as stream by using of
    return of(CLIENTES); */
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap( (response: any) => {
        console.log('tap 1');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        });
      }),
      map( (response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          // let datePipe = new DatePipe('es');
          // cliente.createdAt = datePipe.transform(cliente.createdAt, 'EEEE dd, MMMM yyyy');
          // cliente.createdAt = formatDate(cliente.createdAt, 'dd-MM-yyyy', 'en_US');
          return cliente;
        });
        return response;
      }),
      tap(response => {
        console.log('tap 2');
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        });
      })
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente).pipe(
      map( (jsonResponse: any) => jsonResponse.cliente as Cliente),
      catchError(e => {
        if (e.status === 400) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  getCliente(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['./clientes']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
      catchError(e => {
        if ( e.status === 400) {
          return throwError(e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  uploadPhoto(photo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append('file', photo);
    formData.append('id', id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }
}
