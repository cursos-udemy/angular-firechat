import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";

import { Observable } from "rxjs";
import { Mensaje } from "../interfaces/mensaje.interface";

import { map } from "rxjs/operators";

export interface Item {
  name: string;
}

@Injectable({
  providedIn: "root"
})
export class ChatService {
  public chats: Mensaje[] = [];
  public usuario: any = {};

  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe( (user:firebase.User) => {
      console.log("Estado del usuario: ", user);
      if (!user) {
        return;
      }

      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
    });
  }

  public cargarMensaje(): Observable<Mensaje[]> {
    // recupero los ultimos 5 mensajes
    this.itemsCollection = this.afs.collection<Mensaje>("chats", ref =>
      ref.orderBy("fecha", "desc").limit(5)
    );

    // map para visualizar mensajes en orden cronologico
    return this.itemsCollection.valueChanges().pipe(
      map((data: Mensaje[]) => {
        this.chats = data.reverse();
        return data;
      })
    );
  }

  public publicarMensaje(mensaje: string) {
    let msg: Mensaje = {
      uid: this.usuario.uid,
      remitente: this.usuario.nombre,
      texto: mensaje,
      fecha: new Date().getTime()
    };
    console.log(msg);

    return this.itemsCollection.add(msg);
  }

  public login(servicio: string) {
    console.log(servicio);

    if (servicio === "google") {
      this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    } else if (servicio === "github") {
      this.afAuth.auth.signInWithPopup(new auth.GithubAuthProvider());
    }
  }

  public logout() {
    this.usuario = {};
    this.afAuth.auth.signOut();
  }
}
