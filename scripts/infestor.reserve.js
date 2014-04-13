

//  保留方法(一些不是很科学的方法)

infestor.namespace('infestor.reserve',{

	// 计算滚动条的宽度
	scrollWidth : function () {

		if (this.$scrollWidth)
			return this.$scrollWidth;

		var noScroll,
		scroll,
		oDiv = document.createElement("DIV");

		oDiv.style.cssText = 'position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;';
		noScroll = document.body.appendChild(oDiv).clientWidth;
		oDiv.style.overflowY = 'scroll';
		scroll = oDiv.clientWidth;
		document.body.removeChild(oDiv);

		this.$scrollWidth = noScroll - scroll;

		return this.$scrollWidth;
	},

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