
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonList,
  IonBadge,
  IonInput,
  IonButton,
  IonButtons,
  IonSearchbar,
  IonModal,
  ToastController
} from '@ionic/angular';

import {
  ApiService,
  Publicacion
} from '../Services/api.service';

interface Estudiante {
  id: number;
  nombre: string;
  email: string;
  nota:number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonList,
    IonBadge,
    IonInput,
    IonButton,
    IonButtons,
    IonSearchbar,
    IonModal
  ]
})
export class HomePage implements OnInit {

  private api = inject(ApiService);
  private toast = inject(ToastController);

  Estudiantes: Estudiante[] = [];
  filtradas: Estudiante[] = [];

  busqueda = '';
  notaMinima: number | null = 0;
  notaMaxima: number | null = 5;
  soloCriticos = false;

  modalAbierto = false;
  estudianteSeleccionado: Estudiante | null = null;

  cargando = false;
  errorCarga = '';

  ngOnInit() {
    this.cargarEstudiantes();
  }

  cargarEstudiantes() {
    this.cargando = true;
    this.errorCarga = '';

    this.api.obtenerEstudiantes().subscribe({
      next: (datos: Publicacion[]) => {

        this.Estudiantes = datos.map(comments => ({
          id: comments.id,
          nombre: comments.name,
          email: comments.email,
          nota: Math.floor(Math.random() * 5) + 1
        }));
         

        this.filtrar();
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.errorCarga = 'No se pudieron cargar las órdenes';
        this.mostrarToast(this.errorCarga, 'danger');
      }
    });
  }

  filtrar() {
    this.filtradas = this.Estudiantes.filter(estudiante => {

      const nombre = estudiante.nombre
        .toLowerCase()
        .includes(this.busqueda.toLowerCase());

      const minimo = this.notaMinima ?? 0;
      const maximo = this.notaMaxima ?? 5;

      const nota =
        estudiante.nota >= minimo &&
        estudiante.nota <= maximo;

      const stock =
        !this.soloCriticos || estudiante.nota < 3;

      return nombre && nota && stock;
    });
  }

  get totalCriticos(): number {
    return this.Estudiantes.filter(
      estudiante => estudiante.nota < 3
    ).length;
  }

  
 get promedio(): number {
  const suma = this.Estudiantes.reduce(
    (acc, estudiante) => acc + estudiante.nota,
    0
  );

  return this.Estudiantes.length
    ? suma / this.Estudiantes.length
    : 0;
}


  abrirModal(estudiante: Estudiante) {
    this.estudianteSeleccionado = estudiante;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  async mostrarToast(
    mensaje: string,
    color: string = 'success'
  ) {
    const aviso = await this.toast.create({
      message: mensaje,
      duration: 2500,
      color,
      position: 'bottom'
    });

    await aviso.present();
  }

  async confirmarOrden() {
    if (!this.estudianteSeleccionado) return;

    this.cerrarModal();
    await this.mostrarToast('Estudiante confirmado', 'success');
  }
}
