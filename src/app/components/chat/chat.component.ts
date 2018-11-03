import { Component, OnInit } from "@angular/core";
import { ChatService } from "../../providers/chat.service";
import { log } from "util";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styles: []
})
export class ChatComponent implements OnInit {
  public mensaje: string = "";

  constructor(public chatService: ChatService) {}

  ngOnInit() {
    this.chatService.cargarMensaje().subscribe((mensajes: any[]) => {
      console.log(mensajes);
    });
  }

  public enviarMensaje(): void {
    // valido que haya ingresado un mensaje
    if (this.mensaje.length === 0) {
      return;
    }

    this.chatService
      .publicarMensaje(this.mensaje)
      .then(() => (this.mensaje = ""))
      .catch(err => console.error("Mensaje no enviado", err));
  }
}
