/// <reference path="../infestor.js" />

infestor.define('infestor.tree.TreeNode', {


    /*
    
    events

    onClick: function (node) { },
    onIconClick: function (node) { },
    onCheckChange: function (node) { },
    onExpand: function (node) { },
    onCollapse: function (node) { }
    
    */

    extend: 'infestor.Object',

    cssUses: 'infestor.tree',

    nodeBtnCls: 'button',
    nodeSwCls: 'switch',
    nodeCheckboxCls: 'chk',

    nodeIconRootOpenCls: 'root-open',
    nodeIconRootCloseCls: 'root-close',
    nodeIconRootsOpenCls: 'roots-open',
    nodeIconRootsCloseCls: 'roots-close',
    nodeIconCenterOpenCls: 'center-open',
    nodeIconCenterCloseCls: 'center-close',
    nodeIconBottomOpenCls: 'bottom-open',
    nodeIconBottomCloseCls: 'bottom-close',
    nodeIconRootDocuCls: 'root-docu',
    nodeIconRootsDocuCls: 'roots-docu',
    nodeIconCenterDocuCls: 'center-docu',
    nodeIconBottomDocuCls: 'bottom-docu',

    textIconOpenCls: 'ico-open',
    textIconCloseCls: 'ico-close',
    textIconDocuCls: 'ico-docu',
    textIconWaitCls: 'ico-loading',

    lineConnectCls: 'line',
    nodeActiveCls: 'activeNode',

    checkboxTrueFullCls: 'checkbox-true-full',
    checkboxTruePartCls: 'checkbox-true-part',
    checkboxFalseFullCls: 'checkbox-false-full',
    checkBoxFalsePartCls: 'checkbox-false-part',
    checkBoxTrueDisableCls: 'checkbox-true-disable',
    checkBoxFalseDisableCls: 'checkbox-false-disable',

    //节点id
    id: '',
    //节点父id
    pId: '',
    //节点子节点配置映射
    childrenMap: null,
    //节点显示名称
    text: '新节点',
    //节点深度
    level: 0,
    //节点当前开关样式(类)
    currentSwitchCls: '',
    //节点当前图标样式(类)
    currentIconCls: '',
    //节点当前选择框样式(类)
    currentCheckCls: '',
    //节点展开
    isExpand: false,
    //节点收起
    isCollapse: true,
    //节点带选择框
    isCheckBoxNode: false,
    //节点带级联选择
    isCascade: false,
    //节点被完全选中
    isChecked: false,
    //节点半选
    isHalfChecked: false,
    //节点没有选择
    isUnChecked: true,
    //节点非半选
    isHalfUnchecked: false,
    //叶节点
    isLeaf: false,
    //根节点
    isRoot: false,
    //分支节点
    isBranch: false,
    //父节点的最后一个子节点
    isLast: false,
    //父节点的非最后一个子节点
    isNormal: false,
    //节点激活状态
    isFocus: false,
    //节点正常状态
    isBlur: false,
    //节点选择框禁用
    isCheckboxDisabled: false,
    //子节点数目
    childrenCount: 0,
    //被选中的子节点数目
    checkedChildrenCount: 0,
    //半选的子节点数目
    halfCheckedChildrenCount: 0,
    //子节点映射(key:节点id,value:节点对象)
    childrenNodesMap: null,
    //父节点对象
    parentNode: null,
    //最后一个子节点对象
    lastChildNode: null,
    //节点的上一个节点对象
    previousNode: null,
    //节点的下一个节点对象
    nextNode: null,
    //节点的选择框组件(infestor.Dom对象)
    checkBox: undefined,
    //节点的外框组件(infestor.Dom对象)
    container: undefined,
    //节点的开关组件(infestor.Dom对象)
    switcher: undefined,
    //节点的名称显示容器(infestor.Dom对象)
    textContainer: undefined,
    //节点的图标组件(infestor.Dom对象)
    textIcon: undefined,
    //节点的文本显示组件
    textField: undefined,
    //节点的子节点容器(infestor.Dom对象)
    childrenContainer: undefined,

    //静态属性
    statics: {

        //全局id
        gid: 1,
        //全局id前缀
        gidPrefix: infestor.randomCode(6)
    },

    init: function () {

        var me = this;

        this.id = this.id || this.genId();
        this.pId = this.pId || '_' + this.genId();
        this.container = infestor.Dom.create('li');
        this.switcher = infestor.Dom.create('span').addClass(this.nodeBtnCls).addClass(this.nodeSwCls).appendTo(this.container).click(function () {

            if (me.isExpand) {

                me.emit('onCollapse');
                me.collapse();
                return;
            }

            if (me.isCollapse) {

                me.emit('onExpand');
                me.expand();
            }

        });

        this.element = this.container;

        if (this.isCheckBoxNode) {

            this.checkBox = infestor.Dom.create('span').addClass(this.nodeBtnCls).addClass(this.nodeCheckboxCls).appendTo(this.container).click(function () {


                if (me.isChecked || me.isHalfUnchecked) {
                    me.uncheck();
                    me.emit('onCheckChange');
                    return;
                }

                if (me.isUnChecked || me.isHalfChecked) {
                    me.check();
                    me.emit('onCheckChange');
                    return;
                }

            });

            if (this.isChecked) this.setCheckedMode();
            if (this.isUnChecked) this.setUnCheckedMode();
            if (this.isHalfChecked) this.setHalfCheckedMode();
            if (this.isHalfUnchecked) this.setHalfUncheckedMode();

        }

        this.textContainer = infestor.Dom.create('a').appendTo(this.container);

        this.textIcon = infestor.Dom.create('span').addClass(this.nodeBtnCls).appendTo(this.textContainer).click(function () { me.emit('onIconClick'); });

        this.textField = infestor.Dom.create('span').text(this.text).appendTo(this.textContainer).click(function () { me.emit('onClick'); });

        if (this.isRoot)
            this.setRootExpandMode();

        if (this.isLeaf)
            this.setLeafLastMode();

        if (this.isBranch)
            this.setBranchLastExpandMode();

    },

    searchChildrenNodes: function (action) {

        var subNodes = [],
            iterator = function (node) {

                if (!node.childrenNodesMap) return;

                infestor.each(node.childrenNodesMap, function () {

                    if (!this) return true;
                    if (action) action(this);
                    subNodes.push(this);
                    iterator(this);

                });
            };

        iterator(this);

        return subNodes;
    },

    searchParentNodes: function (action) {

        var parentNodes = [],
            iterator = function (node) {

                if (!node.parentNode) return;

                if (action) action(node.parentNode);

                parentNodes.push(node.parentNode);
                iterator(node.parentNode);
            };

        iterator(this);

        return parentNodes;
    },

    addChildNode: function (node, collapse) {


        if (!this.childrenNodesMap) this.childrenNodesMap = {};

        if (!this.childrenMap) this.childrenMap = {};

        if (!(node instanceof this.$ownerCls))
            node = infestor.create(this.$ownerCls, node);

        this.childrenNodesMap[node.id] = node;

        this.childrenMap[node.id] = node.opts;

        if (!this.childrenContainer)
            this.childrenContainer = infestor.Dom.create('ul').appendTo(this.container);

        if (this.lastChildNode && this.lastChildNode.isLeaf)
            this.lastChildNode.setLeafNormalMode();

        if (this.lastChildNode && this.lastChildNode.isBranch && this.lastChildNode.isExpand)
            this.lastChildNode.setBranchNormalExpandMode();

        if (this.lastChildNode && this.lastChildNode.isBranch && this.lastChildNode.isCollapse)
            this.lastChildNode.setBranchNormalCollapseMode();

        if (this.isLeaf && this.isNormal && collapse)
            this.setBranchNormalCollapseMode();

        if (this.isLeaf && this.isLast && collapse)
            this.setBranchLastCollapseMode();

        if (this.isLeaf && this.isNormal && !collapse)
            this.setBranchNormalExpandMode();

        if (this.isLeaf && this.isLast && !collapse)
            this.setBranchLastExpandMode();

        node.container.appendTo(this.childrenContainer);
        node.parentNode = this;
        node.previousNode = this.lastChildNode;
        node.level = this.level + 1;

        if (this.lastChildNode)
            this.lastChildNode.nextNode = node;

        this.lastChildNode = node;

        this.childrenCount++;
    },

    removeChildNode: function (node) {

        if (!this.childrenNodesMap || !this.childrenMap) return;
        if (!node) node = this.lastChildNode;
        if (!node) return;

        if (node.previousNode) node.previousNode.nextNode = node.nextNode;
        if (node.nextNode) node.nextNode.previousNode = node.previousNode;

        if (node.isLast && node.previousNode) {

            if (node.previousNode.isLeaf)
                node.previousNode.setLeafLastMode();
            if (node.previousNode.isBranch && node.previousNode.isExpand)
                node.previousNode.setBranchLastExpandMode();
            if (node.previousNode.isBranch && node.previousNode.isCollapse)
                node.previousNode.setBranchLastCollapseMode();
            if (node.parentNode)
                node.parentNode.lastChildNode = node.previousNode;
        }

        node.element.remove();

        this.childrenCount--;

        if (this.isChecked)
            this.checkedChildrenCount--;
        if (this.isHalfChecked)
            this.halfCheckedChildrenCount--;

        if (this.childrenCount === 0) {

            this.childrenNodesMap = null;
            this.childrenMap = null;
            this.childrenContainer.remove();
            this.childrenContainer = null;

            if (this.isLast)
                this.setLeafLastMode();
            if (this.isNormal)
                this.setLeafNormalMode();
        }
    },

    remove: function () {

        if (this.isRoot) return;
        this.parentNode.removeChildNode(this);
    },

    check: function () {


        if (!this.isCheckBoxNode || this.isCheckboxDisabled) return;

        if (this.isUnChecked) this.setCheckedMode();

        if (this.isCascade) {

            if (this.isHalfChecked) this.setCheckedMode();

            this.searchChildrenNodes(function (node) {

                node.setCheckedMode();

                node.emit('onCheckChange');

            });

            this.searchParentNodes(function (node) {

                if (node.checkedChildrenCount == node.childrenCount && node.childrenCount != 0)
                    node.setCheckedMode();
                else node.setHalfCheckedMode();

                node.emit('onCheckChange');
            });
        }

    },

    uncheck: function () {

        if (!this.isCheckBoxNode || this.isCheckboxDisabled) return;
        if (this.isChecked) this.setUnCheckedMode();

        if (this.isCascade) {

            this.searchChildrenNodes(function (node) {

                node.setUnCheckedMode();
                node.emit('onCheckChange');
            });

            this.searchParentNodes(function (node) {

                if (node.checkedChildrenCount == 0 && node.halfCheckedChildrenCount == 0)
                    node.setUnCheckedMode();
                else node.setHalfCheckedMode();

                node.emit('onCheckChange');
            });
        }
    },

    expand: function (level, action) {

        if (this.isExpand) return;

        if (this.isBranch && this.isNormal && this.isCollapse)
            this.setBranchNormalExpandMode();

        if (this.isBranch && this.isLast && this.isCollapse)
            this.setBranchLastExpandMode();

        if (this.isRoot && this.isCollapse)
            this.setRootExpandMode();

        if (action)
            action.call(this, this);

        var level = Number(level);

        if (isNaN(level) || level === 0 || this.isLeaf || this.childrenCount === 0) return;

        level--;

        infestor.each(this.childrenNodesMap, function () {

            if (!this) return;
            this.expand(level, action);

        });

    },

    collapse: function (level, action) {

        if (this.isCollapse) return;

        if (this.isBranch && this.isNormal && this.isExpand)
            this.setBranchNormalCollapseMode();

        if (this.isBranch && this.isLast && this.isExpand)
            this.setBranchLastCollapseMode();

        if (this.isRoot && this.isExpand)
            this.setRootCollapseMode();

        if (action) action.call(this, this);

        var level = Number(level);

        if (isNaN(level) || level === 0 || this.isLeaf || this.childrenCount === 0) return;

        level--;

        infestor.each(this.childrenNodesMap, function () {

            if (!this) return;
            this.collapse(level, action);

        });
    },

    focus: function () {

        this.textField.addClass(this.nodeActiveCls);
        this.isFocus = true;
        this.isBlur = false;
    },

    blur: function () {

        this.textField.removeClass(this.nodeActiveCls);
        this.isFocus = false;
        this.isBlur = true;
    },

    disableCheckbox: function () {

        if (!this.checkBox) return;

        this.setCheckboxDisabledMode();
    },

    enableCheckbox: function () {

        if (!this.checkBox) return;

        this.setCheckboxEnabledMode();
    },

    setLeafLastMode: function () {


        this.changeSwitchCls(this.nodeIconBottomDocuCls);
        this.changeIconCls(this.textIconDocuCls);

        this.isBranch = false;
        // this.isRoot = false;
        this.isLeaf = true;
        this.isLast = true;
        this.isNormal = false;
        this.isExpand = false;
        this.isCollapse = false;

    },

    setLeafNormalMode: function () {

        this.changeSwitchCls(this.nodeIconCenterDocuCls);
        this.changeIconCls(this.textIconDocuCls);

        this.isBranch = false;
        // this.isRoot = false;
        this.isLeaf = true;
        this.isLast = false;
        this.isNormal = true;
        this.isExpand = false;
        this.isCollapse = false;

    },

    setBranchLastExpandMode: function () {

        this.changeSwitchCls(this.nodeIconBottomOpenCls);
        this.changeIconCls(this.textIconOpenCls);
        this.setLineConnectCls(false);

        this.isBranch = true;
        //  this.isRoot = false;
        this.isLeaf = false;
        this.isLast = true;
        this.isNormal = false;
        this.isExpand = true;
        this.isCollapse = false;

        if (this.childrenContainer) this.childrenContainer.show();

    },

    setBranchLastCollapseMode: function () {

        this.changeSwitchCls(this.nodeIconBottomCloseCls);
        this.changeIconCls(this.textIconCloseCls);
        this.setLineConnectCls(false);

        this.isBranch = true;
        // this.isRoot = false;
        this.isLeaf = false;
        this.isLast = true;
        this.isNormal = false;
        this.isExpand = false;
        this.isCollapse = true;

        if (this.childrenContainer) this.childrenContainer.hide();

    },

    setBranchNormalExpandMode: function () {

        this.changeSwitchCls(this.nodeIconCenterOpenCls);
        this.changeIconCls(this.textIconOpenCls);
        this.setLineConnectCls(true);

        this.isBranch = true;
        // this.isRoot = false;
        this.isLeaf = false;
        this.isLast = false;
        this.isNormal = true;
        this.isExpand = true;
        this.isCollapse = false;

        if (this.childrenContainer) this.childrenContainer.show();

    },

    setBranchNormalCollapseMode: function () {

        this.changeSwitchCls(this.nodeIconCenterCloseCls);
        this.changeIconCls(this.textIconCloseCls);
        this.setLineConnectCls(true);

        this.isBranch = true;
        // this.isRoot = false;
        this.isLeaf = false;
        this.isLast = false;
        this.isNormal = true;
        this.isExpand = false;
        this.isCollapse = true;

        if (this.childrenContainer) this.childrenContainer.hide();

    },

    setRootExpandMode: function () {

        this.changeSwitchCls(this.nodeIconRootOpenCls);
        this.changeIconCls(this.textIconOpenCls);

        this.isBranch = false;
        this.isRoot = true;
        this.isLeaf = false;
        this.isLast = true;
        this.isNormal = false;
        this.isExpand = true;
        this.isCollapse = false;

        if (this.childrenContainer) this.childrenContainer.show();
    },

    setRootCollapseMode: function () {

        this.changeSwitchCls(this.nodeIconRootCloseCls);
        this.changeIconCls(this.textIconCloseCls);

        this.isBranch = false;
        this.isRoot = true;
        this.isLeaf = false;
        this.isLast = true;
        this.isNormal = false;
        this.isExpand = false;
        this.isCollapse = true;

        if (this.childrenContainer) this.childrenContainer.hide();
    },

    setCheckedMode: function () {

        if (this.isChecked) return;

        if (this.parentNode)
            this.parentNode.checkedChildrenCount++;

        if (this.parentNode && this.isHalfChecked)
            this.parentNode.halfCheckedChildrenCount--;

        this.changeCheckCls(this.checkboxTrueFullCls);
        this.isChecked = true;
        this.isHalfChecked = false;

        this.isUnChecked = false;
        this.isHalfUnchecked = false;


    },

    setHalfCheckedMode: function () {

        if (this.isHalfChecked) return;

        if (this.parentNode) this.parentNode.halfCheckedChildrenCount++;
        if (this.parentNode && this.isChecked) this.parentNode.checkedChildrenCount--;

        this.changeCheckCls(this.checkboxTruePartCls);
        this.isChecked = false;
        this.isHalfChecked = true;

        this.isUnChecked = false;
        this.isHalfUnchecked = false;
    },

    setUnCheckedMode: function () {

        if (this.isUnChecked) return;

        if (this.parentNode && this.isChecked) this.parentNode.checkedChildrenCount--;
        if (this.parentNode && this.isHalfChecked) this.parentNode.halfCheckedChildrenCount--;

        this.changeCheckCls(this.checkboxFalseFullCls);
        this.isChecked = false;
        this.isHalfChecked = false;

        this.isUnChecked = true;
        this.isHalfUnchecked = false;

    },

    setHalfUncheckedMode: function () {

        if (this.isHalfUnchecked) return;

        this.changeCheckCls(this.checkBoxFalsePartCls);

        this.isChecked = false;
        this.isHalfChecked = false;

        this.isUnChecked = false;
        this.isHalfUnchecked = true;

    },

    setCheckboxDisabledMode: function () {

        if (this.isCheckboxDisabled) return;

        (this.isChecked || this.isHalfChecked || this.isHalfUnchecked) && this.changeCheckCls(this.checkBoxTrueDisableCls);
        this.isUnChecked && this.changeCheckCls(this.checkBoxFalseDisableCls);

        this.isCheckboxDisabled = true;
    },

    setCheckboxEnabledMode: function () {

        if (!this.isCheckboxDisabled) return;

        this.isChecked && this.changeCheckCls(this.checkboxTrueFullCls);
        this.isHalfChecked && this.changeCheckCls(this.checkboxTruePartCls);
        this.isHalfUnchecked && this.changeCheckCls(this.checkBoxFalsePartCls);
        this.isUnChecked && this.changeCheckCls(this.checkboxFalseFullCls);

        this.isCheckboxDisabled = false;

    },

    setLineConnectCls: function (show) {

        if (this.childrenContainer && show)
            this.childrenContainer.addClass(this.lineConnectCls);

        if (this.childrenContainer && !show)
            this.childrenContainer.removeClass(this.lineConnectCls);
    },

    changeSwitchCls: function (cls) {

        if (this.currentSwitchCls)
            this.switcher.removeClass(this.currentSwitchCls);

        this.currentSwitchCls = cls;
        this.switcher.addClass(this.currentSwitchCls);

    },

    changeIconCls: function (cls) {

        if (this.currentIconCls)
            this.textIcon.removeClass(this.currentIconCls);

        this.currentIconCls = cls;
        this.textIcon.addClass(this.currentIconCls);

    },

    changeCheckCls: function (cls) {

        if (!this.isCheckBoxNode) return;

        if (this.currentCheckCls)
            this.checkBox.removeClass(this.currentCheckCls);

        this.currentCheckCls = cls;
        this.checkBox.addClass(this.currentCheckCls);
    },

    //unsafed method
    setProperties: function (properties) {

        infestor.append(this, properties);

        if (properties.text)
            this.textField.text(properties.text);
    },

    //unsafed method
    hide: function () {

        this.textContainer.hide();
        this.switcher.hide();
        if (this.checkBox) this.checkBox.hide();
    },

    genId: function () {

        return this.$ownerCls.gidPrefix + this.$ownerCls.gid++;

    }

});