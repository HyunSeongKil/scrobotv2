import { Component, EventEmitter, Host, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Scrobot } from 'src/app/@types/scrobot';
import { MenuService } from 'src/app/service/menu.service';
import { Edit2Component, TabSe } from '../edit2/edit2.component';

@Component({
  selector: 'app-menu2',
  templateUrl: './menu2.component.html',
  styleUrls: ['./menu2.component.css'],
})
export class Menu2Component implements OnInit, OnDestroy {
  @Output() initedEvent = new EventEmitter<any>();

  hostComponent: Edit2Component | undefined = undefined;

  tabChangedEventSub: Subscription | undefined = new Subscription();
  editingEventSub: Subscription | undefined = new Subscription();
  closeEditingEventSub: Subscription | undefined = new Subscription();

  menus: Scrobot.Menu[] = [];

  constructor(@Host() hostCompnent: Edit2Component, private service: MenuService) {
    this.hostComponent = hostCompnent;
  }
  ngOnDestroy(): void {
    if (!this.tabChangedEventSub?.closed) {
      this.tabChangedEventSub?.unsubscribe();
    }

    if (!this.editingEventSub?.closed) {
      this.editingEventSub?.unsubscribe();
    }

    if (!this.closeEditingEventSub?.closed) {
      this.closeEditingEventSub?.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.initedEvent.emit(TabSe.Menu);

    this.tabChangedEventSub = this.hostComponent?.tabChangedEvent.subscribe((se: string) => {
      if (TabSe.Menu === se) {
        this.service.listByPrjctId(this.hostComponent?.prjctId ?? '').then((res: any) => {
          this.menus = res.data;
          console.log(this.menus);
        });
      }
    });

    this.editingEventSub = this.hostComponent?.editingEvent.subscribe((scrinId: string) => {});

    this.closeEditingEventSub = this.hostComponent?.closeEditingEvent.subscribe((scrinId: string) => {});
  }

  openMenuRegistDialog(menuId: string): void {}

  openMenuUpdateDialog(menuId: string): void {}

  deleteMenu(menuId: string): void {}
}
