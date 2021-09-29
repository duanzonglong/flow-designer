'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.alert = alert;
exports.confirm = confirm;
exports.dialog = dialog;
exports.showDialog = showDialog;
/**
 * Created by jacky on 2016/7/9.
 */

function alert(msg) {
    var dialog = buildDialog('消息提示', msg);
    dialog.modal('show');
};

function confirm(msg, callback) {
    var dialog = buildDialog('确认提示', msg, [{
        name: '确认',
        click: function click() {
            callback.call(this);
        }
    }]);
    dialog.modal('show');
};

function dialog(title, content, callback) {
    var dialog = buildDialog(title, content, [{
        name: '确认',
        click: function click() {
            callback.call(this);
        }
    }]);
    dialog.modal('show');
};

function showDialog(title, dialogContent, buttons, events, large) {
    var dialog = buildDialog(title, dialogContent, buttons, large);
    dialog.modal('show');
    if (events) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = events[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var event = _step.value;

                dialog.on(event.name, event.callback);
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
    }
};

function buildDialog(title, dialogContent, buttons, large) {
    var _this = this;

    var className = 'modal-dialog' + (large ? ' modal-lg' : '');
    var modal = $('<div class="modal fade" tabindex="-1" role="dialog" aria-hidden="true"></div>');
    var dialog = $('<div class="' + className + '"></div>');
    modal.append(dialog);
    var content = $('<div class="modal-content">\n         <div class="modal-header">\n            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">\n               &times;\n            </button>\n            <h4 class="modal-title">\n               ' + title + '\n            </h4>\n         </div>\n         <div class="modal-body">\n            ' + (typeof dialogContent === 'string' ? dialogContent : '') + '\n         </div>');
    if ((typeof dialogContent === 'undefined' ? 'undefined' : _typeof(dialogContent)) === 'object') {
        content.find('.modal-body').append(dialogContent);
    }
    dialog.append(content);
    var footer = $('<div class="modal-footer"></div>');
    content.append(footer);
    if (buttons) {
        buttons.forEach(function (btn, index) {
            var button = $('<button type="button" class="btn btn-default">' + btn.name + '</button>');
            button.click(function (e) {
                btn.click.call(this);
                if (!btn.holdDialog) {
                    modal.modal('hide');
                }
            }.bind(_this));
            footer.append(button);
        });
    } else {
        var okBtn = $('<button type="button" class="btn btn-default" data-dismiss="modal">\u786E\u5B9A</button>');
        footer.append(okBtn);
    }

    modal.on("show.bs.modal", function () {
        var index = 1050;
        $(document).find('.modal').each(function (i, d) {
            var zIndex = $(d).css('z-index');
            if (zIndex && zIndex !== '' && !isNaN(zIndex)) {
                zIndex = parseInt(zIndex);
                if (zIndex > index) {
                    index = zIndex;
                }
            }
        });
        index++;
        modal.css({ 'z-index': index });
    });
    return modal;
};