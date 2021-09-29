'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Jacky.gao on 2016/6/29.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


require('../css/iconfont.css');

require('../css/flowdesigner.css');

require('bootstrap');

require('./jquery.draggable.js');

var _Canvas = require('./Canvas.js');

var _Canvas2 = _interopRequireDefault(_Canvas);

var _Context = require('./Context.js');

var _Context2 = _interopRequireDefault(_Context);

var _event = require('./event.js');

var event = _interopRequireWildcard(_event);

var _Node = require('./Node.js');

var _Node2 = _interopRequireDefault(_Node);

var _Connection = require('./Connection.js');

var _Connection2 = _interopRequireDefault(_Connection);

var _MsgBox = require('./MsgBox.js');

var MsgBox = _interopRequireWildcard(_MsgBox);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FlowDesigner = function () {
    function FlowDesigner(containerId) {
        _classCallCheck(this, FlowDesigner);

        this.buttons = [];
        var container = $('#' + containerId);
        this.toolbar = $('<div class="btn-group fd-toolbar" data-toggle="buttons"></div>');
        container.append(this.toolbar);

        this.toolbarInfo = $('<span style="float: right;font-size: 12px;margin-top: 5px;color: #747474;margin-right: 5px"></span>');
        this.toolbar.append(this.toolbarInfo);

        this.nodeToolbar = $('<div class="btn-group fd-node-toolbar" data-toggle="buttons"></div>');
        container.append(this.nodeToolbar);

        this.canvasContainer = $('<div class="fd-canvas-container"></div>');
        var height = $(window).height() - 100;
        if (height < 800) {
            height = 800;
        }
        this.canvasContainer.css('height', height);
        container.append(this.canvasContainer);
        this.context = new _Context2.default(this.canvasContainer);
        this.canvas = new _Canvas2.default(this.context);
        this.context.flowDesigner = this;

        var propContainerId = '_prop_container';
        var propertyPanel = $('<div class="fd-property-panel"/>');
        this.canvasContainer.append(propertyPanel);

        var propertyTab = $('<ul class="nav nav-tabs">\n            <li class="active">\n                <span data-toggle="tab">\u5C5E\u6027\u9762\u677F <i class="fd fd-arrow-down icon-button" style="color:#9E9E9E;font-size: 16px;vertical-align: middle;cursor: pointer" title="\u70B9\u51FB\u663E\u793A/\u9690\u85CF\u5C5E\u6027\u9762\u677F" id="__prop_panel_tool__"></i></span>\n            </li>\n        </ul>');
        propertyPanel.append(propertyTab);
        propertyTab.mousedown(function (e) {
            e.preventDefault();
        });
        this.propContainer = $('<div id="' + propContainerId + '"/>');
        var tabContent = $('<div class="tab-content" style="min-height: 300px;padding:10px"/>');
        tabContent.append('<div class="text-info" style="margin-bottom:8px;color: #999999;">属性值修改后，请回车以确认</div>');
        tabContent.append(this.propContainer);
        propertyPanel.append(tabContent);
        propertyPanel.draggable();
        var propPanelTool = $("#__prop_panel_tool__");
        propPanelTool.click(function () {
            tabContent.toggle();
            var display = tabContent.css("display");
            if (!display || display === 'none') {
                propPanelTool.removeClass("fd-arrow-down");
                propPanelTool.addClass("fd-arrow-left");
            } else {
                propPanelTool.removeClass("fd-arrow-left");
                propPanelTool.addClass("fd-arrow-down");
            }
        });
        this._bindSnapToEvent();
        this._bindShortcutKey();
    }

    _createClass(FlowDesigner, [{
        key: 'setInfo',
        value: function setInfo(info) {
            this.toolbarInfo.html(info);
        }
    }, {
        key: 'addNode',
        value: function addNode(json) {
            if (!json.type) {
                MsgBox.alert("添加节点没有type属性，无法添加.");
                return;
            }
            if (!json.x || !json.y || !json.name) {
                MsgBox.alert("添加节点需要有x、y及name属性，否则无法添加");
                return;
            }
            if (this.context.toolsMap.has(json.type)) {
                var tool = this.context.toolsMap.get(json.type);
                var x = json.x,
                    y = json.y,
                    width = json.width,
                    height = json.height,
                    name = json.name;

                x = parseInt(x), y = parseInt(y), width = parseInt(width), height = parseInt(height);
                var maxWidth = x + width + 10,
                    maxHeight = y + height + 10;
                this.context.resizePaper(maxWidth + 50, maxHeight + 50);
                var newNode = tool._newNodeInstance(x, y, name);
                newNode.initFromJson(json);
                if (window._setDirty) {
                    window._setDirty();
                }
            } else {
                MsgBox.alert('\u6DFB\u52A0\u7684\u8282\u70B9\u7C7B\u578B' + json.type + '\u4E0D\u5B58\u5728.');
                return;
            }
        }
    }, {
        key: '_bindShortcutKey',
        value: function _bindShortcutKey() {
            var _this = this;
            var isCtrl = false;
            $(document).keydown(function (e) {
                if (e.which === 17) {
                    isCtrl = true;
                }
                if (!isCtrl) {
                    return;
                }
                if (e.which === 90) {
                    _this.context.undoManager.undo();
                } else if (e.which === 89) {
                    _this.context.undoManager.redo();
                }
            }).keyup(function (e) {
                if (e.which === 17) {
                    isCtrl = false;
                }
            });
        }
    }, {
        key: '_bindSnapToEvent',
        value: function _bindSnapToEvent() {
            var _this2 = this;

            event.eventEmitter.on(event.SNAPTO_SELECTED, function () {
                if (_this2.canvasContainer.hasClass('snaptogrid')) {
                    _this2.canvasContainer.removeClass('snaptogrid');
                    _this2.canvasContainer.addClass('nosnaptogrid');
                    _this2.context.snapto = false;
                } else {
                    _this2.canvasContainer.removeClass('nosnaptogrid');
                    _this2.canvasContainer.addClass('snaptogrid');
                    _this2.context.snapto = true;
                }
            });
        }
    }, {
        key: 'buildDesigner',
        value: function buildDesigner() {
            this._buildTools();
            this._bindSelectionEvent();
        }
    }, {
        key: 'getPropertiesProducer',
        value: function getPropertiesProducer() {
            return function () {
                return '<div/>';
            };
        }
    }, {
        key: '_buildTools',
        value: function _buildTools() {
            var _this3 = this;

            var context = this.context,
                _this = this;

            var _loop = function _loop(btn) {
                var btnTool = $('<label class="btn btn-default btn-light" style="border:none;border-radius:0" title="' + btn.tip + '">\n            <input type="radio" name="tools"> ' + btn.icon + '\n            </label>');
                btnTool.click(function () {
                    if (btn.disabled) {
                        return;
                    }
                    btn.click.call(this);
                });
                _this3.toolbar.append(btnTool);
            };

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.buttons[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var btn = _step.value;

                    _loop(btn);
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

            var selectTool = $('<label class="btn btn-default btn-light" style="border:none;border-radius:0" title="\u9009\u62E9">\n            <input type="radio" name="tools"> <i class="fd fd-select" style="color:#737383"></i>\n        </label>');
            this.toolbar.append(selectTool);
            selectTool.click(function (e) {
                context.cancelConnection();
                context.currentTool = context.selectTool;
                _this.nodeToolbar.children('label').removeClass('active');
            });
            var connectionTool = $('<label class="btn btn-default btn-light" style="border:none;border-radius:0" title="\u5728\u4E24\u8282\u70B9\u95F4\u521B\u5EFA\u8FDE\u63A5\u7EBF">\n            <input type="radio" name="tools"> <i class="fd fd-line" style="color:#737383"></i>\n        </label>');
            this.toolbar.append(connectionTool);
            connectionTool.click(function (e) {
                context.cancelConnection();
                context.currentTool = context.connectionTool;
                _this.nodeToolbar.children('label').removeClass('active');
            });
            var undoTool = $('<label class="btn btn-default btn-light" style="border:none;border-radius:0" title="\u91CD\u505A">\n            <input type="radio" name="tools"> <i class="fd fd-undo" style="color:#737383"></i>\n        </label>');
            this.toolbar.append(undoTool);
            undoTool.click(function (e) {
                context.cancelConnection();
                context.undoManager.undo();
                _this.nodeToolbar.children('label').removeClass('active');
                context.currentTool = context.selectTool;
                if (window._setDirty) {
                    window._setDirty();
                }
            });
            var redoTool = $('<label class="btn btn-default btn-light" style="border:none;border-radius:0" title="\u64A4\u6D88">\n            <input type="radio" name="tools"> <i class="fd fd-redo" style="color:#737383"></i>\n        </label>');
            this.toolbar.append(redoTool);
            redoTool.click(function (e) {
                context.cancelConnection();
                context.undoManager.redo();
                _this.nodeToolbar.children('label').removeClass('active');
                context.currentTool = context.selectTool;
                if (window._setDirty) {
                    window._setDirty();
                }
            });

            var snapTool = $('<label class="btn btn-default btn-light" style="border:none;border-radius:0" title="\u7F51\u683C\u5438\u9644">\n            <input type="radio" name="tools"> <i class="fd fd-snapto" style="color:#737383"></i>\n        </lab>');
            this.toolbar.append(snapTool);
            snapTool.click(function (e) {
                context.cancelConnection();
                event.eventEmitter.emit(event.SNAPTO_SELECTED);
                _this.nodeToolbar.children('label').removeClass('active');
                context.currentTool = context.selectTool;
            });
            var removeTool = $('<label class="btn btn-default btn-light" style="border:none;border-radius:0" title="\u5220\u9664\u9009\u62E9\u5BF9\u8C61">\n            <input type="radio" name="tools"> <i class="fd fd-delete" style="color:#737383"></i>\n        </label>');
            this.toolbar.append(removeTool);
            removeTool.click(function (e) {
                context.cancelConnection();
                event.eventEmitter.emit(event.REMOVE_CLICKED);
                _this.nodeToolbar.children('label').removeClass('active');
                context.currentTool = context.selectTool;
                if (window._setDirty) {
                    window._setDirty();
                }
            });
            var alignCenter = $('<label class="btn btn-default btn-light" style="border:none;border-radius:0" title="\u7AD6\u76F4\u5C45\u4E2D">\n            <input type="radio" name="tools"> <i class="fd fd-align-center"></i>\n        </label>');
            this.toolbar.append(alignCenter);
            alignCenter.click(function (e) {
                context.cancelConnection();
                event.eventEmitter.emit(event.ALIGN_CENTER);
                _this.nodeToolbar.children('label').removeClass('active');
                context.currentTool = context.selectTool;
                if (window._setDirty) {
                    window._setDirty();
                }
            });
            var alignMiddle = $('<label class="btn btn-default btn-light" style="border:none;border-radius:0" title="\u6C34\u5E73\u5C45\u4E2D">\n            <input type="radio" name="tools"> <i class="fd fd-align-middle"></i>\n        </label>');
            this.toolbar.append(alignMiddle);
            alignMiddle.click(function (e) {
                context.cancelConnection();
                event.eventEmitter.emit(event.ALIGN_MIDDLE);
                _this.nodeToolbar.children('label').removeClass('active');
                context.currentTool = context.selectTool;
                if (window._setDirty) {
                    window._setDirty();
                }
            });
            var sameSize = $('<label class="btn btn-default btn-light" style="border:none;border-radius:0" title="\u5C06\u9009\u4E2D\u7684\u6240\u6709\u7EC4\u4EF6\u7684\u5C3A\u5BF8\u8BBE\u7F6E\u4E3A\u76F8\u540C">\n            <input type="radio" name="tools"> <i class="fd fd-samesize"></i>\n        </label>');
            this.toolbar.append(sameSize);
            sameSize.click(function (e) {
                context.cancelConnection();
                event.eventEmitter.emit(event.UNIFY_SIZE);
                _this.nodeToolbar.children('label').removeClass('active');
                context.currentTool = context.selectTool;
                if (window._setDirty) {
                    window._setDirty();
                }
            });
            this._buildNodeTools();
        }
    }, {
        key: '_buildNodeTools',
        value: function _buildNodeTools() {
            var _this4 = this;

            var _loop2 = function _loop2(tool) {
                var tools = $('\n                <label class="btn btn-default btn-light" style="border:none;border-radius:0" title="' + tool.getType() + '">\n                    <input type="radio" name="tools" title="' + tool.getType() + '"> ' + tool.getIcon() + '\n                </label>\n            ');
                _this4.nodeToolbar.append(tools);
                tools.click(function () {
                    event.eventEmitter.emit(event.TRIGGER_TOOL, tool.getType());
                });
            };

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.context.toolsMap.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var tool = _step2.value;

                    _loop2(tool);
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

            ;
        }
    }, {
        key: '_bindSelectionEvent',
        value: function _bindSelectionEvent() {
            var _this5 = this;

            var _this = this;
            event.eventEmitter.on(event.OBJECT_SELECTED, function (target) {
                _this5.propContainer.empty();
                if (target instanceof _Node2.default) {
                    var name = target.name || target.text.attr('text');
                    var nameGroup = $('<div class="form-group"><label>\u8282\u70B9\u540D\u79F0(Node Name)\uFF1A</label></div>');
                    var nameText = $('<input type="text" class="form-control" value="' + name + '">');
                    nameGroup.append(nameText);
                    _this5.propContainer.append(nameGroup);
                    nameText.change(function (e) {
                        var newName = $(this).val(),
                            oldName = target.name,
                            uuid = target.uuid;
                        var nameUnique = false;
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = _this.context.allFigures[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var figure = _step3.value;

                                if (figure instanceof _Node2.default && figure !== target && figure.name === newName) {
                                    nameUnique = true;
                                    break;
                                }
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

                        if (nameUnique) {
                            MsgBox.alert('节点名已存在!');
                            return;
                        }
                        if (window._setDirty) {
                            window._setDirty();
                        }
                        target.name = newName;
                        target.text.attr('text', $(this).val());
                        _this.context.addRedoUndo({
                            redo: function redo() {
                                var node = _this.context.getNodeByUUID(uuid);
                                node.name = newName;
                                node.text.attr('text', newName);
                            },
                            undo: function undo() {
                                var node = _this.context.getNodeByUUID(uuid);
                                node.name = oldName;
                                node.text.attr('text', oldName);
                            }
                        });
                    });
                    _this5.propContainer.append(target._tool.getPropertiesProducer().call(target));
                } else if (target instanceof _Connection2.default) {
                    var _nameGroup = $('<div class="form-group"><label>\u8FDE\u7EBF\u540D\u79F0(Connection Name)\uFF1A</label></div>');
                    var _nameText = $('<input type="text" class="form-control" value="' + (target.name ? target.name : '') + '">');
                    _nameGroup.append(_nameText);
                    _this5.propContainer.append(_nameGroup);
                    _nameText.change(function (e) {
                        var newName = $(this).val(),
                            oldName = target.name,
                            uuid = target.uuid,
                            fromConnections = target.from.fromConnections;
                        var nameUnique = false;
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            for (var _iterator4 = fromConnections[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var conn = _step4.value;

                                if (conn !== target && conn.name === newName) {
                                    nameUnique = true;
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

                        if (nameUnique) {
                            MsgBox.alert('\u8FDE\u7EBF\u540D\u5DF2\u5B58\u5728');
                            return;
                        }
                        if (window._setDirty) {
                            window._setDirty();
                        }
                        target.name = newName;
                        target._buildText();
                        _this.context.addRedoUndo({
                            redo: function redo() {
                                var node = _this.context.getNodeByUUID(uuid);
                                node.name = newName;
                                node._buildText();
                            },
                            undo: function undo() {
                                var node = _this.context.getNodeByUUID(uuid);
                                node.name = oldName;
                                node._buildText();
                            }
                        });
                    });

                    var lineTypeGroup = $('<div class="form-group"><label>\u7EBF\u578B(Line Style)\uFF1A</label></div>');
                    var typeSelect = $('<select class="form-control">\n                    <option value="line">\u76F4\u7EBF(Straight Line)</option>\n                    <option value="curve">\u76F4\u89D2\u66F2\u7EBF(Chamfer Curve)</option>\n                </select>');
                    lineTypeGroup.append(typeSelect);
                    typeSelect.val(target.type);
                    typeSelect.change(function (e) {
                        var type = $(this).val(),
                            uuid = target.uuid,
                            oldType = target.type;
                        target.type = type;
                        target.updatePath();
                        _this.context.resetSelection();
                        _this.context.addRedoUndo({
                            redo: function redo() {
                                var conn = _this.context.getNodeByUUID(uuid);
                                conn.type = type;
                                conn.updatePath();
                            },
                            undo: function undo() {
                                var conn = _this.context.getNodeByUUID(uuid);
                                conn.type = oldType;
                                conn.updatePath();
                            }
                        });
                        if (window._setDirty) {
                            window._setDirty();
                        }
                    });
                    _this5.propContainer.append(lineTypeGroup);
                    _this5.propContainer.append(target.from._tool.getConnectionPropertiesProducer().call(target));
                }
            });
            event.eventEmitter.on(event.CANVAS_SELECTED, function () {
                _this5.propContainer.empty();
                _this5.propContainer.append(_this5.getPropertiesProducer().call(_this5));
            });
            event.eventEmitter.emit(event.CANVAS_SELECTED);
        }
    }, {
        key: 'addButton',
        value: function addButton(btnConfig) {
            if (!btnConfig.icon || !btnConfig.tip || !btnConfig.click) {
                MsgBox.alert('添加到设计器工具栏的按钮对象必须要有icon、tip及click三个属性.');
                return false;
            }
            this.buttons.push(btnConfig);
            return true;
        }
    }, {
        key: 'addTool',
        value: function addTool(tool) {
            tool.context = this.context;
            this.context.registerTool(tool);
            return this;
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {
            return this.elementsToJSON();
        }
    }, {
        key: 'validate',
        value: function validate() {
            var errors = [];
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this.context.allFigures[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var figure = _step5.value;

                    if (figure instanceof _Node2.default) {
                        var errorInfo = figure.validate();
                        if (errorInfo) {
                            errors.push(errorInfo);
                        }
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

            if (errors.length > 0) {
                var info = '';
                errors.forEach(function (error, index) {
                    info += index + 1 + '.' + error + '<br>';
                });
                info = '<span style="color:orangered">错误：<br>' + info + '</span>';
                MsgBox.alert(info);
                throw info;
            }
            return true;
        }
    }, {
        key: 'elementsToJSON',
        value: function elementsToJSON() {
            var jsonData = [];
            this.context.allFigures.forEach(function (figure, index) {
                if (figure instanceof _Node2.default) {
                    jsonData.push(figure.toJSON());
                }
            });
            return jsonData;
        }
    }]);

    return FlowDesigner;
}();

exports.default = FlowDesigner;