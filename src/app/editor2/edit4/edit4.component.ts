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
  @Output() initedEvent = new EventEmitter<any>();

  prjctIdChangedEventSub: Subscription = new Subscription();
  scrinSelectedEventSub: Subscription = new Subscription();
  scrinClosedEventSub: Subscription = new Subscription();
  compnSelectedEventSub: Subscription = new Subscription();
  elSelectedEventSub: Subscription = new Subscription();
  unselectedEventSub: Subscription = new Subscription();

  menuRef?: Menu4Component;
  leftRef?: Left4Component;
  rightRef?: Right4Component;

  prjctId: string = '';
  selectedScrin: Scrobot.Scrin | undefined = undefined;
  compns: Scrobot.Compn[] = [];

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

    // img이면
    if ('img' === $el.attr('data-tag-name')) {
      const $img = $el.children().first();
      $img.attr('src', this.atchmnflService.getUrl($img.attr('data-atchmnfl-id')));
    }

    $('div.content').append($el);
  }

  menuInited(c: Menu4Component): void {
    this.menuRef = c;
  }

  leftInited(c: Left4Component): void {
    this.leftRef = c;
  }

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

  triggerMenuChangedEvent(): void {
    this.service.menuChangedEvent.emit('');
  }

  triggerScrinChangedEvent(): void {
    this.service.scrinChangedEvent.emit('');
  }

  triggerScrinSelectedEvent(scrin: Scrobot.Scrin): void {
    this.service.scrinSelectedEvent.emit(scrin);
  }

  triggerScrinClosedEvent(): void {
    this.service.scrinClosedEvent.emit('');
  }
}
