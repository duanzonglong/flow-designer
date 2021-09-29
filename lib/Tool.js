'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by Jacky.gao on 2016/6/30.
 */
var Tool = function () {
    function Tool() {
        _classCallCheck(this, Tool);

        this.count = 1;
    }

    _createClass(Tool, [{
        key: 'getType',
        value: function getType() {
            throw 'Unsupport this method.';
        }
    }, {
        key: 'getIcon',
        value: function getIcon() {
            throw 'Unsupport this method.';
        }
    }, {
        key: 'newNode',
        value: function newNode() {
            throw 'Unsupport this method.';
        }
    }, {
        key: 'getConfigs',
        value: function getConfigs() {
            return {};
        }
    }, {
        key: 'getPropertiesProducer',
        value: function getPropertiesProducer() {
            return function () {
                return '<div/>';
            };
        }
    }, {
        key: 'getConnectionPropertiesProducer',
        value: function getConnectionPropertiesProducer() {
            return function () {
                return '<div/>';
            };
        }
    }, {
        key: '_newNodeInstance',
        value: function _newNodeInstance(x, y, name) {
            var node = this.newNode();
            if (!node) {
                return null;
            }
            node._tool = this;
            node._initConfigs(this.getConfigs());
            if (!name) {
                name = this._buildNodeName();
            }
            var result = node._createFigure(this.context, { x: x, y: y }, name);
            if (result) {
                if (window._setDirty) {
                    window._setDirty();
                }
                return node;
            } else {
                return null;
            }
        }
    }, {
        key: '_buildNodeName',
        value: function _buildNodeName() {
            var name = this.getType() + this.count++,
                exist = false;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.context.allFigures[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var figure = _step.value;

                    if (figure instanceof Node) {
                        if (figure.name === name) {
                            exist = true;
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

            if (exist) {
                return this._buildNodeName();
            } else {
                return name;
            }
        }
    }]);

    return Tool;
}();

exports.default = Tool;