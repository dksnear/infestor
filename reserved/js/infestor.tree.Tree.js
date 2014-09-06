/// <reference path="../infestor.js" />
/// <reference path="infestor.tree.TreeNode.js" />


infestor.define('infestor.tree.Tree', {


    /*
        //events
        onNodeClick: function (node, tree) { },
        onNodeIconClick: function (node, tree) { },
        onNodeExpand: function (node, tree) { },
        onNodeCollapse: function (node, tree) { },
        onCheckChange: function (node, tree) { },
        onLoad: function (tree) { }
    */

    extend: 'infestor.Object',

    uses: 'infestor.tree.TreeNode',

    cssUses: 'infestor.tree',

    treeCls: 'infestor-tree-Tree',
    //显示选择框
    checkbox: false,
    //选择框级联选择
    cascadeCheck: false,
    //选择框多选
    mutiSelect: true,
    //选择框当前选择的节点(mutiSelect:false)
    currentCheckedNode: null,
    //当前选择的节点
    currentSelectedNode: null,
    //数据配置 默认值{ rootPId: "0", idName: "id", pIdName: "pid", textName: "text" },
    dataConfig: undefined,
    //自动加载
    autoLoad: true,
    //异步呈现
    async: false,
    //远程加载
    remote: false,
    //原创加载附加参数
    params: null,
    //标识被选中的节点
    activeSelect: true,
    //远程加载地址
    url: '',
    //显示根节点
    rootVisible: false,
    //节点池
    nodesPool: null,
    //根节点对象
    rootNode: null,
    //当前数据
    data: [],
    //原始数据
    rawData: null,
    //允许搜索
    searchable: true,

    //methods
    init: function () {

        var me = this;

        me.element = me.element || infestor.Dom.create('div');
        me.element.addClass(me.treeCls);

        this.dataConfig = infestor.append({

            rootPId: '0',
            idName: 'id',
            pIdName: 'pId',
            textName: 'text',
            isLeafName: 'isLeaf'

        }, this.dataConfig);

        if (me.autoLoad && !me.async) me.load();
        if (me.autoLoad && me.async) me.asyncLoad();

    },

    load: function (opts) {

        this.clear();

        this.rawData = infestor.append(true, [], this.data);

        if (this.async) {

            if (this.remote) this.data = [];

            if (!this.remote) this.data = this.mapData(this.data);

            this.asyncLoad(opts);

            this.emit('onLoad');

            return;
        }

        var me = this,
            opts = opts || {},
            innerLoad = function () {

                if (!infestor.isArray(me.data)) me.data = [me.data];

                var data = me.data;

                me.data = me.mapData(me.data);
                data = infestor.append(true, [], data);
                data = me.formatData(data, true);


                me.rootNode = me.createTree(data);

                if (!me.rootVisible) me.rootNode.hide();

                this.emit('onLoad');
            };

        if (!me.remote) {

            innerLoad();
            return;
        }

        //remoteLoad

        infestor.request.get(url, opts.params || me.params, function (data) {

            me.data = data.data.rows;
            innerLoad();
        });

    },

    reload: function (opts) {

        if (this.async) {

            this.clear();
            this.asyncLoad(opts);
        }

        if (!this.async)
            this.load(opts);
    },

    asyncLoad: function (opts) {

        var me = this,
             params = (opts && opts.params) || me.params || {},
             rootPId = me.dataConfig.rootPId,
             pIdName = me.dataConfig.pIdName,
             pId = (opts && opts.pNode && opts.pNode.id) || rootPId,
             pNode = opts && opts.pNode,
             level = (opts && opts.level) === undefined ? 2 : opts.level,
             innerLoad = function (data) {

                 pNode = pNode || me.rootNode;

                 if (!data) return;
                 if (level == 0) return;


                 if (pNode.isLoaded) {

                     if (pNode.childrenCount == 0) return;

                     infestor.each(pNode.childrenNodesMap, function () {

                         if (!this) return;

                         me.asyncLoad({

                             level: level - 1,
                             pNode: this

                         });

                     });

                     return;
                 };

                 infestor.each(data, function (idx, item) {

                     var node;

                     item = infestor.append(true, {}, item);
                     if (me.remote) me.data.push(item);
                     node = me.createNode(item);
                     pNode.addChildNode(node);

                     if (level == 1)
                         pNode.collapse();

                     me.asyncLoad({

                         level: level - 1,
                         pNode: node
                     });
                 });

                 //me.onLoad.call(me, me);
             };

        if (!me.rootNode) {
            me.rootNode = me.createTree([]);
            if (!me.rootVisible) me.rootNode.hide();
        }

        if (!me.remote)
            innerLoad(jQuery.grep(me.data, function (el, idx) {

                if (me.removeMap && me.removeMap[el.id])
                    return false;

                return el[pIdName] === pId;
            }));

        if (me.remote) {

            params[pIdName] = pId;


            infestor.request.post(me.url, params, function (data) {

                if (!data.data) return;
                innerLoad(me.mapData(data.data));
            });
        }
    },

    createTree: function (data, expand) {

        var me = this,
            rootNode = this.createNode({ isRoot: true, text: 'root' }),
            iterator = function (arr, parent) {

                infestor.each(arr, function (idx, opts) {

                    if (!opts.hasOwnProperty('isExpand'))
                        opts.isExpand = false;

                    var node = me.createNode(opts);

                    parent.addChildNode(node, !expand);

                    if (!opts.children) return;

                    iterator(opts.children, node);

                })
            };

        rootNode.element.appendTo(this.element);

        iterator(data, rootNode);

        //选中配置选项中标识为选择的节点
        infestor.each(this.nodesPool, function () {

            me.checkbox && this && this.opts && this.isLeaf && this.opts.isChecked && this.check();
        });

        return rootNode;
    },

    createNode: function (opts) {

        var me = this,
            node = infestor.create('infestor.tree.TreeNode', {

                id: opts.id,
                pId: opts.pId,
                text: opts.text,
                isLeaf: true,
                isRoot: opts.isRoot,
                isCollapse: !opts.isExpand,
                isExpand: opts.isExpand,
                opts: opts,
                isCheckBoxNode: this.checkbox,
                isCascade: this.cascadeCheck,

                events: {

                    onClick: function (node) {

                        me.emit('onNodeClick', [node, me]);

                        me.selectNode(node);

                    },
                    onIconClick: function (node) {

                        me.emit('onNodeIconClick', [node, me]);

                    },
                    onCheckChange: function (node) {

                        me.emit('onCheckChange', [node, me]);

                        if (me.async && me.cascadeCheck && me.mutiSelect) {

                            me.collapseNode(node);
                            me.expandNode(node, -1);
                        }

                        if (!me.mutiSelect) {

                            if (me.currentCheckedNode)
                                me.currentCheckedNode.uncheck();

                            me.currentCheckedNode = node;
                        }

                    },
                    onExpand: function (node) {

                        me.emit('onNodeExpand', [node, me]);

                        if (me.async && !node.isLoaded) {
                            node.isLoaded = true;
                            me.asyncLoad({ pNode: node });
                        }
                    },
                    onCollapse: function (node) {

                        me.emit('onNodeCollapse', [node, me]);

                        if (me.async) node.isLoaded = true;
                    }
                }

            });

        if (!this.nodesPool) this.nodesPool = {};

        this.nodesPool[node.id] = node;

        return node;

    },

    expandNode: function (node, level) {

        node.expand(level || 0, function () { this.emit('onExpand'); });
    },

    collapseNode: function (node, level) {

        node.collapse(level || 0, function () { this.emit('onCollapse') });
    },

    expandRootNode: function (level) {

        this.collapseNode(this.rootNode);
        this.expandNode(this.rootNode, level || 0);
    },

    addSubNode: function (data, node, map) {

        if (!node) node = this.currentSelectedNode;
        if (!node) return;

        if (map === true)
            data = this.mapData(data);

        var newNode = this.createNode(data);

        node.addChildNode(newNode);

        this.selectNode(newNode);

        this.expandNode(node);

        data.id = newNode.id;

        this.data.push(data);

        if (this.removeMap && this.removeMap[newNode.id])
            this.removeMap[newNode.id] = false;

        return newNode;
    },

    addSiblingNode: function (data, node, map) {

        if (!node) node = this.currentSelectedNode;
        if (!node) return;
        if (node.isRoot) return;

        if (map === true)
            data = this.mapData(data);

        var newNode = this.createNode(data);

        node.parentNode.addChildNode(newNode);

        this.selectNode(newNode);

        data.id = newNode.id;

        this.data.push(data);

        if (this.removeMap && this.removeMap[newNode.id])
            this.removeMap[newNode.id] = false;

        return newNode;
    },

    removeNode: function (node) {

        var me = this;

        if (!node) node = this.currentSelectedNode;
        if (!node) return;
        if (node.isRoot) return;

        node.remove();

        if (!this.removeMap) this.removeMap = {};

        this.removeMap[node.id] = true;

        node.searchChildrenNodes(function (n) { me.removeMap[n.id] = true; })


    },

    updateNode: function (data, node) {

        data = this.mapData(data);

        node.setProperties({

            id: data.id || node.id,
            text: data.text || node.text,
            pId: data.pId || node.pId,
            opts: infestor.append(true, node.opts, data)

        });

    },

    selectNode: function (node) {

        if (!node) return;

        if (this.currentSelectedNode && this.activeSelect)
            this.currentSelectedNode.blur();

        this.currentSelectedNode = node;

        if (this.activeSelect)
            this.currentSelectedNode.focus();

    },

    setSelections: function (idArray) {

        var idName = this.dataConfig.idName;

        this.nodesPool && infestor.each(this.nodesPool, function () {

            !idArray && this.check();
            idArray && (infestor.inArray(this.opts[idName], idArray) != -1) && this.check();
        });
    },

    getSelections: function (prediacate) {

        if (!this.nodesPool) return;

        var selections = [];

        infestor.each(this.nodesPool, function () {

            if (!this) return true;

            if (this.isChecked && !prediacate)
                selections.push(this);

            if (this.isChecked && prediacate && prediacate(this))
                selections.push(this);

        });

        return selections;

    },

    getAllNodes: function () {

        return this.nodesPool;
    },


    disableSelections: function () {

        this.nodesPool && infestor.each(this.nodesPool, function () { this && this.disableCheckbox(); });
    },

    enableSelections: function () {

        this.nodesPool && infestor.each(this.nodesPool, function () { this && this.enableCheckbox(); });
    },

    getRawData: function (node) {

        return node.opts && node.opts.rawData;
    },

    filterData: function (dataArr, text, predicate) {

        var me = this,
            uniqueMap = {},
            result = [],
            searchParent = function (data) {

                infestor.each(dataArr, function () {

                    if (uniqueMap[this.id])
                        return;

                    if (data.pId == this.id) {

                        uniqueMap[this.id] = true;
                        result.push(this);
                        searchParent(this);

                        if (this.pId == me.dataConfig.rootPId)
                            return;
                    }

                });

            };

        if (!predicate)
            predicate = function (d, t) {

                return new RegExp('.*' + t + '.*', 'i').test(d.text);
            };

        infestor.each(dataArr, function () {

            if (uniqueMap[this.id]) return true;
            if (me.removeMap && me.removeMap[this.id]) return true;
            if (!predicate(this, text)) return true;

            result.push(this);
            searchParent(this);
            uniqueMap[this.id] = true;
        });

        return result;

    },

    search: function (text, predicate) {

        if (!this.searchable) return false;

        var data;

        if (!text && text !== 0) {

            this.rootNode.element.show();

            if (this.searchRoot) {

                this.searchRoot.element.remove();
                this.searchRoot == null;
            }

            return false;
        }

        data = this.filterData(infestor.append(true, [], this.data), text, predicate);

        if (!data || data.length < 1)
            return false

        this.rootNode.element.hide();

        if (this.searchRoot) {

            this.searchRoot.element.remove();
            this.searchRoot == null;
        }

        this.searchRoot = this.createTree(this.formatData(data), true);

        if (!this.rootVisible)
            this.searchRoot.hide();

        this.searchRoot.element.appendTo(this.element);

        return true;

    },

    mapData: function (data) {

        var opts = this.dataConfig,
            idName = opts.idName,
            pIdName = opts.pIdName,
            textName = opts.textName,
            isLeafName = opts.isLeafName,
            innerMap = function (obj) {

                if (typeof obj != 'object') return;

                infestor.append(obj, {

                    id: obj[idName],
                    pId: obj[pIdName],
                    text: obj[textName],
                    isLeaf: obj[isLeafName],
                    rawData: infestor.append({}, obj),
                    children: []

                });
            };

        if (infestor.isArray(data))
            infestor.each(data, function () { innerMap(this); });
        else innerMap(data);

        return data;

    },

    formatData: function (data, maped) {

        if (!infestor.isArray(data)) return [];

        var me = this,
            result = [],
            opts = this.dataConfig,
            pIdName = opts.pIdName,
            rootPId = opts.rootPId,
            idName = opts.idName,
            innerFilter = function (fn) { return infestor.removeArrayItem(data, fn); },
            innerCreateNode = function (node) {

                if (maped) return node;
                return me.mapData(node, opts);
            },
            innerCoverter = function (parentNode) {

                infestor.each(innerFilter(function (i, item) { return item[pIdName] === parentNode[idName]; }), function () {

                    var node = innerCreateNode(this);
                    parentNode.children.push(node);
                    innerCoverter(node);
                });

            };

        infestor.each(innerFilter(function (i, item) {
            return item[pIdName] === rootPId
        }), function () {

            var root = innerCreateNode(this);
            result.push(root);
            innerCoverter(root);
        });

        return result;

    },

    reverseFormatData: function (data) {


        var me = this,
            result = [],
            opts = this.dataConfig,
            idName = opts.idName,
            pIdName = opts.pIdName,
            rootPId = opts.rootPId,
            textName = opts.textName,
            iterator = function (pData) {

                infestor.each(pData, function () {

                    var obj = {};

                    obj[idName] = this[idName];
                    obj[pIdName] = this[pIdName];
                    obj[textName] = this[textName];
                    obj.rawData = this.rawData;

                    obj = infestor.append({}, this.rawData, obj);

                    result.push(obj);

                    if (!this.children || this.children.length < 1) return;

                    iterator(this.children);
                });

            };


        iterator(data);

        return result;
    },

    clear: function () {


        this.element.children().remove();
        this.nodesPool = null;
        this.rootNode = null;
    }

});

