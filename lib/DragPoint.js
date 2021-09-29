'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Jacky.gao on 2016/7/4.
 */
var DragPoint = function () {
    function DragPoint(controller, segmentIndex) {
        _classCallCheck(this, DragPoint);

        this.controller = controller;
        this.context = controller.context;
        this.connection = controller.connection;
        this.path = controller.path;
        this._init(segmentIndex);
    }

    _createClass(DragPoint, [{
        key: '_init',
        value: function _init(segmentIndex) {
            var _this = this;
            var pathInfo = this.path.attr('path');
            var x = void 0,
                y = void 0;
            var isCornerPoint = segmentIndex % 2 === 0 ? false : true;
            var targetIndex = Math.round(segmentIndex / 2);
            if (isCornerPoint) {
                var cornerPoint = pathInfo[targetIndex];
                x = cornerPoint[1], y = cornerPoint[2];
            } else {
                var start = pathInfo[targetIndex],
                    end = pathInfo[targetIndex + 1];
                var dx = end[1] - start[1],
                    dy = end[2] - start[2];
                x = start[1] + dx / 2, y = start[2] + dy / 2;
            }

            this.rect = this.context.paper.rect(x - 4, y - 4, 6, 6);
            this.rect.attr({ 'stroke': '#FF5722', 'fill': '#FF5722' });
            this.rect.mouseover(function (e) {
                this.attr('cursor', 'move');
            });
            this.rect.mouseout(function (e) {
                this.attr('cursor', 'default');
            });
            this.rect.dblclick(function (e) {
                var pi = _this.path.attr("path");
                if (segmentIndex === 0 || segmentIndex % 2 === 0) {
                    _this.remove();
                    return;
                }
                var index = 1;
                if (segmentIndex > 1) {
                    index = (segmentIndex + 1) / 2;
                }
                pi.splice(index, 1);
                if (pi.length === 2) {
                    pi = _this.connection._buildStraightLinePathInfo();
                } else {
                    var ps = pi[1];
                    var startDot = _this.connection._buildFromFigureIntersetion({ x: ps[1], y: ps[2] }, true);
                    var startPoint = pi[0];
                    startPoint[1] = startDot.x;
                    startPoint[2] = startDot.y;
                    var pe = pi[pi.length - 2];
                    var endDot = _this.connection._buildToFigureIntersetion({ x: pe[1], y: pe[2] }, true);
                    var endPoint = pi[pi.length - 1];
                    endPoint[1] = endDot.x;
                    endPoint[2] = endDot.y;
                }
                _this.path.attr('path', pi);
                _this.remove();
                if (window._setDirty) {
                    window._setDirty();
                }
            });
            var dragMove = function dragMove(dx, dy) {
                if (_this.context.snapto) {
                    dx -= dx % 10, dy -= dy % 10;
                }
                var x = this.ox + dx,
                    y = this.oy + dy;
                if (x < 1 || y < 1) {
                    return;
                }
                _this.context.resizePaper(x + 15, y + 15);
                this.attr('x', x);
                this.attr('y', y);
                targetIndex = Math.round(segmentIndex / 2);
                var pi = _this.path.attr("path");
                var L = pi.length,
                    dot = void 0,
                    p = void 0,
                    p1 = void 0;

                var segmentCount = (pathInfo.length - 1) * 2 - 1;
                if (segmentIndex === 0 || segmentIndex === 1) {
                    p1 = pi[1];
                    dot = _this.connection._buildFromFigureIntersetion({ x: p1[1], y: p1[2] }, true);
                    p = pathInfo[0];
                    if (pathInfo.length === 2) {
                        var endDot = _this.connection._buildToFigureIntersetion({ x: x, y: y }, true);
                        if (endDot) {
                            var pp = pathInfo[pathInfo.length - 1];
                            pp[1] = endDot.x, pp[2] = endDot.y;
                        }
                    }
                } else if (segmentCount === segmentIndex || segmentCount === segmentIndex + 1 || segmentCount === segmentIndex + 2) {
                    p1 = pi[L - 2];
                    dot = _this.connection._buildToFigureIntersetion({ x: x, y: y }, true);
                    p = pathInfo[pathInfo.length - 1];
                }
                if (dot) {
                    p[1] = dot.x, p[2] = dot.y;
                }
                var newPathInfo = [];
                pathInfo.forEach(function (p, index) {
                    if (isCornerPoint) {
                        if (index === targetIndex) {
                            newPathInfo.push(['L', x, y]);
                        } else {
                            newPathInfo.push(p);
                        }
                    } else {
                        newPathInfo.push(p);
                        if (index === targetIndex) {
                            newPathInfo.push(['L', x, y]);
                        }
                    }
                });
                _this.path.attr('path', newPathInfo);
                _this.connection._buildText();
            };
            var dragStart = function dragStart() {
                this.ox = this.attr('x');
                this.oy = this.attr('y');
                _this.controller.removeOthers(_this);
                this.oldConnectionPathInfo = _this.connection.buildPathInfo();
            };
            var dragEnd = function dragEnd() {
                var newConnectionPathInfo = _this.connection.buildPathInfo(),
                    oldConnectionPathInfo = this.oldConnectionPathInfo,
                    uuid = _this.connection.uuid;
                _this.context.addRedoUndo({
                    redo: function redo() {
                        var conn = _this.context.getNodeByUUID(uuid);
                        conn.pathInfo = newConnectionPathInfo;
                        conn.updatePath();
                        conn._buildText();
                    },
                    undo: function undo() {
                        var conn = _this.context.getNodeByUUID(uuid);
                        conn.pathInfo = oldConnectionPathInfo;
                        conn.updatePath();
                        conn._buildText();
                    }
                });
            };
            this.rect.drag(dragMove, dragStart, dragEnd);
            if (window._setDirty) {
                window._setDirty();
            }
        }
    }, {
        key: 'remove',
        value: function remove() {
            this.rect.remove();
            if (window._setDirty) {
                window._setDirty();
            }
        }
    }]);

    return DragPoint;
}();

exports.default = DragPoint;