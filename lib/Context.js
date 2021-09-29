'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Jacky.gao on 2016/6/28.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _raphael = require('raphael');

var _raphael2 = _interopRequireDefault(_raphael);

var _undoManager = require('undo-manager');

var _undoManager2 = _interopRequireDefault(_undoManager);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _SelectTool = require('./tools/SelectTool.js');

var _SelectTool2 = _interopRequireDefault(_SelectTool);

var _ConnectionTool = require('./tools/ConnectionTool.js');

var _ConnectionTool2 = _interopRequireDefault(_ConnectionTool);

var _Connection = require('./Connection.js');

var _Connection2 = _interopRequireDefault(_Connection);

var _event = require('./event.js');

var event = _interopRequireWildcard(_event);

var _Node = require('./Node.js');

var _Node2 = _interopRequireDefault(_Node);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Context = function () {
    function Context(container) {
        _classCallCheck(this, Context);

        this.undoManager = new _undoManager2.default();
        this.toolsMap = new Map();
        this._initBuiltinTools();
        this.container = container;
        this.paper = new _raphael2.default(container[0], '100%', '100%');
        this.allFigures = [];
        this.selectionFigures = [];
        this.selectionRects = this.paper.set();
        this.selectionPaths = this.paper.set();
        this.currentConnection = null;
        this._initEvent();
    }

    _createClass(Context, [{
        key: 'selectFigure',
        value: function selectFigure(figure) {
            this.startSelect();
            this.addSelection(figure);
            this.endSelect();
        }
    }, {
        key: 'startSelect',
        value: function startSelect() {
            this.resetSelection();
        }
    }, {
        key: 'resizePaper',
        value: function resizePaper(newWidth, newHeight) {
            var w = this.container.width(),
                h = this.container.height();
            if (newWidth > w) {
                this.container.width(newWidth + 10);
            }
            if (newHeight > h) {
                this.container.height(newHeight + 10);
            }
        }
    }, {
        key: 'addRedoUndo',
        value: function addRedoUndo(redoUndo) {
            this.undoManager.add(redoUndo);
        }
    }, {
        key: 'addSelection',
        value: function addSelection(figure) {
            this.selectionFigures.push(figure);
            if (figure instanceof _Connection2.default) {
                this.selectionPaths.push(figure.path);
            } else {
                this.selectionRects.push(figure.rect);
            }
        }
    }, {
        key: 'endSelect',
        value: function endSelect() {
            this.selectionRects.attr("stroke", '#FF9800');
            this.selectionPaths.attr({ "stroke": '#999', 'stroke-dasharray': '20' });
            var firstSelectFigure = null;
            this.selectionFigures.forEach(function (figure, index) {
                if (!firstSelectFigure) {
                    firstSelectFigure = figure;
                }
                if (figure instanceof _Connection2.default) {
                    figure.select();
                }
            });
            if (firstSelectFigure) {
                event.eventEmitter.emit(event.OBJECT_SELECTED, firstSelectFigure);
            }
        }
    }, {
        key: 'resetSelection',
        value: function resetSelection() {
            this.selectionRects.attr("stroke", '#fff');
            this.selectionPaths.attr({ "stroke": '#999', 'stroke-dasharray': 'none' });
            this.selectionRects = this.paper.set();
            this.selectionPaths = this.paper.set();
            this.selectionFigures.forEach(function (figure, index) {
                if (figure instanceof _Connection2.default) {
                    figure.unSelect();
                }
            });
            this.selectionFigures.splice(0, this.selectionFigures.length);
            event.eventEmitter.emit(event.CANVAS_SELECTED);
        }
    }, {
        key: 'registerTool',
        value: function registerTool(tool) {
            var type = tool.getType();
            if (this.toolsMap.has(type)) {
                throw 'Figure [' + type + '] already exist.';
            }
            this.toolsMap.set(type, tool);
        }
    }, {
        key: 'nextUUID',
        value: function nextUUID() {
            return _nodeUuid2.default.v1();
        }
    }, {
        key: 'getFigureById',
        value: function getFigureById(id) {
            var target = void 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.allFigures[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var figure = _step.value;

                    if (figure instanceof _Node2.default) {
                        if (figure.rect.id === id || figure.icon.id === id || figure.text.id === id) {
                            target = figure;
                            break;
                        }
                    }
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

            return target;
        }
    }, {
        key: 'getNodeByUUID',
        value: function getNodeByUUID(uuid) {
            var targetNode = void 0;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.allFigures[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var node = _step2.value;

                    if (node.uuid === uuid) {
                        targetNode = node;
                        break;
                    }
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

            return targetNode;
        }
    }, {
        key: 'removeFigureByUUID',
        value: function removeFigureByUUID(uuid) {
            var targetNode = this.getNodeByUUID(uuid);
            var pos = this.allFigures.indexOf(targetNode);
            this.allFigures.splice(pos, 1);
            targetNode.remove();
        }
    }, {
        key: 'cancelConnection',
        value: function cancelConnection() {
            if (this.currentConnection) {
                var fromConnections = this.currentConnection.from.fromConnections;
                var pos = fromConnections.indexOf(this.currentConnection);
                fromConnections.splice(pos, 1);
                this.currentConnection.path.remove();
                if (this.currentConnection.text) {
                    this.currentConnection.text.remove();
                }
            }
            this.currentConnection = null;
        }
    }, {
        key: '_initEvent',
        value: function _initEvent() {
            var _this2 = this;

            event.eventEmitter.on(event.TRIGGER_TOOL, function (nodeName) {
                if (!_this2.toolsMap.has(nodeName)) {
                    throw 'Node ' + nodeName + ' not exist.';
                }
                _this2.currentTool = _this2.toolsMap.get(nodeName);
                _this2.cancelConnection();
            });
            event.eventEmitter.on(event.REMOVE_CLICKED, function () {
                var selections = [].concat(_toConsumableArray(_this2.selectionFigures));
                if (selections === 0) {
                    return;
                }
                _this2.resetSelection();
                selections.forEach(function (select, index) {
                    var jsonData = select.toJSON(),
                        uuid = select.uuid,
                        _this = _this2;
                    if (select instanceof _Connection2.default) {
                        _this2.addRedoUndo({
                            redo: function redo() {
                                var conn = _this.getNodeByUUID(uuid);
                                var fromUUID = conn.from.uuid,
                                    toUUID = conn.to.uuid;
                                var fromNode = _this.context.getNodeByUUID(fromUUID),
                                    toNode = _this.context.getNodeByUUID(toUUID);
                                var newConnection = new _Connection2.default(fromNode, { x: fromNode.rect.attr('x'), y: fromNode.rect.attr('y') });
                                fromNode.fromConnections.push(newConnection);
                                toNode.toConnections.push(newConnection);
                                newConnection.to = toNode;
                                newConnection.fromJSON(jsonData);
                            },
                            undo: function undo() {
                                _this.removeFigureByUUID(uuid);
                            }
                        });
                    } else {
                        var tool = select._tool;
                        _this2.addRedoUndo({
                            redo: function redo() {
                                _this.removeFigureByUUID(uuid);
                            },
                            undo: function undo() {
                                var newNode = tool._newNodeInstance(10, 10, '');
                                if (newNode) {
                                    newNode.initFromJson(jsonData);
                                    newNode._buildConnections();
                                }
                            }
                        });
                    }
                    _this2.removeFigureByUUID(uuid);
                });
            });
            event.eventEmitter.on(event.ALIGN_CENTER, function () {
                var x = -1,
                    y = -1,
                    w = void 0,
                    map = new Map(),
                    index = 0;
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = _this2.selectionFigures[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var select = _step3.value;

                        if (select instanceof _Connection2.default) {
                            break;
                        }
                        var data = { oldXY: { x: select.rect.attr('x'), y: select.rect.attr('y') } };
                        if (index === 0) {
                            x = select.rect.attr('x'), w = select.rect.attr('width');
                            x += w / 2;
                        } else {
                            select.moveTo(x, y);
                        }
                        data.newXY = { x: select.rect.attr('x'), y: select.rect.attr('y') };
                        map.set(select.uuid, data);
                        index++;
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

                var _this = _this2;
                _this2.addRedoUndo({
                    redo: function redo() {
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            for (var _iterator4 = map.keys()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var _uuid = _step4.value;

                                var node = _this.getNodeByUUID(_uuid),
                                    data = map.get(_uuid);
                                var newXY = data.newXY;

                                node.move(newXY.x, newXY.y, node.rect.attr('width'), node.rect.attr('height'));
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
                    },
                    undo: function undo() {
                        var _iteratorNormalCompletion5 = true;
                        var _didIteratorError5 = false;
                        var _iteratorError5 = undefined;

                        try {
                            for (var _iterator5 = map.keys()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                var _uuid2 = _step5.value;

                                var node = _this.getNodeByUUID(_uuid2),
                                    data = map.get(_uuid2);
                                var oldXY = data.oldXY;

                                node.move(oldXY.x, oldXY.y, node.rect.attr('width'), node.rect.attr('height'));
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
                    }
                });
            });
            event.eventEmitter.on(event.ALIGN_MIDDLE, function () {
                var x = -1,
                    y = -1,
                    h = void 0,
                    map = new Map(),
                    index = 0;
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = _this2.selectionFigures[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var select = _step6.value;

                        if (select instanceof _Connection2.default) {
                            break;
                        }
                        var data = { oldXY: { x: select.rect.attr('x'), y: select.rect.attr('y') } };
                        if (index === 0) {
                            y = select.rect.attr('y'), h = select.rect.attr('height');
                            y += h / 2;
                        } else {
                            select.moveTo(x, y);
                        }
                        data.newXY = { x: select.rect.attr('x'), y: select.rect.attr('y') };
                        map.set(select.uuid, data);
                        index++;
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

                var _this = _this2;
                _this2.addRedoUndo({
                    redo: function redo() {
                        var _iteratorNormalCompletion7 = true;
                        var _didIteratorError7 = false;
                        var _iteratorError7 = undefined;

                        try {
                            for (var _iterator7 = map.keys()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                                var _uuid3 = _step7.value;

                                var node = _this.getNodeByUUID(_uuid3),
                                    data = map.get(_uuid3);
                                var newXY = data.newXY;

                                node.move(newXY.x, newXY.y, node.rect.attr('width'), node.rect.attr('height'));
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
                    },
                    undo: function undo() {
                        var _iteratorNormalCompletion8 = true;
                        var _didIteratorError8 = false;
                        var _iteratorError8 = undefined;

                        try {
                            for (var _iterator8 = map.keys()[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                                var _uuid4 = _step8.value;

                                var node = _this.getNodeByUUID(_uuid4),
                                    data = map.get(_uuid4);
                                var oldXY = data.oldXY;

                                node.move(oldXY.x, oldXY.y, node.rect.attr('width'), node.rect.attr('height'));
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
                    }
                });
            });
            event.eventEmitter.on(event.UNIFY_SIZE, function () {
                var w = void 0,
                    h = void 0,
                    map = new Map(),
                    index = 0;
                var _iteratorNormalCompletion9 = true;
                var _didIteratorError9 = false;
                var _iteratorError9 = undefined;

                try {
                    for (var _iterator9 = _this2.selectionFigures[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                        var select = _step9.value;

                        if (select instanceof _Connection2.default) {
                            break;
                        }
                        var data = { oldWH: { w: select.rect.attr('width'), h: select.rect.attr('height') } };
                        if (index === 0) {
                            w = select.rect.attr('width'), h = select.rect.attr('height');
                        } else {
                            select.changeSize(w, h);
                        }
                        data.newWH = { w: select.rect.attr('width'), h: select.rect.attr('height') };
                        map.set(select.uuid, data);
                        index++;
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

                var _this = _this2;
                _this2.addRedoUndo({
                    redo: function redo() {
                        var _iteratorNormalCompletion10 = true;
                        var _didIteratorError10 = false;
                        var _iteratorError10 = undefined;

                        try {
                            for (var _iterator10 = map.keys()[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                                var _uuid5 = _step10.value;

                                var node = _this.getNodeByUUID(_uuid5),
                                    data = map.get(_uuid5);
                                var newWH = data.newWH;
                                node.changeSize(newWH.w, newWH.h);
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
                            for (var _iterator11 = map.keys()[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                                var _uuid6 = _step11.value;

                                var node = _this.getNodeByUUID(_uuid6),
                                    data = map.get(_uuid6);
                                var oldWH = data.oldWH;
                                node.changeSize(oldWH.w, oldWH.h);
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
                    }
                });
            });
        }
    }, {
        key: '_initBuiltinTools',
        value: function _initBuiltinTools() {
            this.selectTool = new _SelectTool2.default();
            this.connectionTool = new _ConnectionTool2.default();
            this.selectTool.context = this;
            this.connectionTool.context = this;
            this.currentTool = this.selectTool;
        }
    }]);

    return Context;
}();

exports.default = Context;