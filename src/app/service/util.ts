import { HtmlAstPath } from '@angular/compiler';

export class ScUtil {
  /**
   * 행번호 계산
   * @param totcnt 전체건수
   * @param pageNo 현재 페이지 번호
   * @param pageSize 페이징 크기
   * @param i 현재 인덱스
   * @returns 행번호
   */
  static itemNo(totcnt: number, pageNo: number, pageSize: number, i: number): number {
    return totcnt - (pageNo - 1) * pageSize - i;
  }

  /**
   * 랜덤한 id 문자열 생성
   * @returns string
   */
  static createId(): string {
    return 'id_' + new Date().getTime();
  }

  static replaceAll(str: string, search: string, replace: string): string {
    return str.split(search).join(replace);
  }

  /**
   *
   * @returns
   */
  static randColor(): string {
    const colors: string[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

    return colors[this.rand(0, colors.length - 1)];
  }

  /**
   * 랜덤 숫자
   * @param min 최소 값
   * @param max 최대 값
   * @returns 숫자
   */
  static rand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * 클래스 추가
   * @param els 엘리먼트 목록
   * @param className 클래스 명
   */
  static addClass(els: any[], className: string): void {
    els.forEach((el) => {
      $(el).addClass(className);
      // this.renderer.addClass(el, className);
    });
  }

  /**
   * 클래스 제거
   * @param els 엘리먼트 목록
   * @param className 클래스 명
   */
  static removeClass(els: any[], className: string): void {
    els.forEach((el) => {
      $(el).removeClass(className);
      // this.renderer.removeClass(el, className);
    });
  }

  /**
   * 엘리먼트 표시하기
   * @param els 엘리먼트 목록
   */
  static show(els: any[]): void {
    els.forEach((el) => {
      $(el).removeClass(el, 'd-none');
      // this.renderer.setStyle(el, 'display', 'block');
    });
  }

  /**
   * 엘리먼트 숨기기
   * @param els 엘리먼트 목록
   */
  static hide(els: any[]): void {
    els.forEach((el) => {
      $(el).addClass(el, 'd-none');
      // this.renderer.setStyle(el, 'display', 'none');
    });
  }

  /**
   * 랩퍼 엘리먼트인지 여부
   * @param $el 엘리먼트
   * @returns 랩퍼 엘리먼트이면 true
   */
  static isWrapperEl($el: JQuery<HTMLElement> | undefined): boolean {
    if (undefined === $el) {
      return false;
    }

    return $el.hasClass('wrapper');
  }

  /**
   * 이미지 파일인지 여부
   * @param filename 파일명
   * @returns 이미지 파일이면 true
   */
  static isImageFile(filename: string): boolean {
    if ('' === filename) {
      return false;
    }

    let b: boolean = false;
    ['.jpg', '.png', '.gif', '.bmp', '.jpeg'].forEach((ext) => {
      b ||= filename.toLowerCase().endsWith(ext);
    });

    return b;
  }

  /**
   * 부모가 랩퍼 엘리먼트인지 여부
   * @param $el 엘리먼트
   * @returns 부모가 랩퍼 엘리먼트이면 true
   */
  static existsParentWrapperEl($el: JQuery<HTMLElement> | undefined): boolean {
    if (undefined === $el?.parent()) {
      return false;
    }

    return $el.parent().hasClass('wrapper');
  }

  /**
   * 태그명 구하기. 현재 엘리먼트에 태그명 없으면 부모 엘리먼트에서 추출
   * @param $el 엘리먼트
   * @returns 태그 명
   */
  static getTagName($el: JQuery<HTMLElement> | undefined): string | undefined {
    if (undefined === $el) {
      return undefined;
    }

    if (undefined !== $el.attr('data-tag-name')) {
      return $el.attr('data-tag-name') as string;
    }

    return $el.parent().attr('data-tag-name');
  }

  /**
   * rgb => hex
   * @param r r
   * @param g g
   * @param b b
   * @returns hexa
   */
  static rgbToHex(r: number, g: number, b: number): string {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  static loadScript(url: string, fn?: (res: any) => void): void {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
    node.onload = () => {
      if (undefined !== fn) {
        fn(url);
      }
    };
  }

  static loadStyle(url: string, fn?: (res: any) => void): void {
    var link = document.createElement('link');
    link.href = url;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.media = 'screen,print';
    link.onload = () => {
      if (undefined !== fn) {
        fn(url);
      }
    };

    document.getElementsByTagName('head')[0].appendChild(link);
  }
}
