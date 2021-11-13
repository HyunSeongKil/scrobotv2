package scrobot.assistant.commoninterfac;

public class Paging {

	private int maxNum; // 전체 글 개수
	private int pageNum; // 현재 페이지 번호
	private int listCount; // 페이지 당 글 개수
	private int pageCount; // 한 페이지에서 페이지번호 개수
	private String listName; // 목록 페이지의 종류
	private String SearchYn;

	public Paging(int maxNum, int pageNum, int listCount, int pageCount, String listName, String SearchYn) {
		this.maxNum = maxNum;
		this.pageNum = pageNum;
		this.listCount = listCount;
		this.pageCount = pageCount;
		this.listName = listName;
		this.SearchYn = SearchYn;
	}

	public String makeHtmlPaging() {
		// 전체 페이지 개수
		// 9개 이하일 때 totalPage = 0
		// 11개 이상일 때 totalPage = 2
		int totalPage = (maxNum % listCount > 0) ? maxNum / listCount + 1 : maxNum / listCount;
		// 현재 페이지가 속해 있는 그룹 번호
		int currentGroup = (pageNum % pageCount > 0) ? pageNum / pageCount + 1 : pageNum / pageCount;
		return makeHtml(totalPage, currentGroup);
	}

	private String makeHtml(int totalPage, int currentGroup) {
		StringBuffer sb = new StringBuffer();

		// 현재 그룹의 시작 페이지 번호
		int start = (currentGroup * pageCount) - (pageCount - 1);

		// 현재 그룹의 끝 페이지 번호
		int end = (currentGroup * pageCount >= totalPage) ? totalPage : currentGroup * pageCount;

		if (start != 1) {
			sb.append("<a class='paging' href='" + listName + "?pageNum=" + (start - 1) + "'>");
			sb.append("＜");
			sb.append("</a>");
		}
		// <a href='list?pageNum=5'>[이전]</a>
		if (SearchYn.equals("Y")) {
			for (int i = start; i <= end; i++) {
				if (pageNum != i) {
					sb.append("<a href='" + listName + "&pageNum=" + i + "'>");
					sb.append("" + i + "</a>");
				} else {

					sb.append("<a style='color: #fff;background: #8f4920;border: 1px solid #8f4920;'><font>");
					sb.append("" + i + "</font></a>");
				}
			}
		} else {
			for (int i = start; i <= end; i++) {
				if (pageNum != i) {
					sb.append("<a href='" + listName + "?pageNum=" + i + "'>");
					sb.append("" + i + "</a>");
				} else {
					sb.append("<a style='color: #fff;background: #8f4920;border: 1px solid #8f4920;'><font>");
					sb.append("" + i + "</font></a>");

				}
			}
		}

		// <a href='list?pageNum=6'>[ 6 ]</a>
		// <font style='color:red'>[ 7 ]</font>
		// <a href='list?pageNum=8'>[ 8 ]</a>
		// <a href='list?pageNum=9'>[ 9 ]</a>
		// <a href='list?pageNum=10'>[ 10 ]</a>

		if (end != totalPage) {
			sb.append("<a class='paging' href='" + listName + "?pageNum=" + (end + 1) + "'>");
			sb.append("＞");
			sb.append("</a>");
		}
		// <a href='list?pageNum=11'>[다음]</a>

		return sb.toString();
	}

}
