'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Jacky.gao on 2016/6/28.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _raphael = require('raphael');

var _raphael2 = _interopRequireDefault(_raphael);

var _DragController = require('./DragController.js');

var _DragController2 = _interopRequireDefault(_DragController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Connection = function () {
    function Connection(node, pos) {
        _classCallCheck(this, Connection);

        this.context = node.context;
        this.uuid = this.context.nextUUID();
        this.context.allFigures.push(this);
        this.from = node;
        this.name = this.buildConnectionName(node);
        this.from.fromConnections.push(this);
        this.to = null;
        this.endX = pos.endX;
        this.endY = pos.endY;
        this.type = 'line';
        this.init();
    }

    _createClass(Connection, [{
        key: 'init',
        value: function init() {
            this.path = this.context.paper.path(this.buildPathInfo());
            this.path.attr({ 'stroke-width': '2px', 'stroke': '#999', "arrow-end": "block-wide-long" });
            this.path.toBack();
        }
    }, {
        key: 'buildConnectionName',
        value: function buildConnectionName(fromNode) {
            var conns = fromNode.fromConnections,
                name = null;
            if (conns.length === 0) {
                return null;
            }
            for (var i = 0; i < 1000000; i++) {
                name = 'c' + i;
                var exist = false;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = conns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var conn = _step.value;

                        if (conn.name && conn.name === name) {
                            exist = true;
                            break;
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

                if (!exist) {
                    break;
                }
            }
            return name;
        }
    }, {
        key: 'changeFromNode',
        value: function changeFromNode(newFrom) {
            var oldFromConnections = this.from.fromConnections;
            var index = oldFromConnections.indexOf(this);
            oldFromConnections.splice(index, 1);
            this.from = newFrom;
            var newFromConnections = newFrom.fromConnections;
            newFromConnections.push(this);
            this.updatePath();
        }
    }, {
        key: 'changeToNode',
        value: function changeToNode(newTo) {
            var oldToConnections = this.to.toConnections;
            var index = oldToConnections.indexOf(this);
            oldToConnections.splice(index, 1);
            this.to = newTo;
            var newToConnections = newTo.toConnections;
            newToConnections.push(this);
            this.updatePath();
        }
    }, {
        key: 'remove',
        value: function remove() {
            var toConns = this.to.toConnections,
                fromConns = this.from.fromConnections;
            var toIndex = toConns.indexOf(this),
                fromIndex = fromConns.indexOf(this);
            toConns.splice(toIndex, 1);
            fromConns.splice(fromIndex, 1);
            this.path.remove();
            if (this.text) {
                this.text.remove();
            }
            if (window._setDirty) {
                window._setDirty();
            }
        }
    }, {
        key: 'select',
        value: function select() {
            this.dragController = new _DragController2.default(this);
        }
    }, {
        key: 'unSelect',
        value: function unSelect() {
            if (this.dragController) {
                this.dragController.remove();
            }
        }
    }, {
        key: 'updatePath',
        value: function updatePath() {
            if (this.pathInfo) {
                this.path.attr('path', this.pathInfo);
                this.pathInfo = null;
            } else if (this.g) {
                var ga = this.g.split(','),
                    L = ga.length;
                var path = [];
                var fromRect = this.from.rect,
                    toRect = this.to.rect;
                var x1 = fromRect.attr('x'),
                    y1 = fromRect.attr('y'),
                    w1 = fromRect.attr('width'),
                    h1 = fromRect.attr('height');
                x1 += w1 / 2, y1 += h1 / 2 - 10;
                path.push(['M', x1, y1]);
                path.push(['L', ga[0], ga[1]]);
                var dot = this._buildFromFigureIntersetion(path);
                if (dot) {
                    x1 = dot.x, y1 = dot.y;
                }

                path.splice(0, path.length - 1);
                path.push(['M', ga[L - 2], ga[L - 1]]);
                var x2 = toRect.attr('x'),
                    y2 = toRect.attr('y'),
                    w2 = toRect.attr('width'),
                    h2 = toRect.attr('height');
                x2 += w2 / 2, y2 += h2 / 2 - 10;
                path.push(['L', x2, y2]);
                dot = this._buildToFigureIntersetion(path);
                if (dot) {
                    x2 = dot.x, y2 = dot.y;
                }
                var i = 0,
                    pathInfo = [['M', x1, y1]];
                while (i < L) {
                    pathInfo.push(['L', ga[i], ga[i + 1]]);
                    i += 2;
                }
                pathInfo.push(['L', x2, y2]);
                this.path.attr('path', pathInfo);
                this.g = null;
            } else {
                this.path.attr('path', this.buildPathInfo());
            }
            this._buildText();
        }
    }, {
        key: 'endPath',
        value: function endPath(toNode) {
            this.to = toNode;
            toNode.toConnections.push(this);
            this.updatePath();
        }
    }, {
        key: 'buildPathInfo',
        value: function buildPathInfo() {
            if (this.type === 'curve') {
                return this._buildCurveLinePathInfo();
            } else if (this.type === 'line') {
                return this._buildStraightLinePathInfo();
            } else {
                throw 'Unknown connection type [' + this.type + ']';
            }
        }
    }, {
        key: 'fromJSON',
        value: function fromJSON(json) {
            this.pathInfo = json.path;
            this.g = json.g;
            this.name = json.name;
            for (var prop in json) {
                if (!prop || prop === 'to' || prop === 'toNode') {
                    continue;
                }
                this[prop] = json[prop];
            }
            this.type = json.type || 'line';
            if (json.uuid) {
                this.uuid = json.uuid;
            }
            this.updatePath();
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            var json = {};
            for (var prop in this) {
                if (!prop || prop === 'to' || prop === 'toNode') {
                    continue;
                }
                json[prop] = this[prop];
            }
            json.path = this.path.attr('path');
            json.name = this.name;
            json.uuid = this.uuid;
            json.type = this.type;
            json.to = this.to.name;
            json.toUUID = this.to.uuid;
            json.from = this.from.name;
            json.fromUUID = this.from.uuid;
            return json;
        }
    }, {
        key: '_buildStraightLinePathInfo',
        value: function _buildStraightLinePathInfo() {
            var fromRect = this.from.rect;
            var x1 = fromRect.attr('x'),
                y1 = fromRect.attr('y'),
                w1 = fromRect.attr('width'),
                h1 = fromRect.attr('height');
            x1 += w1 / 2, y1 += h1 / 2 - 10;
            var x2 = this.endX,
                y2 = this.endY,
                w2 = 0,
                h2 = 0;
            if (this.to) {
                var toRect = this.to.rect;
                x2 = toRect.attr('x'), y2 = toRect.attr('y'), w2 = toRect.attr('width'), h2 = toRect.attr('height');
                x2 += w2 / 2, y2 += h2 / 2 - 10;
            }
            var pathInfo = null;
            if (this.path) {
                pathInfo = this.path.attr('path');
                if (pathInfo && pathInfo.length === 2) pathInfo = null;
            }
            var path = [['M', x1, y1], ['L', x2, y2]];
            if (pathInfo) {
                var firstLineEnd = pathInfo[1];
                path = [['M', x1, y1]];
                path.push(firstLineEnd);
            }
            var dot = this._buildFromFigureIntersetion(path);
            if (dot) {
                x1 = dot.x, y1 = dot.y;
            }
            if (this.to) {
                if (pathInfo) {
                    var lastLineStart = pathInfo[pathInfo.length - 2];
                    path = [];
                    path.push(lastLineStart);
                    path.push(['L', x2, y2]);
                }
                dot = this._buildToFigureIntersetion(path);
                if (dot) {
                    x2 = dot.x, y2 = dot.y;
                }
            }
            if (pathInfo) {
                var pathSegmentLength = pathInfo.length;
                var newPathInfo = [];
                pathInfo.forEach(function (path, index) {
                    if (index === 0) {
                        newPathInfo.push(['M', x1, y1]);
                    } else if (index === pathSegmentLength - 1) {
                        newPathInfo.push(['L', x2, y2]);
                    } else {
                        var newPath = ['L'];
                        newPath.push(path[1]);
                        newPath.push(path[2]);
                        newPathInfo.push(newPath);
                    }
                });
                return newPathInfo;
            } else {
                return 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2;
            }
        }
    }, {
        key: '_buildFromFigureIntersetion',
        value: function _buildFromFigureIntersetion(path, c) {
            if (c) {
                var fromRect = this.from.rect;
                var x1 = fromRect.attr('x'),
                    y1 = fromRect.attr('y'),
                    w1 = fromRect.attr('width'),
                    h1 = fromRect.attr('height');
                x1 += w1 / 2, y1 += h1 / 2 - 10;
                var x = path.x,
                    y = path.y;
                path = [];
                path.push(['M', x1, y1]);
                path.push(['L', x, y]);
            }
            var fromFigurePathInfo = this.from.getPathInfo(true);
            var dot = _raphael2.default.pathIntersection(fromFigurePathInfo, path);
            if (dot.length > 0) {
                var p = { x: path[1][1], y: path[1][2] };
                return { x: dot[0].x, y: dot[0].y };
            }
            return null;
        }
    }, {
        key: '_buildToFigureIntersetion',
        value: function _buildToFigureIntersetion(path, c) {
            if (c) {
                var toRect = this.to.rect;
                var x2 = toRect.attr('x'),
                    y2 = toRect.attr('y'),
                    w2 = toRect.attr('width'),
                    h2 = toRect.attr('height');
                x2 += w2 / 2, y2 += h2 / 2 - 10;
                var x = path.x,
                    y = path.y;
                path = [];
                path.push(['M', x, y]);
                path.push(['L', x2, y2]);
            }
            var toFigurePathInfo = this.to.getPathInfo(true);
            var dot = _raphael2.default.pathIntersection(toFigurePathInfo, path);
            if (dot.length > 0) {
                var p = { x: path[0][1], y: path[0][2] };
                return { x: dot[0].x, y: dot[0].y };
            }
            return null;
        }
    }, {
        key: '_buildCurveLinePathInfo',
        value: function _buildCurveLinePathInfo() {
            var fromRect = this.from.rect;
            var x1 = fromRect.attr('x'),
                y1 = fromRect.attr('y'),
                w1 = fromRect.attr('width'),
                h1 = fromRect.attr('height');
            x1 += w1 / 2, y1 += h1 / 2 - 10;
            var x2 = this.endX,
                y2 = this.endY,
                w2 = 0,
                h2 = 0,
                pathInfo = null;
            if (this.to) {
                var toRect = this.to.rect;
                x2 = toRect.attr('x'), y2 = toRect.attr('y'), w2 = toRect.attr('width'), h2 = toRect.attr('height');
                x2 += w2 / 2, y2 += h2 / 2 - 10;
            }
            var fromFigurePathInfo = this.from.getPathInfo(true);
            var dis1 = Math.abs(x1 + w1 / 2 - (x2 - w2 / 2)),
                dis2 = Math.abs(y1 + h1 / 2 - (y2 - h2 / 2));
            var line1StartPoint = 'M' + x1 + ' ' + y1;
            if (dis1 >= dis2) {
                var firstLine = line1StartPoint + ' L' + x2 + ' ' + y1;
                var dot = _raphael2.default.pathIntersection(fromFigurePathInfo, firstLine);
                if (dot.length > 0) {
                    x1 = dot[0].x, y1 = dot[0].y;
                    line1StartPoint = 'M' + dot[0].x + ' ' + dot[0].y;
                }
                if (this.to) {
                    var lastLine = 'M' + x1 + ' ' + y2 + ' L' + x2 + ' ' + y2;
                    var toFigurePathInfo = this.to.getPathInfo(true);
                    dot = _raphael2.default.pathIntersection(toFigurePathInfo, lastLine);
                    if (dot.length > 0) {
                        x2 = dot[0].x, y2 = dot[0].y;
                        if (x1 < x2) {
                            x2 -= 10;
                        } else {
                            x2 += 10;
                        }
                    }
                }
                var dx = x2 - x1,
                    dy = y2 - y1;
                pathInfo = line1StartPoint + ' L' + (x1 + dx / 2) + ' ' + y1 + ' L' + (x1 + dx / 2) + ' ' + (y1 + dy) + ' L' + x2 + ' ' + y2;
            } else {
                var _firstLine = line1StartPoint + ' L' + x1 + ' ' + y2;
                var _dot = _raphael2.default.pathIntersection(fromFigurePathInfo, _firstLine);
                if (_dot.length > 0) {
                    x1 = _dot[0].x, y1 = _dot[0].y;
                    line1StartPoint = 'M' + _dot[0].x + ' ' + _dot[0].y;
                }
                if (this.to) {
                    var _lastLine = 'M' + x2 + ' ' + y1 + ' L' + x2 + ' ' + y2;
                    var _toFigurePathInfo = this.to.getPathInfo(true);
                    _dot = _raphael2.default.pathIntersection(_toFigurePathInfo, _lastLine);
                    if (_dot.length > 0) {
                        x2 = _dot[0].x, y2 = _dot[0].y;
                        if (y1 < y2) {
                            y2 -= 10;
                        } else {
                            y2 += 10;
                        }
                    }
                }
                var _dx = x2 - x1,
                    _dy = y2 - y1;
                pathInfo = line1StartPoint + ' L' + x1 + ' ' + (y1 + _dy / 2) + ' L' + (x1 + _dx) + ' ' + (y1 + _dy / 2) + ' L' + x2 + ' ' + y2;
            }
            return pathInfo;
        }
    }, {
        key: '_buildText',
        value: function _buildText() {
            if (!this.name) {
                return;
            }
            var pos = void 0;
            var pathInfo = this.path.attr('path');
            if (pathInfo.length === 2) {
                var start = pathInfo[0],
                    end = pathInfo[1];
                pos = { x: start[1] + (end[1] - start[1]) / 2, y: start[2] + (end[2] - start[2]) / 2 };
            } else {
                var targetPointIndex = Math.round(pathInfo.length / 2) - 1;
                var point = pathInfo[targetPointIndex];
                pos = { x: point[1], y: point[2] };
            }
            if (this.text) {
                this.text.attr({ x: pos.x + 10, y: pos.y + 10, text: this.name });
            } else {
                this.text = this.context.paper.text(pos.x + 10, pos.y + 10, this.name);
                this.text.attr({ 'font-size': '14pt', 'fill': '#2196F3' });
                this.text.mousedown(function (e) {
                    e.preventDefault();
                });
            }
        }
    }]);

    return Connection;
}();

exports.default = Connection;