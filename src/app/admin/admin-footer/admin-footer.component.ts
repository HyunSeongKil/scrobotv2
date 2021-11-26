import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-admin-footer',
  templateUrl: './admin-footer.component.html',
  styleUrls: ['./admin-footer.component.css'],
})
export class AdminFooterComponent implements OnInit {
  @Output() initedEvent = new EventEmitter<AdminFooterComponent>();

  constructor() {}

  ngOnInit(): void {
    this.initedEvent.emit(this);
  }
}
