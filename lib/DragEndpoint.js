'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Jacky.gao on 2016/7/6.
 */
var DragEndpoint = function () {
    function DragEndpoint(controller) {
        _classCallCheck(this, DragEndpoint);

        this.controller = controller;
        this.context = controller.context;
        this.connection = controller.connection;
        this._init();
    }

    _createClass(DragEndpoint, [{
        key: '_init',
        value: function _init() {
            this._initStartPoint();
            this._initEndPoint();
        }
    }, {
        key: '_initStartPoint',
        value: function _initStartPoint() {
            var path = this.connection.path.attr('path');
            var startPoint = path[0];
            this.startRect = this.context.paper.rect(startPoint[1] - 3, startPoint[2] - 3, 6, 6);
            this.startRect.attr({ 'stroke': '#FF5722', 'fill': '#FF5722', 'opacity': 0 });
            this.startRect.mouseover(function (e) {
                this.attr('cursor', 'crosshair');
            });
            var _this = this;
            this.startRect.mouseout(function (e) {
                this.attr('cursor', 'default');
            });
            var dragMove = function dragMove(dx, dy) {
                var x = this.ox + dx,
                    y = this.oy + dy;
                if (x < 1 || y < 1) {
                    return;
                }
                this.attr('x', x);
                this.attr('y', y);
                _this.context.resizePaper(x + 10, y + 10);
                var pathInfo = _this.connection.path.attr('path');
                var p = pathInfo[0];
                p[1] = x, p[2] = y;
                _this.connection.path.attr('path', pathInfo);
            };
            var dragStart = function dragStart() {
                this.ox = this.attr('x');
                this.oy = this.attr('y');
                _this.controller.removeOthers(_this);
            };
            var dragEnd = function dragEnd() {
                if (_this.newFrom) {
                    if (_this.newFrom !== _this.connection.from) {
                        var newFromNodeUUID = _this.newFrom.uuid,
                            oldFromNodeUUID = _this.connection.from.uuid,
                            connectionUUID = _this.connection.uuid;
                        _this.connection.changeFromNode(_this.newFrom);
                        _this.context.addRedoUndo({
                            redo: function redo() {
                                var targetNode = _this.context.getNodeByUUID(newFromNodeUUID);
                                var conn = _this.context.getNodeByUUID(connectionUUID);
                                conn.changeFromNode(targetNode);
                            },
                            undo: function undo() {
                                var targetNode = _this.context.getNodeByUUID(oldFromNodeUUID);
                                var conn = _this.context.getNodeByUUID(connectionUUID);
                                conn.changeFromNode(targetNode);
                            }
                        });
                    }
                }
                _this.controller.remove();
                if (window._setDirty) {
                    window._setDirty();
                }
            };
            this.startRect.drag(dragMove, dragStart, dragEnd);
            this.startRect.onDragOver(function (e) {
                var id = e.id;
                _this.newFrom = _this.context.getFigureById(id);
            });
        }
    }, {
        key: '_initEndPoint',
        value: function _initEndPoint() {
            var path = this.connection.path.attr('path');
            var endPoint = path[path.length - 1];
            this.endRect = this.context.paper.rect(endPoint[1] - 3, endPoint[2] - 3, 6, 6);
            this.endRect.attr({ 'stroke': '#FF5722', 'fill': '#FF5722', 'opacity': 0 });
            this.endRect.mouseover(function (e) {
                this.attr('cursor', 'crosshair');
            });
            this.endRect.mouseout(function (e) {
                this.attr('cursor', 'default');
            });
            var _this = this;
            var dragMove = function dragMove(dx, dy) {
                var x = this.ox + dx,
                    y = this.oy + dy;
                if (x < 1 || y < 1) {
                    return;
                }
                this.attr('x', x);
                this.attr('y', y);
                _this.context.resizePaper(x + 5, y + 5);
                var pathInfo = _this.connection.path.attr('path');
                var p = pathInfo[pathInfo.length - 1];
                p[1] = x, p[2] = y;
                _this.connection.path.attr('path', pathInfo);
            };
            var dragStart = function dragStart() {
                this.ox = this.attr('x');
                this.oy = this.attr('y');
                _this.controller.removeOthers(_this);
            };
            var dragEnd = function dragEnd() {
                if (_this.newTo) {
                    if (_this.newTo !== _this.connection.from) {
                        var newToNodeUUID = _this.newTo.uuid,
                            oldToNodeUUID = _this.connection.to.uuid,
                            connectionUUID = _this.connection.uuid;
                        _this.connection.changeToNode(_this.newTo);
                        _this.context.addRedoUndo({
                            redo: function redo() {
                                var targetNode = _this.context.getNodeByUUID(newToNodeUUID);
                                var conn = _this.context.getNodeByUUID(connectionUUID);
                                conn.changeToNode(targetNode);
                            },
                            undo: function undo() {
                                var targetNode = _this.context.getNodeByUUID(oldToNodeUUID);
                                var conn = _this.context.getNodeByUUID(connectionUUID);
                                conn.changeToNode(targetNode);
                            }
                        });
                    }
                }
                _this.controller.remove();
                if (window._setDirty) {
                    window._setDirty();
                }
            };
            this.endRect.drag(dragMove, dragStart, dragEnd);
            this.endRect.onDragOver(function (e) {
                var id = e.id;
                _this.newTo = _this.context.getFigureById(id);
            });
        }
    }, {
        key: 'remove',
        value: function remove() {
            this.startRect.remove();
            this.endRect.remove();
            if (window._setDirty) {
                window._setDirty();
            }
        }
    }]);

    return DragEndpoint;
}();

exports.default = DragEndpoint;