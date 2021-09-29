'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.eventEmitter = exports.UNIFY_SIZE = exports.ALIGN_MIDDLE = exports.ALIGN_CENTER = exports.REMOVE_CLICKED = exports.SNAPTO_SELECTED = exports.CANVAS_SELECTED = exports.OBJECT_SELECTED = exports.TRIGGER_TOOL = undefined;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TRIGGER_TOOL = exports.TRIGGER_TOOL = 'trigger_tool'; /**
                                                           * Created by Jacky.gao on 2016/6/30.
                                                           */
var OBJECT_SELECTED = exports.OBJECT_SELECTED = 'object_selected';
var CANVAS_SELECTED = exports.CANVAS_SELECTED = 'canvas_selected';
var SNAPTO_SELECTED = exports.SNAPTO_SELECTED = 'snapto_selected';
var REMOVE_CLICKED = exports.REMOVE_CLICKED = 'remove_clicked';
var ALIGN_CENTER = exports.ALIGN_CENTER = 'align_center';
var ALIGN_MIDDLE = exports.ALIGN_MIDDLE = 'align_middle';
var UNIFY_SIZE = exports.UNIFY_SIZE = 'unify_size';

var eventEmitter = exports.eventEmitter = new _events2.default.EventEmitter();