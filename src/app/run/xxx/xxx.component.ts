import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import 'jqueryui';

@Component({
  selector: 'app-xxx',
  templateUrl: './xxx.component.html',
  styleUrls: ['./xxx.component.css'],
})
export class XxxComponent implements OnInit, AfterViewInit {
  @ViewChild('thisRef') thisRef!: ElementRef<HTMLDivElement>;

  mbUuid = '';
  scrinGroupUuid = '';
  scrinUuid = '';

  constructor(route: ActivatedRoute, private router: Router, private renderer: Renderer2, private http: HttpClient) {
    this.mbUuid = route.snapshot.paramMap.get('mbUuid') ?? '';
    this.scrinGroupUuid = route.snapshot.paramMap.get('scrinGroupUuid') ?? '';
    this.scrinUuid = route.snapshot.paramMap.get('scrinUuid') ?? '';
  }
  ngAfterViewInit(): void {
    // load component html source where scrinUuid
    let html = ``;
    html += `<form id="form" enctype="multipart/form-data" method="post">`;
    html += `<h1 style="position:absolute; left:10px; top:10px; width:500px; height:100px; ">제목1</h1>`;
    html += `<span style="position:absolute; left:50px; top:100px; ">제목</span>`;
    html += `<input type="text" name="sj" style="position:absolute; left:100px; top:100px;" />`;
    html += `<span style="position:absolute; left:50px; top:150px; ">내용</span>`;
    html += `<textarea name="cn" rows="10" cols="100" style="position:absolute; left:100px; top:150px; " /></textarea>`;
    html += `<select name="useYn"  style="position:absolute; top:400px;"><option value="값">텍스트</option></select>`;
    html += `<input type="file" name="file" style="position:absolute; top:450px;">`;
    html += `<button type="button" class="btn btn-primary" data-button-type="REGIST" data-button-link="scrinUUid" style="position:absolute; left:100px; top:500px;">등록</button>`;
    html += `<button type="button" class="btn btn-secondary" data-button-type="CANCEL" data-button-link="scrinUUid" style="position:absolute; left:200px; top:500px;">취소</button>`;
    html += `</form>`;

    // render component html source
    $('div.this').append(html);

    // add event listener
    const registBtnEl = document.querySelector('button[data-button-type="REGIST"]');
    if (null != registBtnEl) {
      registBtnEl?.addEventListener('click', () => {
        this.regist(registBtnEl as HTMLButtonElement);
      });
    }
  }

  ngOnInit(): void {}

  /**
   * 등록
   * @returns void
   */
  regist(el: HTMLButtonElement | null): void {
    if (!confirm('저장하시겠습니까?')) {
      return;
    }

    const inputs = this.thisRef.nativeElement.querySelectorAll('input');
    const selects = this.thisRef.nativeElement.querySelectorAll('select');
    const textareas = this.thisRef.nativeElement.querySelectorAll('textarea');
    console.log(inputs, selects, textareas);

    const fd = new FormData();

    inputs.forEach((x) => {
      console.log(x.name, x.value, x.files);
      if (null != x.files) {
        for (let i = 0; i < x.files.length; i++) {
          fd.append('files', x.files[i]);
        }
      } else {
        fd.append(x.name, x.value);
      }
    });

    fd.forEach((v, k) => {
      console.log(k, v);
    });

    this.http
      .post(`http://localhost/api/scrinUuid`, fd)
      .toPromise()
      .then(() => {
        this.router.navigate(['mbId/scrinGroupUuid/scrinUuid']);
      })
      .catch(() => {
        alert('오류가 발생했습니다.');
      });
  }
}
