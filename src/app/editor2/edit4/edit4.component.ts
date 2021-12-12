import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Scrobot } from 'src/app/@types/scrobot';
import { ScrinCopyDialogComponent } from 'src/app/editor/scrin-group/scrin-copy-dialog/scrin-copy-dialog.component';
import { AtchmnflService } from 'src/app/service/atchmnfl.service';
import { AuthService } from 'src/app/service/auth.service';
import { CompnService } from 'src/app/service/compn.service';
import { ElEventMessage, ElService } from 'src/app/service/el.service';
import { SelectedElService } from 'src/app/service/selected-el.service';
import { ScUtil } from 'src/app/service/util';
import { Left4Component } from '../left4/left4.component';
import { Left4Service } from '../left4/left4.service';
import { Menu4Component } from '../menu4/menu4.component';
import { Right4Component } from '../right4/right4.component';
import { Right4Service } from '../right4/right4.service';
import { Edit4Service } from './edit4.service';

@Component({
  selector: 'app-edit4',
  templateUrl: './edit4.component.html',
  styleUrls: ['./edit4.component.css'],
})
export class Edit4Component implements OnInit, AfterViewInit, OnDestroy {
  /**
   * 초기화 완료됨 이벤트
   */
  @Output() initedEvent = new EventEmitter<any>();

  /**
   * 프로젝트아이디 변경됨 이벤트 구독
   */
  prjctIdChangedEventSub: Subscription = new Subscription();
  /**
   * 화면 선택됨 이벤트 구독
   */
  scrinSelectedEventSub: Subscription = new Subscription();
  /**
   * 화면 닫힘 이벤트 구독
   */
  scrinClosedEventSub: Subscription = new Subscription();
  /**
   * 콤포넌트 선택됨 이벤트 구독
   */
  compnSelectedEventSub: Subscription = new Subscription();
  /**
   * 엘리먼트 선택됨 이벤트 구독
   */
  elSelectedEventSub: Subscription = new Subscription();
  /**
   * 엘리먼트 선택해제됨 이벤트 구독
   */
  unselectedEventSub: Subscription = new Subscription();

  menuRef?: Menu4Component;
  leftRef?: Left4Component;
  rightRef?: Right4Component;

  /**
   * 프로젝트아이디
   */
  prjctId: string = '';
  /**
   * 선택된 화면
   */
  selectedScrin: Scrobot.Scrin | undefined = undefined;
  /**
   * 콤포넌트 목록
   */
  compns: Scrobot.Compn[] = [];
  /**
   * 선택된 엘리먼트
   */
  $selectedEl: JQuery<HTMLElement> | undefined;

  constructor(route: ActivatedRoute, private authService: AuthService, private elService: ElService, private right4Service: Right4Service, private atchmnflService: AtchmnflService, private selectedElService: SelectedElService, private service: Edit4Service, private left4Service: Left4Service, private compnService: CompnService) {
    ScUtil.loadStyle('./assets/css/editmain.css');

    this.prjctId = route.snapshot.queryParamMap.get('prjctId') ?? '';
  }
  ngOnDestroy(): void {
    if (!this.prjctIdChangedEventSub.closed) {
      this.prjctIdChangedEventSub.unsubscribe();
    }
    if (!this.scrinSelectedEventSub.closed) {
      this.scrinSelectedEventSub.unsubscribe();
    }
    if (!this.scrinClosedEventSub.closed) {
      this.scrinClosedEventSub.unsubscribe();
    }
    if (!this.compnSelectedEventSub.closed) {
      this.compnSelectedEventSub.unsubscribe();
    }
    if (!this.elSelectedEventSub.closed) {
      this.elSelectedEventSub.unsubscribe();
    }
    if (!this.unselectedEventSub.closed) {
      this.unselectedEventSub.unsubscribe();
    }
  }
  ngAfterViewInit(): void {
    this.prjctIdChangedEventSub = this.service.prjctIdChangedEvent.subscribe((prjctId) => {
      console.log(prjctId);
    });

    this.service.prjctIdChangedEvent.emit(this.prjctId);

    //
    this.scrinSelectedEventSub = this.service.scrinSelectedEvent.subscribe((scrin) => {
      this.selectedScrin = scrin;
      // load compn
      this.loadCompn(scrin.scrinId);
    });

    //
    this.scrinClosedEventSub = this.service.scrinClosedEvent.subscribe(() => {
      this.elService.removeAll();
    });

    //
    this.compnSelectedEventSub = this.right4Service.compnSelectedEvent.subscribe((tagName) => {
      this.addEl(tagName);
    });

    //
    this.elSelectedEventSub = this.elService.elSelectedEvent.subscribe((message: ElEventMessage) => {
      this.$selectedEl = message.$el;
    });

    //
    this.unselectedEventSub = this.selectedElService.unselectedEvent.subscribe(() => {
      this.$selectedEl = undefined;
    });
  }

  ngOnInit(): void {
    ScUtil.loadScript('./assets/js/editor/jquery-1.12.3.js');
    ScUtil.loadScript('./assets/js/jquery-ui.min.js');
    ScUtil.loadScript('./assets/js/editor/jquery.easing.1.3.js');
    ScUtil.loadScript('./assets/js/editor/jquery.transit.min.js');

    //
    $('div.content').on('click', () => {
      this.selectedElService.clearAll();
      this.elService.clearAllBorder();
      this.elService.clearAllDraggable();
      this.elService.clearAllResizable();
    });

    //
    if (!this.authService.isAuthenticated()) {
      location.href = '/index';
    }
  }

  /**
   * 콤포넌트 목록 조회
   * @param scrinId 화면아이디
   */
  loadCompn(scrinId: string): void {
    this.compnService.listByScrinId(scrinId).then((res: any) => {
      this.compns = res.data;

      //
      this.elService.removeAll();
      this.compns.sort((a, b) => {
        return a.ordrValue - b.ordrValue;
      });

      //
      this.compns.forEach((x) => {
        this.addEl(x.compnSeCode, x.compnCn);
      });
    });
  }

  /**
   * 엘리먼트 화면에 추가
   * @param $elOrTagName
   * @param cn
   * @returns
   */
  private addEl($elOrTagName: JQuery<HTMLElement> | string, cn = ''): void {
    if ('string' === typeof $elOrTagName) {
      const tagName = $elOrTagName;
      let $el = this.elService.createEl($elOrTagName, cn);
      this.addEl($el);
      return;
    }

    //
    this.elService.clearAllDraggable();
    this.elService.clearAllResizable();
    this.elService.clearAllBorder();
    this.selectedElService.clearAll();

    // let $el = this.elService.createEl($elOrTagName, cn);
    let $el = $elOrTagName as JQuery<HTMLElement>;
    const tagName = ScUtil.getTagName($el);
    if (undefined === tagName) {
      return;
    }

    $el = this.elService.setDraggable(tagName, $el);
    $el = this.elService.setResizable(tagName, $el);
    $el = this.elService.listen(tagName, $el);

    this.elService.add($el.attr('id'), $el);

    $el.css('border', '2px dashed red');
    this.selectedElService.add($el.attr('id'), $el);
    this.$selectedEl = $el;

    // 1212 이미지를 base64로 저장하기 때문에 구지 src 변경하지 않아도 됨
    // // img이면
    // if ('img' === $el.attr('data-tag-name')) {
    //   const $img = $el.children().first();
    //   $img.attr('src', this.atchmnflService.getUrl($img.attr('data-atchmnfl-id')));
    // }

    this.elService.elSelectedEvent.emit({ e: '', tagName, $el });

    $('div.content').append($el);
  }

  /**
   * 메뉴 인스턴스 완료됨
   * @param c 메뉴 인스턴스
   */
  menuInited(c: Menu4Component): void {
    this.menuRef = c;
  }

  /**
   * 왼쪽 인스턴스 완료됨
   * @param c 왼쪽 인스턴스
   */
  leftInited(c: Left4Component): void {
    this.leftRef = c;
  }

  /**
   * 오른쪽 인스턴스 완료됨
   * @param c 오른쪽 인스턴스
   */
  rightInited(c: Right4Component): void {
    this.rightRef = c;
  }

  /**
   * 화면 저장
   */
  saveScrin(): void {
    this.elService.clearAllBorder();
    this.selectedElService.clearAll();
    this.$selectedEl = undefined;

    this.elService.regist(this.selectedScrin?.scrinId);
  }

  /**
   * 메뉴 변경됨 이벤트 유발자
   */
  triggerMenuChangedEvent(): void {
    this.service.menuChangedEvent.emit('');
  }

  /**
   * 화면 변경됨 이벤트 유발자
   */
  triggerScrinChangedEvent(): void {
    this.service.scrinChangedEvent.emit('');
  }

  /**
   * 화면 선택됨 이벤트 유발자
   * @param scrin 화면
   */
  triggerScrinSelectedEvent(scrin: Scrobot.Scrin): void {
    this.service.scrinSelectedEvent.emit(scrin);
  }

  /**
   * 화면 닫힘 이벤트 유발자
   */
  triggerScrinClosedEvent(): void {
    this.service.scrinClosedEvent.emit('');
  }
}
