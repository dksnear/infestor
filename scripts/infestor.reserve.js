

// 一些不是很科学的保留方法

infestor.namespace('infestor.reserve',{

	// 判断元素是否出现滚动条
	isScroll : function (el) {

		var els = el ? [el] : [document.documentElement, document.body],
		isScrollX = false,
		isScrollY = false,
		i = 0,
		sl,
		st;

		for (; i < els.length; i++) {

			el = els[i];

			sl = el.scrollLeft;
			el.scrollLeft += (sl > 0) ? -1 : 1;
			el.scrollLeft !== sl && (isScrollX = isScrollX || true);
			el.scrollLeft = sl;

			st = el.scrollTop;
			el.scrollTop += (st > 0) ? -1 : 1;
			el.scrollTop !== st && (isScrollY = isScrollY || true);
			el.scrollTop = st;
		}

		return {

			x : isScrollX,
			y : isScrollY
		}
	}

});