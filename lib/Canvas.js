'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Jacky.gao on 2016/6/28.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _raphael = require('raphael');

var _raphael2 = _interopRequireDefault(_raphael);

var _SelectTool = require('./tools/SelectTool.js');

var _SelectTool2 = _interopRequireDefault(_SelectTool);

var _ConnectionTool = require('./tools/ConnectionTool.js');

var _ConnectionTool2 = _interopRequireDefault(_ConnectionTool);

var _Connection = require('./Connection.js');

var _Connection2 = _interopRequireDefault(_Connection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Canvas = function () {
    function Canvas(context) {
        _classCallCheck(this, Canvas);

        this.context = context;
        this._init();
    }

    _createClass(Canvas, [{
        key: '_init',
        value: function _init() {
            var selectionBox = null;
            var context = this.context,
                paper = context.paper;
            var selections = paper.set();
            this.canvas = paper.rect(0, 0, paper.width, paper.height).attr({ "fill": "#FFF", opacity: 0 });
            this.canvas.toBack();
            this.canvas.drag(dragMove, dragStart, dragEnd);

            this.canvas.click(function (e) {
                var currentTool = context.currentTool;
                if (!currentTool || currentTool instanceof _ConnectionTool2.default || currentTool instanceof _SelectTool2.default) {
                    return;
                }
                var x = e.offsetX,
                    y = e.offsetY;
                var newNode = currentTool._newNodeInstance(x, y);
                if (newNode) {
                    var uuid = newNode.uuid,
                        name = newNode.name,
                        jsonData = newNode.toJSON();
                    context.addRedoUndo({
                        redo: function redo() {
                            newNode = currentTool._newNodeInstance(x, y, name);
                            newNode.initFromJson(jsonData);
                        },
                        undo: function undo() {
                            context.removeFigureByUUID(uuid);
                        }
                    });
                }
            });

            this.canvas.mousemove(function (e) {
                if (!context.currentTool) {
                    return;
                }
                if (!(context.currentTool instanceof _ConnectionTool2.default)) {
                    return;
                }
                var connection = context.currentConnection;
                if (!connection) {
                    return;
                }
                var x = e.offsetX,
                    y = e.offsetY;
                connection.endX = x;
                connection.endY = y;
                connection.updatePath();
            });

            function dragStart(x, y, event) {
                var currentTool = context.currentTool;
                if (!currentTool || !(currentTool instanceof _SelectTool2.default)) {
                    return;
                }
                selectionBox = paper.rect(event.offsetX, event.offsetY, 0, 0).attr("stroke", "#9999FF");
            }

            function dragMove(dx, dy, x, y, event) {
                var currentTool = context.currentTool;
                if (!currentTool || !(currentTool instanceof _SelectTool2.default)) {
                    return;
                }
                var offsetX = 0,
                    offsetY = 0;
                if (dx < 0) {
                    offsetX = dx;
                    dx = -1 * dx;
                }
                if (dy < 0) {
                    offsetY = dy;
                    dy = -1 * dy;
                }
                selectionBox.transform("T" + offsetX + "," + offsetY);
                selectionBox.attr("width", dx);
                selectionBox.attr("height", dy);
            }

            function dragEnd(event) {
                var currentTool = context.currentTool;
                if (!currentTool || !(currentTool instanceof _SelectTool2.default)) {
                    return;
                }
                var bounds = selectionBox.getBBox();
                selectionBox.remove();
                context.startSelect();
                var allFigures = context.allFigures;
                var connectionSelections = [],
                    figureSelections = [];
                for (var i = 0; i < allFigures.length; i++) {
                    var figure = allFigures[i];
                    if (figure instanceof _Connection2.default) {
                        var selectionPath = 'M' + bounds.x + ' ' + bounds.y + ' L' + (bounds.x + bounds.width) + ' ' + bounds.y + ' L' + (bounds.x + bounds.width) + ' ' + (bounds.y + bounds.height) + ' L' + bounds.x + ' ' + (bounds.y + bounds.height) + ' L' + bounds.x + ' ' + bounds.y;
                        var figurePath = figure.path.attr('path');
                        var dot = _raphael2.default.pathIntersection(figurePath, selectionPath);
                        if (dot.length > 0) {
                            connectionSelections.push(figure);
                        }
                    } else {
                        var element = figure.rect;
                        var figureBounds = element.getBBox();
                        if (figureBounds.x >= bounds.x && figureBounds.x <= bounds.x2 || figureBounds.x2 >= bounds.x && figureBounds.x2 <= bounds.x2) {
                            if (figureBounds.y >= bounds.y && figureBounds.y <= bounds.y2 || figureBounds.y2 >= bounds.y && figureBounds.y2 <= bounds.y2) {
                                figureSelections.push(figure);
                            }
                        }
                    }
                }
                if (figureSelections.length > 0) {
                    figureSelections.forEach(function (figure, i) {
                        context.addSelection(figure);
                    });
                } else {
                    connectionSelections.forEach(function (conn, i) {
                        context.addSelection(conn);
                    });
                }
                context.endSelect();
                if (window._setDirty) {
                    window._setDirty();
                }
            }
        }
    }]);

    return Canvas;
}();

exports.default = Canvas;
;