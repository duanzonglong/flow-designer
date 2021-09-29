"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Tool2 = require("../Tool.js");

var _Tool3 = _interopRequireDefault(_Tool2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Created by Jacky.gao on 2016/6/29.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var SelectTool = function (_Tool) {
    _inherits(SelectTool, _Tool);

    function SelectTool() {
        _classCallCheck(this, SelectTool);

        return _possibleConstructorReturn(this, (SelectTool.__proto__ || Object.getPrototypeOf(SelectTool)).apply(this, arguments));
    }

    _createClass(SelectTool, [{
        key: "getType",
        value: function getType() {
            return "Select";
        }
    }, {
        key: "getIcon",
        value: function getIcon() {
            return "<i class=\"fd fd-select\" style=\"color:#737383\"></i>";
        }
    }]);

    return SelectTool;
}(_Tool3.default);

exports.default = SelectTool;