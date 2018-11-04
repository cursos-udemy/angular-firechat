import { Component, OnInit } from "@angular/core";
import { ChatService } from "../../providers/chat.service";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styles: []
})
export class ChatComponent implements OnInit {
  public mensaje: string = "";
  public element: HTMLElement;

  constructor(public chatService: ChatService) {}

  ngOnInit() {
    this.element = document.getElementById("app-mensajes");
    console.log("chat.component [OK]");
    
    this.chatService.cargarMensaje().subscribe(()=> {
      setTimeout(() => {
        console.log("tengo que ajustar el scroll");
        this.element.scrollTop = this.element.scrollHeight;
      }, 20);
    });
  }

  public enviarMensaje(): void {
    // valido que haya ingresado un mensaje
    if (this.mensaje.length === 0) {
      return;
    }

    // publico el mensaje en firebase.
    this.chatService
      .publicarMensaje(this.mensaje)
      .then(() => (this.mensaje = ""))
      .catch(err => console.error("Mensaje no enviado", err));
  }
}
