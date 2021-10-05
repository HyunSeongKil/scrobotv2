import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TrgetSys } from 'src/app/@types/trgetSys';
import { MenuService } from 'src/app/service/menu.service';
import { BizService } from '../../biz.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css'],
})
export class MainMenuComponent implements OnInit, OnChanges {
  @Input() prjctId = '';
  @Input() mainMenuId = '';
  @Output() mainMenuClickedEvent = new EventEmitter<TrgetSys.Menu>();

  // 메뉴 목록
  menus: TrgetSys.Menu[] = [];

  constructor(private bizService: BizService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (undefined !== changes['prjctId']) {
      if (undefined !== changes['prjctId'].currentValue) {
        this.init();
      }
    }
  }

  ngOnInit(): void {}

  init(): void {
    // 메뉴
    this.bizService.getMenus(this.prjctId).then((res: any) => {
      this.menus = res.data;
      // this.showMainMenus();
    });
  }

  /**
   * 메인 메뉴 클릭됨
   * @param menuId 메뉴 아이디
   */
  mainMenuClicked(x: TrgetSys.Menu): void {
    //
    this.mainMenuClickedEvent.emit(x);
  }
}
