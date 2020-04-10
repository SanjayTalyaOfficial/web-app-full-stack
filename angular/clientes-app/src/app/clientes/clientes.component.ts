import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';
import { AuthService } from '../usuarios/auth.service';

import { URL_BACKEND } from 'src/app/config/config';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginator: any;
  selectedClient: Cliente;
  urlBackend: string = URL_BACKEND;

  constructor(private clienteService: ClienteService,
              private activatedRoute: ActivatedRoute,
              public modalService: ModalService,
              public authService: AuthService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.clienteService.getClientes(page).pipe(
        tap(response => {
          console.log('tap 3 - Cliente Component');
          (response.content as Cliente[]).forEach(cliente => {
            console.log(cliente.nombre);
          });
        })
      ).subscribe(response => {
        this.clientes = response.content as Cliente[];
        this.paginator = response;
        });
    });
    this.modalService.notifyUpload.subscribe( clienteUpdated => {
      this.clientes = this.clientes.map(cliente => {
        if (cliente.id === clienteUpdated.id) {
          cliente.photo = clienteUpdated.photo;
        }
        return cliente;
      });
    }
    );
  }

  delete(cliente: Cliente): void {
    swal.fire({
      title: 'Estás seguro?',
      text: `El cliente ${cliente.nombre} ${cliente.apellido} se eliminará definitivamente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente);
            swal.fire('Cliente eliminado', `Cliente ${cliente.nombre} eliminado con éxito`, 'success');
          }
        );
      }
    });
  }

  openModal(cliente: Cliente) {
    this.selectedClient = cliente;
    this.modalService.openModal();
  }

  signInMessage() {
    swal.fire('Área restringida', 'Por favor, inicia sesión para ver los detalles', 'warning');
  }

}
