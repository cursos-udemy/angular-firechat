import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
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
  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  constructor(private afs: AngularFirestore) {}

  public cargarMensaje(): Observable<Mensaje[]> {
    this.itemsCollection = this.afs.collection<Mensaje>("chats");
    return this.itemsCollection.valueChanges().pipe(
      map((data: Mensaje[]) => {
        this.chats = data;
        return data;
      })
    );
  }

  public publicarMensaje(texto: string) {
    let msg: Mensaje = {
      uid: "",
      remitente: "Willy",
      texto: texto,
      fecha: new Date().getTime()
    };
    console.log(msg);

    return this.itemsCollection.add(msg);
  }
}
