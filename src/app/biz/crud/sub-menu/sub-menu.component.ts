import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TrgetSys } from 'src/app/@types/trgetSys';
import { BizService } from '../../biz.service';

/**
 * 하위 메뉴
 */
@Component({
  selector: 'app-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.css'],
})
export class SubMenuComponent implements OnInit, OnChanges {
  @Input() prjctId = '';
  @Input() mainMenuId = '';
  @Input() subMenuId = '';
  @Output() subMenuInitedEvent = new EventEmitter<any>();
  @Output() subMenuClickedEvent = new EventEmitter<TrgetSys.Menu>();

  /**
   * 전체 메뉴 목록
   */
  menus: TrgetSys.Menu[] = [];
  /**
   * 선택된 메인메뉴의 하위 메뉴 목록
   */
  subMenus: TrgetSys.Menu[] = [];

  constructor(private bizService: BizService) {}
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    //
    if (undefined !== changes['prjctId'] && undefined !== changes['prjctId'].currentValue) {
      this.init();
    }

    //
    if (undefined !== changes['mainMenuId'] && undefined !== changes['mainMenuId'].currentValue) {
      this.subMenus = this.getSubMenus(this.mainMenuId);
    }
  }

  /**
   * 전체 메뉴 목록 조회
   */
  init(): void {
    this.bizService.getMenus(this.prjctId).then((res: any) => {
      this.menus = res.data;

      this.subMenuInitedEvent.emit('');
    });
  }

  /**
   *
   */
  getSubMenus(menuId: string): TrgetSys.Menu[] {
    const arr: TrgetSys.Menu[] = [];

    this.menus.forEach((x) => {
      if (x.prnts_menu_id === menuId) {
        arr.push(x);
      }
    });

    return arr;
  }

  /**
   * 하위 메뉴 클릭됨
   * @param x 메뉴 인스턴스
   */
  subMenuClicked(x: TrgetSys.Menu): void {
    this.subMenuClickedEvent.emit(x);
  }
}
