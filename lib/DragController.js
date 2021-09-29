'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Jacky.gao on 2016/7/4.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _DragPoint = require('./DragPoint.js');

var _DragPoint2 = _interopRequireDefault(_DragPoint);

var _DragEndpoint = require('./DragEndpoint.js');

var _DragEndpoint2 = _interopRequireDefault(_DragEndpoint);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DragController = function () {
    function DragController(connection) {
        _classCallCheck(this, DragController);

        this.context = connection.context;
        this.connection = connection;
        this.path = connection.path;
        this.points = [];
        this._init();
    }

    _createClass(DragController, [{
        key: '_init',
        value: function _init() {
            var path = this.path.attr('path');
            var segmentCount = (path.length - 1) * 2 - 1;
            for (var i = 0; i < segmentCount; i++) {
                var point = new _DragPoint2.default(this, i);
                this.points.push(point);
            }
            this.dragEndpoint = new _DragEndpoint2.default(this);
        }
    }, {
        key: 'remove',
        value: function remove() {
            this.points.forEach(function (point, index) {
                point.remove();
            });
            this.points.splice(0, this.points.length);
            this.dragEndpoint.remove();
            if (window._setDirty) {
                window._setDirty();
            }
        }
    }, {
        key: 'removeOthers',
        value: function removeOthers(currentPoint) {
            this.points.forEach(function (point, index) {
                if (point !== currentPoint) {
                    point.remove();
                }
            });
            if (this.dragEndpoint !== currentPoint) {
                this.dragEndpoint.remove();
            }
            if (window._setDirty) {
                window._setDirty();
            }
        }
    }]);

    return DragController;
}();

exports.default = DragController;