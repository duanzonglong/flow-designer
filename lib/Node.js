'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Jacky.gao on 2016/6/28.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _Connection = require('./Connection.js');

var _Connection2 = _interopRequireDefault(_Connection);

var _SelectTool = require('./tools/SelectTool.js');

var _SelectTool2 = _interopRequireDefault(_SelectTool);

var _ConnectionTool = require('./tools/ConnectionTool.js');

var _ConnectionTool2 = _interopRequireDefault(_ConnectionTool);

var _MsgBox = require('./MsgBox.js');

var MsgBox = _interopRequireWildcard(_MsgBox);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = function () {
    function Node() {
        var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Node);

        this.fromConnections = [];
        this.toConnections = [];
    }

    _createClass(Node, [{
        key: '_initConfigs',
        value: function _initConfigs(config) {
            this.in = config.in;
            if (!this.in && this.in !== 0) {
                this.in = -1; //-1 is unlimited
            }
            this.out = config.out;
            if (!this.out && this.out !== 0) {
                this.out = -1;
            }
            this.single = config.single; //Whether the current instance can have more then one
        }
    }, {
        key: 'getSvgIcon',
        value: function getSvgIcon() {
            throw 'Unsupport this method.';
        }
    }, {
        key: 'validate',
        value: function validate() {
            return null;
        }
    }, {
        key: 'initFromJson',
        value: function initFromJson(json) {
            var x = json.x,
                y = json.y,
                name = json.name,
                connections = json.connections;

            var width = json.width || json.w,
                height = json.height || json.h;
            x = parseInt(x), y = parseInt(y), width = parseInt(width), height = parseInt(height);
            this.changeSize(width, height);
            this.move(x, y, width, height);
            this.name = name;
            this.text.attr('text', name);
            if (json.uuid) {
                this.uuid = json.uuid;
            }
            this.connections = json.connections;
            this.fromConnectionsJson = json.fromConnections;
            this.toConnectionsJson = json.toConnections;
        }
    }, {
        key: '_buildConnections',
        value: function _buildConnections() {
            if (this.fromConnectionsJson) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.fromConnectionsJson[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var json = _step.value;

                        var toNodeUUID = json.toUUID,
                            fromNodeUUID = json.fromUUID;
                        var toNode = this.context.getNodeByUUID(toNodeUUID),
                            fromNode = this.context.getNodeByUUID(fromNodeUUID);
                        var newConnection = new _Connection2.default(fromNode, { endX: 0, endY: 0 });
                        newConnection.fromJSON(json);
                        newConnection.endPath(toNode);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
            if (this.toConnectionsJson) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.toConnectionsJson[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _json = _step2.value;

                        var _toNodeUUID = _json.toUUID,
                            _fromNodeUUID = _json.fromUUID;
                        var _toNode = this.context.getNodeByUUID(_toNodeUUID),
                            _fromNode = this.context.getNodeByUUID(_fromNodeUUID);
                        var _newConnection = new _Connection2.default(_fromNode, { endX: 0, endY: 0 });
                        _newConnection.fromJSON(_json);
                        _newConnection.endPath(_toNode);
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }
            }
            if (this.connections) {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = this.connections[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var _json2 = _step3.value;

                        var _fromNode2 = this,
                            to = _json2.to,
                            _toNode2 = null;
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            for (var _iterator4 = this.context.allFigures[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var figure = _step4.value;

                                if (figure instanceof _Connection2.default) {
                                    continue;
                                }
                                if (figure.name === to) {
                                    _toNode2 = figure;
                                    break;
                                }
                            }
                        } catch (err) {
                            _didIteratorError4 = true;
                            _iteratorError4 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }
                            } finally {
                                if (_didIteratorError4) {
                                    throw _iteratorError4;
                                }
                            }
                        }

                        if (!_toNode2) {
                            MsgBox.alert('\u8FDE\u7EBF\u7684\u76EE\u6807\u8282\u70B9' + to + '\u4E0D\u5B58\u5728<br>Node ' + to + ' not exist');
                            return;
                        }
                        var _newConnection2 = new _Connection2.default(_fromNode2, { endX: 0, endY: 0 });
                        _newConnection2.endPath(_toNode2);
                        _newConnection2.fromJSON(_json2);
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }
            }
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return this.nodeToJSON();
        }
    }, {
        key: 'nodeToJSON',
        value: function nodeToJSON() {
            var json = {
                x: this.rect.attr('x'),
                y: this.rect.attr('y'),
                w: this.rect.attr('width'),
                h: this.rect.attr('height'),
                name: this.name,
                uuid: this.uuid
            };
            var fromConnections = [],
                toConnections = [];
            this.fromConnections.forEach(function (conn, index) {
                fromConnections.push(conn.toJSON());
            });
            this.toConnections.forEach(function (conn, index) {
                toConnections.push(conn.toJSON());
            });
            json.fromConnections = fromConnections;
            json.toConnections = toConnections;
            return json;
        }
    }, {
        key: '_createFigure',
        value: function _createFigure(context, pos, name) {
            if (this.single) {
                var exist = false;
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = context.allFigures[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var figure = _step5.value;

                        if (figure instanceof this.constructor) {
                            exist = true;
                            break;
                        }
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }

                if (exist) {
                    MsgBox.alert('当前节点只允许创建一个<br>Current Node only create one.');
                    return false;
                }
            }
            this.uuid = context.nextUUID();
            this.context = context;
            this.paper = context.paper;
            var w = 40,
                h = 70;
            pos = { x: pos.x - w / 2, y: pos.y - h / 2 + 15 };
            this.rect = this.paper.rect(pos.x, pos.y, w, h);
            this.rect.attr({ 'fill': '#fff', 'stroke': '#fff', 'stroke-dasharray': '--' });
            this.context.allFigures.push(this);
            this.svgIconPath = this.getSvgIcon();
            this.icon = this.paper.image(this.svgIconPath, pos.x, pos.y, 40, 40);
            this.name = name;
            var textX = pos.x + w / 2,
                textY = pos.y + h - 16;
            this.text = this.paper.text(textX, textY, this.name);
            this.text.attr({ 'font-size': '16pt' });
            this.text.mousedown(function (e) {
                e.preventDefault();
            });
            this._initFigure();
            return true;
        }
    }, {
        key: 'moveTo',
        value: function moveTo(centerX, centerY) {
            var w = this.rect.attr('width'),
                h = this.rect.attr('height');
            var x = void 0,
                y = void 0;
            if (centerX === -1) {
                x = this.rect.attr('x');
                y = centerY - h / 2;
            }
            if (centerY === -1) {
                y = this.rect.attr('y');
                x = centerX - w / 2;
            }
            this.move(x, y, w, h);
        }
    }, {
        key: 'move',
        value: function move(x, y, w, h) {
            this.rect.attr({ x: x, y: y });
            var textX = x + w / 2,
                textY = y + h - 16;
            this.text.attr({ x: textX, y: textY });
            var iconX = x - w / 2,
                iconY = y - h / 2 + 20,
                iconW = this.icon.attr('width'),
                iconH = this.icon.attr('height');
            this.icon.attr({ x: iconX + iconW / 2, y: iconY + iconH / 2 });
            this._resetConnections();
            if (window._setDirty) {
                window._setDirty();
            }
        }
    }, {
        key: 'changeSize',
        value: function changeSize(w, h) {
            var x = this.rect.attr('x'),
                y = this.rect.attr('y');
            this.rect.attr({ width: w, height: h });
            var textX = x + w / 2,
                textY = y + h - 16;
            this.text.attr({ x: textX, y: textY });
            var iconW = w,
                iconH = h - 30;
            this.icon.attr({ width: iconW, height: iconH });
            this._resetConnections();
            if (window._setDirty) {
                window._setDirty();
            }
        }
    }, {
        key: '_initFigure',
        value: function _initFigure() {
            var context = this.context;
            var _this = this;
            var mouseOver = function mouseOver(e, mouseX, mouseY) {
                if (this.dragging === true) {
                    return;
                }
                var currentTool = context.currentTool;
                if (!currentTool) {
                    return;
                }
                if (currentTool instanceof _ConnectionTool2.default) {
                    this.attr('cursor', 'pointer');
                }
                if (!(currentTool instanceof _SelectTool2.default)) {
                    return;
                }
                var container = context.container;
                var relativeX = mouseX - container.offset().left - this.attr('x');
                var relativeY = mouseY - container.offset().top - this.attr('y');
                var shapeWidth = this.attr('width');
                var shapeHeight = this.attr('height');
                var resizeBorder = 5;
                // Change cursor
                if (relativeX < resizeBorder && relativeY < resizeBorder) {
                    this.attr('cursor', 'nw-resize');
                } else if (relativeX > shapeWidth - resizeBorder && relativeY < resizeBorder) {
                    this.attr('cursor', 'ne-resize');
                } else if (relativeX > shapeWidth - resizeBorder && relativeY > shapeHeight - resizeBorder) {
                    this.attr('cursor', 'se-resize');
                } else if (relativeX < resizeBorder && relativeY > shapeHeight - resizeBorder) {
                    this.attr('cursor', 'sw-resize');
                } else {
                    this.attr('cursor', 'move');
                }
            };

            var mouseDown = function mouseDown(e) {
                if (this.dragging) {
                    return;
                }
                var currentTool = context.currentTool;
                if (!currentTool) {
                    return;
                }
                if (!(currentTool instanceof _ConnectionTool2.default)) {
                    if (!(currentTool instanceof _SelectTool2.default)) {
                        context.currentTool = context.selectTool;
                        currentTool = context.currentTool;
                        context.flowDesigner.nodeToolbar.children('label').removeClass('active');
                    }
                }
                if (currentTool instanceof _SelectTool2.default) {
                    if (context.selectionFigures.length === 0) {
                        context.selectFigure(_this);
                    } else {
                        var contain = false;
                        var _iteratorNormalCompletion6 = true;
                        var _didIteratorError6 = false;
                        var _iteratorError6 = undefined;

                        try {
                            for (var _iterator6 = context.selectionFigures[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                                var figure = _step6.value;

                                if (figure === _this) {
                                    contain = true;
                                    break;
                                }
                            }
                        } catch (err) {
                            _didIteratorError6 = true;
                            _iteratorError6 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                                    _iterator6.return();
                                }
                            } finally {
                                if (_didIteratorError6) {
                                    throw _iteratorError6;
                                }
                            }
                        }

                        if (!contain) {
                            context.resetSelection();
                            context.selectFigure(_this);
                        }
                    }
                }

                if (!(currentTool instanceof _ConnectionTool2.default)) {
                    return;
                }
                var x = e.offsetX;
                var y = e.offsetY;
                var connection = context.currentConnection;
                if (connection) {
                    if (_this.in === 0) {
                        MsgBox.alert('\u5F53\u524D\u8282\u70B9\u4E0D\u5141\u8BB8\u6709\u8FDB\u5165\u7684\u8FDE\u7EBF.<br>Current node no incoming connections are allowed');
                        return;
                    }
                    if (_this.in !== -1 && _this.toConnections.length >= _this.in) {
                        MsgBox.alert('\u5F53\u524D\u8282\u70B9\u8FDB\u5165\u7684\u8FDE\u7EBF\u6700\u591A\u53EA\u80FD\u6709' + _this.in + '\u6761<br>Current node max incoming connections is ' + _this.in);
                        return;
                    }
                    connection.endX = x;
                    connection.endY = y;
                    if (connection.from !== _this) {
                        connection.endPath(_this);
                        context.currentConnection = null;
                        var fromUUID = connection.from.uuid,
                            toUUID = _this.uuid,
                            uuid = connection.uuid;
                        context.addRedoUndo({
                            redo: function redo() {
                                var from = context.getNodeByUUID(fromUUID),
                                    to = context.getNodeByUUID(toUUID);
                                connection = new _Connection2.default(from, { endX: from.rect.attr('x'), endY: from.rect.attr('y') });
                                connection.uuid = uuid;
                                connection.endPath(to);
                            },
                            undo: function undo() {
                                _this.context.removeFigureByUUID(uuid);
                            }
                        });
                    } else {
                        MsgBox.alert('连线的起始节点不能为同一节点<br>Connection start/end must be different.');
                    }
                } else {
                    if (_this.out === 0) {
                        MsgBox.alert('当前节点不允许有出去的连线<br>Current node has no outcoming connection');
                        return;
                    }
                    if (_this.out !== -1 && _this.fromConnections.length >= _this.out) {
                        MsgBox.alert('\u5F53\u524D\u8282\u70B9\u51FA\u53BB\u7684\u8FDE\u7EBF\u6700\u591A\u53EA\u80FD\u6709' + _this.out + '\u6761<br>Current node max outcoming connections is ' + _this.out);
                        return;
                    }
                    connection = new _Connection2.default(_this, { endX: x, endY: y });
                    context.currentConnection = connection;
                }
            };
            this.rect.mouseover(mouseOver);
            this.rect.mousedown(mouseDown);
            this.icon.mouseover(mouseOver);
            this.icon.mousedown(mouseDown);

            var dragStart = function dragStart() {
                var rect = _this.rect;
                var currentTool = context.currentTool;
                if (!currentTool || !(currentTool instanceof _SelectTool2.default)) {
                    return;
                }
                var contain = false;
                var selectionFigures = context.selectionFigures;
                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                    for (var _iterator7 = selectionFigures[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var figure = _step7.value;

                        if (figure === _this) {
                            contain = true;
                            break;
                        }
                    }
                } catch (err) {
                    _didIteratorError7 = true;
                    _iteratorError7 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
                            _iterator7.return();
                        }
                    } finally {
                        if (_didIteratorError7) {
                            throw _iteratorError7;
                        }
                    }
                }

                if (!contain) {
                    context.resetSelection();
                    return;
                }
                selectionFigures.forEach(function (figure, index) {
                    if (!(figure instanceof _Connection2.default)) {
                        figure._recordRectPosition();
                    }
                });
                rect.ow = rect.attr('width');
                rect.oh = rect.attr('height');
                rect.dragging = true;
            };

            var dragMove = function dragMove(dx, dy) {
                var currentTool = context.currentTool;
                if (!currentTool || !(currentTool instanceof _SelectTool2.default)) {
                    return;
                }
                if (_this.context.snapto) {
                    dx -= dx % 10, dy -= dy % 10;
                }
                var selectionFigures = context.selectionFigures;
                var rect = _this.rect,
                    icon = _this.icon;
                var x = rect.ox + dx,
                    y = rect.oy + dy;
                if (x < 1 || y < 1) {
                    return;
                }
                _this.context.resizePaper(x + 150, y + 150);
                var width = void 0,
                    height = void 0;
                switch (this.attr('cursor')) {
                    case 'nw-resize':
                        width = rect.ow - dx, height = rect.oh - dy;
                        if (width > 20 && height > 20) {
                            rect.attr({
                                x: x,
                                y: y,
                                width: width,
                                height: height
                            });
                        }
                        break;
                    case 'ne-resize':
                        width = rect.ow + dx, height = rect.oh - dy;
                        if (width > 20 && height > 20) {
                            rect.attr({
                                y: y,
                                width: width,
                                height: height
                            });
                        }

                        break;
                    case 'se-resize':
                        width = rect.ow + dx, height = rect.oh + dy;
                        if (width > 20 && height > 20) {
                            rect.attr({
                                width: width,
                                height: height
                            });
                        }
                        break;
                    case 'sw-resize':
                        width = rect.ow - dx, height = rect.oh + dy;
                        if (width > 20 && height > 20) {
                            rect.attr({
                                x: x,
                                width: width,
                                height: height
                            });
                        }
                        break;
                    default:
                        selectionFigures.forEach(function (figure, index) {
                            if (!(figure instanceof _Connection2.default)) {
                                figure._moveRect(dx, dy);
                            }
                        });
                        break;
                }
                selectionFigures.forEach(function (figure, index) {
                    if (!(figure instanceof _Connection2.default)) {
                        figure._moveAndResizeTextAndIcon();
                        figure._resetConnections();
                    }
                });
            };
            var dragEnd = function dragEnd() {
                _this.rect.dragging = false;
                var selectionUUIDs = [],
                    xyMap = new Map(),
                    oldXYMap = new Map(),
                    ow = _this.rect.ow,
                    oh = _this.rect.oh,
                    w = _this.rect.attr('width'),
                    h = _this.rect.attr('height'),
                    nodeUUID = _this.uuid;
                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                    for (var _iterator8 = context.selectionFigures[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                        var figure = _step8.value;

                        if (!(figure instanceof _Connection2.default)) {
                            selectionUUIDs.push(figure.uuid);
                            var ox = figure.rect.ox,
                                oy = figure.rect.oy;
                            ox = ox ? ox : 0, oy = oy ? oy : 0;
                            var x = figure.rect.attr('x'),
                                y = figure.rect.attr('y');
                            xyMap.set(figure.uuid, { x: x, y: y });
                            oldXYMap.set(figure.uuid, { x: ox, y: oy });
                        }
                    }
                } catch (err) {
                    _didIteratorError8 = true;
                    _iteratorError8 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
                            _iterator8.return();
                        }
                    } finally {
                        if (_didIteratorError8) {
                            throw _iteratorError8;
                        }
                    }
                }

                _this.context.addRedoUndo({
                    redo: function redo() {
                        var _iteratorNormalCompletion9 = true;
                        var _didIteratorError9 = false;
                        var _iteratorError9 = undefined;

                        try {
                            for (var _iterator9 = selectionUUIDs[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                                var uuid = _step9.value;

                                var node = context.getNodeByUUID(uuid);
                                var pos = xyMap.get(uuid);
                                node.rect.attr({ x: pos.x, y: pos.y });
                                if (uuid === nodeUUID) {
                                    node.rect.attr({ width: w, height: h });
                                }
                            }
                        } catch (err) {
                            _didIteratorError9 = true;
                            _iteratorError9 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                    _iterator9.return();
                                }
                            } finally {
                                if (_didIteratorError9) {
                                    throw _iteratorError9;
                                }
                            }
                        }

                        var _iteratorNormalCompletion10 = true;
                        var _didIteratorError10 = false;
                        var _iteratorError10 = undefined;

                        try {
                            for (var _iterator10 = selectionUUIDs[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                                var _uuid = _step10.value;

                                var node = context.getNodeByUUID(_uuid);
                                node._moveAndResizeTextAndIcon();
                                node._resetConnections();
                            }
                        } catch (err) {
                            _didIteratorError10 = true;
                            _iteratorError10 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion10 && _iterator10.return) {
                                    _iterator10.return();
                                }
                            } finally {
                                if (_didIteratorError10) {
                                    throw _iteratorError10;
                                }
                            }
                        }
                    },
                    undo: function undo() {
                        var _iteratorNormalCompletion11 = true;
                        var _didIteratorError11 = false;
                        var _iteratorError11 = undefined;

                        try {
                            for (var _iterator11 = selectionUUIDs[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                                var uuid = _step11.value;

                                var node = context.getNodeByUUID(uuid);
                                var pos = oldXYMap.get(uuid);
                                node.rect.attr({ x: pos.x, y: pos.y });
                                if (uuid === nodeUUID) {
                                    node.rect.attr({ width: ow, height: oh });
                                }
                            }
                        } catch (err) {
                            _didIteratorError11 = true;
                            _iteratorError11 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion11 && _iterator11.return) {
                                    _iterator11.return();
                                }
                            } finally {
                                if (_didIteratorError11) {
                                    throw _iteratorError11;
                                }
                            }
                        }

                        var _iteratorNormalCompletion12 = true;
                        var _didIteratorError12 = false;
                        var _iteratorError12 = undefined;

                        try {
                            for (var _iterator12 = selectionUUIDs[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                                var _uuid2 = _step12.value;

                                var node = context.getNodeByUUID(_uuid2);
                                node._moveAndResizeTextAndIcon();
                                node._resetConnections();
                            }
                        } catch (err) {
                            _didIteratorError12 = true;
                            _iteratorError12 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion12 && _iterator12.return) {
                                    _iterator12.return();
                                }
                            } finally {
                                if (_didIteratorError12) {
                                    throw _iteratorError12;
                                }
                            }
                        }
                    }
                });
                if (window._setDirty) {
                    window._setDirty();
                }
            };
            this.rect.drag(dragMove, dragStart, dragEnd);
            this.icon.drag(dragMove, dragStart, dragEnd);
        }
    }, {
        key: 'remove',
        value: function remove() {
            var _this2 = this;

            var toConnections = [].concat(_toConsumableArray(this.toConnections)),
                fromConnections = [].concat(_toConsumableArray(this.fromConnections));
            toConnections.forEach(function (conn, index) {
                _this2.context.removeFigureByUUID(conn.uuid);
            });
            fromConnections.forEach(function (conn, index) {
                _this2.context.removeFigureByUUID(conn.uuid);
            });
            this.text.remove();
            this.icon.remove();
            this.rect.remove();
            if (window._setDirty) {
                window._setDirty();
            }
        }
    }, {
        key: '_recordRectPosition',
        value: function _recordRectPosition() {
            this.rect.ox = this.rect.attr('x');
            this.rect.oy = this.rect.attr('y');
        }
    }, {
        key: '_moveRect',
        value: function _moveRect(dx, dy) {
            var x = void 0,
                y = void 0;
            if (this.rect.ox && this.rect.ox !== 0) {
                x = this.rect.ox + dx, y = this.rect.oy + dy;
            } else {
                x = this.rect.attr('x') + dx, y = this.rect.attr('x') + dy;
            }
            this.rect.attr({ x: x, y: y });
        }
    }, {
        key: '_moveAndResizeTextAndIcon',
        value: function _moveAndResizeTextAndIcon() {
            var rectWidth = this.rect.attr('width'),
                rectHeight = this.rect.attr('height');
            this.text.attr({ x: this.rect.attr('x') + rectWidth / 2, y: this.rect.attr('y') + rectHeight - 16 });
            this.icon.attr({ x: this.rect.attr('x'), y: this.rect.attr('y'), width: rectWidth, height: rectHeight - 30 });
        }
    }, {
        key: '_resetConnections',
        value: function _resetConnections() {
            var conns = [].concat(_toConsumableArray(this.fromConnections), _toConsumableArray(this.toConnections));
            conns.forEach(function (conn, index) {
                conn.updatePath();
            });
        }
    }, {
        key: 'getPathInfo',
        value: function getPathInfo(forIntersection) {
            var x = this.rect.attr("x"),
                y = this.rect.attr("y"),
                w = this.rect.attr("width"),
                h = this.rect.attr("height");
            if (forIntersection) {
                x -= 5, y -= 5, w += 10, h += 10;
            }
            return "M " + x + " " + y + " L " + (x + w) + " " + y + " L " + (x + w) + " " + (y + h) + " L " + x + "  " + (y + h) + " L " + x + "  " + y;
        }
    }]);

    return Node;
}();

exports.default = Node;