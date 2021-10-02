class Util {
  /**
   * 랜덤한 id 문자열 생성
   * @returns string
   */
  static createId(): string {
    return 'id_' + new Date().getTime();
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
}
