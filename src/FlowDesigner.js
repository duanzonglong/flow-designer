/**
 * Created by Jacky.gao on 2016/6/29.
 */
import '../css/iconfont.css';
import '../css/flowdesigner.css';
import {} from 'bootstrap';
import {} from './jquery.draggable.js';
import Canvas from './Canvas.js';
import Context from './Context.js';
import * as event from './event.js';
import Node from './Node.js';
import Connection from './Connection.js';
import * as MsgBox from './MsgBox.js';

export default class FlowDesigner{
    constructor(containerId){
        this.buttons=[];
        const container=$('#'+containerId);
        this.toolbar=$(`<div class="btn-group fd-toolbar" data-toggle="buttons"></div>`);
        container.append(this.toolbar);

        this.toolbarInfo=$(`<span style="float: right;font-size: 12px;margin-top: 5px;color: #747474;margin-right: 5px"></span>`);
        this.toolbar.append(this.toolbarInfo);

        this.nodeToolbar=$(`<div class="btn-group fd-node-toolbar" data-toggle="buttons"></div>`);
        container.append(this.nodeToolbar);

        this.canvasContainer=$(`<div class="fd-canvas-container"></div>`);
        let height=$(window).height()-100;
        if(height<800){
            height=800;
        }
        this.canvasContainer.css('height',height);
        container.append(this.canvasContainer);
        this.context=new Context(this.canvasContainer);
        this.canvas=new Canvas(this.context);
        this.context.flowDesigner=this;

        const propContainerId='_prop_container';
        const propertyPanel=$('<div class="fd-property-panel"/>');
        this.canvasContainer.append(propertyPanel);

        const propertyTab=$(`<ul class="nav nav-tabs">
            <li class="active">
                <span data-toggle="tab">Property Panel <i class="fd fd-arrow-down icon-button" style="color:#9E9E9E;font-size: 16px;vertical-align: middle;cursor: pointer" title="Show/Hide" id="__prop_panel_tool__"></i></span>
            </li>
        </ul>`);
        propertyPanel.append(propertyTab);
        propertyTab.mousedown(function (e) {
           e.preventDefault();
        });
        this.propContainer=$(`<div id="${propContainerId}"/>`);
        const tabContent=$(`<div class="tab-content" style="min-height: 300px;padding:10px"/>`);
        tabContent.append(this.propContainer);
        propertyPanel.append(tabContent);
        propertyPanel.draggable();
        const propPanelTool=$("#__prop_panel_tool__");
        propPanelTool.click(function(){
            tabContent.toggle();
            const display=tabContent.css("display");
            if(!display || display==='none'){
                propPanelTool.removeClass("fd-arrow-down");
                propPanelTool.addClass("fd-arrow-left");
            }else{
                propPanelTool.removeClass("fd-arrow-left");
                propPanelTool.addClass("fd-arrow-down");
            }
        });
        this._bindSnapToEvent();
        this._bindShortcutKey();
    }

    setInfo(info){
        this.toolbarInfo.html(info);
    }

    addNode(json){
        if(!json.type){
            MsgBox.alert("??????????????????type?????????????????????.");
            return;
        }
        if(!json.x || !json.y || !json.name){
            MsgBox.alert("?????????????????????x???y???name???????????????????????????");
            return;
        }
        if(this.context.toolsMap.has(json.type)){
            const tool=this.context.toolsMap.get(json.type);
            let {x,y,width,height,name}=json;
            x=parseInt(x),y=parseInt(y),width=parseInt(width),height=parseInt(height);
            const maxWidth=x+width+10,maxHeight=y+height+10;
            this.context.resizePaper(maxWidth+50,maxHeight+50);
            const newNode=tool._newNodeInstance(x,y,name);
            newNode.initFromJson(json);
            if(window._setDirty){
                window._setDirty();
            }
        }else{
            MsgBox.alert(`?????????????????????${json.type}?????????.`);
            return;
        }
    }

    _bindShortcutKey(){
        const _this=this;
        let isCtrl=false;
        $(document).keydown(function (e) {
            if(e.which===17){
                isCtrl=true;
            }
            if(!isCtrl){
                return;
            }
            if(e.which===90){
                _this.context.undoManager.undo();
            }else if(e.which===89){
                _this.context.undoManager.redo();
            }
        }).keyup(function (e) {
            if(e.which===17){
                isCtrl=false;
            }
        });
    }

    _bindSnapToEvent(){
        event.eventEmitter.on(event.SNAPTO_SELECTED,()=>{
            if(this.canvasContainer.hasClass('snaptogrid')){
                this.canvasContainer.removeClass('snaptogrid');
                this.canvasContainer.addClass('nosnaptogrid');
                this.context.snapto=false;
            }else{
                this.canvasContainer.removeClass('nosnaptogrid');
                this.canvasContainer.addClass('snaptogrid');
                this.context.snapto=true;
            }
        });
    }

    buildDesigner(){
        this._buildTools();
        this._bindSelectionEvent();
    }

    getPropertiesProducer(){
        return function (){
            return '<div/>';
        };
    }

    _buildTools(){
        const context=this.context,_this=this;

        for(let btn of this.buttons){
            const btnTool=$(`<label class="btn btn-default btn-light" style="border:none;border-radius:0" title="${btn.tip}">
            <input type="radio" name="tools"> ${btn.icon}
            </label>`);
            btnTool.click(function(){
                if(btn.disabled){
                    return;
                }
                btn.click.call(this);
            });
            this.toolbar.append(btnTool);
        }

        const selectTool=$(`<label class="btn btn-default btn-light" style="border:none;border-radius:0" title="Select">
            <input type="radio" name="tools"> <i class="fd fd-select" style="color:#737383"></i>
        </label>`);
        this.toolbar.append(selectTool);
        selectTool.click(function (e) {
            context.cancelConnection();
            context.currentTool=context.selectTool;
            _this.nodeToolbar.children('label').removeClass('active');
        });
        const connectionTool=$(`<label class="btn btn-default btn-light" style="border:none;border-radius:0" title="Connect Line">
            <input type="radio" name="tools"> <i class="fd fd-line" style="color:#737383"></i>
        </label>`);
        this.toolbar.append(connectionTool);
        connectionTool.click(function (e) {
            context.cancelConnection();
            context.currentTool=context.connectionTool;
            _this.nodeToolbar.children('label').removeClass('active');
        });
        const undoTool=$(`<label class="btn btn-default btn-light" style="border:none;border-radius:0" title="Redo">
            <input type="radio" name="tools"> <i class="fd fd-undo" style="color:#737383"></i>
        </label>`);
        this.toolbar.append(undoTool);
        undoTool.click(function (e) {
            context.cancelConnection();
            context.undoManager.undo();
            _this.nodeToolbar.children('label').removeClass('active');
            context.currentTool=context.selectTool;
            if(window._setDirty){
                window._setDirty();
            }
        });
        const redoTool=$(`<label class="btn btn-default btn-light" style="border:none;border-radius:0" title="Undo">
            <input type="radio" name="tools"> <i class="fd fd-redo" style="color:#737383"></i>
        </label>`);
        this.toolbar.append(redoTool);
        redoTool.click(function (e) {
            context.cancelConnection();
            context.undoManager.redo();
            _this.nodeToolbar.children('label').removeClass('active');
            context.currentTool=context.selectTool;
            if(window._setDirty){
                window._setDirty();
            }
        });

        const snapTool=$(`<label class="btn btn-default btn-light" style="border:none;border-radius:0" title="Snap to Grid">
            <input type="radio" name="tools"> <i class="fd fd-snapto" style="color:#737383"></i>
        </lab>`);
        this.toolbar.append(snapTool);
        snapTool.click(function (e) {
            context.cancelConnection();
            event.eventEmitter.emit(event.SNAPTO_SELECTED);
            _this.nodeToolbar.children('label').removeClass('active');
            context.currentTool=context.selectTool;
        });
        const removeTool=$(`<label class="btn btn-default btn-light" style="border:none;border-radius:0" title="Delete">
            <input type="radio" name="tools"> <i class="fd fd-delete" style="color:#737383"></i>
        </label>`);
        this.toolbar.append(removeTool);
        removeTool.click(function (e) {
            context.cancelConnection();
            event.eventEmitter.emit(event.REMOVE_CLICKED);
            _this.nodeToolbar.children('label').removeClass('active');
            context.currentTool=context.selectTool;
            if(window._setDirty){
                window._setDirty();
            }
        });
        const alignCenter=$(`<label class="btn btn-default btn-light" style="border:none;border-radius:0" title="Vertical Middle">
            <input type="radio" name="tools"> <i class="fd fd-align-center"></i>
        </label>`);
        this.toolbar.append(alignCenter);
        alignCenter.click(function (e) {
            context.cancelConnection();
            event.eventEmitter.emit(event.ALIGN_CENTER);
            _this.nodeToolbar.children('label').removeClass('active');
            context.currentTool=context.selectTool;
            if(window._setDirty){
                window._setDirty();
            }
        });
        const alignMiddle=$(`<label class="btn btn-default btn-light" style="border:none;border-radius:0" title="Horizontal Center">
            <input type="radio" name="tools"> <i class="fd fd-align-middle"></i>
        </label>`);
        this.toolbar.append(alignMiddle);
        alignMiddle.click(function (e) {
            context.cancelConnection();
            event.eventEmitter.emit(event.ALIGN_MIDDLE);
            _this.nodeToolbar.children('label').removeClass('active');
            context.currentTool=context.selectTool;
            if(window._setDirty){
                window._setDirty();
            }
        });
        const sameSize=$(`<label class="btn btn-default btn-light" style="border:none;border-radius:0" title="Same Size">
            <input type="radio" name="tools"> <i class="fd fd-samesize"></i>
        </label>`);
        this.toolbar.append(sameSize);
        sameSize.click(function (e) {
            context.cancelConnection();
            event.eventEmitter.emit(event.UNIFY_SIZE);
            _this.nodeToolbar.children('label').removeClass('active');
            context.currentTool=context.selectTool;
            if(window._setDirty){
                window._setDirty();
            }
        });
        this._buildNodeTools();
    }

    _buildNodeTools(){
        for(let tool of this.context.toolsMap.values()){
            let tools=$(`
                <label class="btn btn-default btn-light" style="border:none;border-radius:0" title="${tool.getType()}">
                    <input type="radio" name="tools" title="${tool.getType()}"> ${tool.getIcon()}
                </label>
            `);
            this.nodeToolbar.append(tools);
            tools.click(function () {
                event.eventEmitter.emit(event.TRIGGER_TOOL,tool.getType());
            });
        };
    }

    _bindSelectionEvent(){
        const _this=this;
        event.eventEmitter.on(event.OBJECT_SELECTED,target=>{
            this.propContainer.empty();
            if(target instanceof Node){
                const name=target.name || target.text.attr('text');
                const nameGroup=$(`<div class="form-group"><label>????????????(Node Name)???</label></div>`);
                const nameText=$(`<input type="text" class="form-control" value="${name}">`);
                nameGroup.append(nameText);
                this.propContainer.append(nameGroup);
                nameText.change(function(e){
                    const newName=$(this).val(),oldName=target.name,uuid=target.uuid;
                    let nameUnique=false;
                    for(let figure of _this.context.allFigures){
                        if(figure instanceof Node && figure!==target && figure.name===newName){
                            nameUnique=true;
                            break;
                        }
                    }
                    if(nameUnique){
                        MsgBox.alert('??????????????????!');
                        return;
                    }
                    if(window._setDirty){
                        window._setDirty();
                    }
                    target.name=newName;
                    target.text.attr('text',$(this).val());
                    _this.context.addRedoUndo({
                        redo:function () {
                            const node=_this.context.getNodeByUUID(uuid);
                            node.name=newName;
                            node.text.attr('text',newName);
                        },
                        undo:function () {
                            const node=_this.context.getNodeByUUID(uuid);
                            node.name=oldName;
                            node.text.attr('text',oldName);
                        }
                    })
                });
                this.propContainer.append(target._tool.getPropertiesProducer().call(target));
            }else if(target instanceof Connection){
                const nameGroup=$(`<div class="form-group"><label>????????????(Connection Name)???</label></div>`);
                const nameText=$(`<input type="text" class="form-control" value="${target.name ? target.name : ''}">`);
                nameGroup.append(nameText);
                this.propContainer.append(nameGroup);
                nameText.change(function(e){
                    const newName=$(this).val(),oldName=target.name,uuid=target.uuid,fromConnections=target.from.fromConnections;
                    let nameUnique=false;
                    for(let conn of fromConnections){
                        if(conn!==target && conn.name===newName){
                            nameUnique=true;
                            break;
                        }
                    }
                    if(nameUnique){
                        MsgBox.alert(`??????????????????`);
                        return;
                    }
                    if(window._setDirty){
                        window._setDirty();
                    }
                    target.name=newName;
                    target._buildText();
                    _this.context.addRedoUndo({
                        redo:function () {
                            const node=_this.context.getNodeByUUID(uuid);
                            node.name=newName;
                            node._buildText();
                        },
                        undo:function () {
                            const node=_this.context.getNodeByUUID(uuid);
                            node.name=oldName;
                            node._buildText();
                        }
                    });
                });

                const lineTypeGroup=$(`<div class="form-group"><label>??????(Line Style)???</label></div>`);
                const typeSelect=$(`<select class="form-control">
                    <option value="line">??????(Straight Line)</option>
                    <option value="curve">????????????(Chamfer Curve)</option>
                </select>`);
                lineTypeGroup.append(typeSelect);
                typeSelect.val(target.type);
                typeSelect.change(function(e){
                    const type=$(this).val(),uuid=target.uuid,oldType=target.type;
                    target.type=type;
                    target.updatePath();
                    _this.context.resetSelection();
                    _this.context.addRedoUndo({
                        redo:function () {
                            const conn=_this.context.getNodeByUUID(uuid);
                            conn.type=type;
                            conn.updatePath();
                        },
                        undo:function () {
                            const conn=_this.context.getNodeByUUID(uuid);
                            conn.type=oldType;
                            conn.updatePath();
                        }
                    });
                    if(window._setDirty){
                        window._setDirty();
                    }
                });
                this.propContainer.append(lineTypeGroup);
                this.propContainer.append(target.from._tool.getConnectionPropertiesProducer().call(target));
            }
        });
        event.eventEmitter.on(event.CANVAS_SELECTED,()=>{
            this.propContainer.empty();
            this.propContainer.append(this.getPropertiesProducer().call(this));
        });
        event.eventEmitter.emit(event.CANVAS_SELECTED);
    }

    addButton(btnConfig){
        if(!btnConfig.icon || !btnConfig.tip || !btnConfig.click){
            MsgBox.alert('??????????????????????????????????????????????????????icon???tip???click????????????.');
            return false;
        }
        this.buttons.push(btnConfig);
        return true;
    }

    addTool(tool){
        tool.context=this.context;
        this.context.registerTool(tool);
        return this;
    }
    toJSON(){
        return this.elementsToJSON();
    }
    validate(){
        let errors=[];
        for(let figure of this.context.allFigures){
            if(figure instanceof Node){
                const errorInfo=figure.validate();
                if(errorInfo){
                    errors.push(errorInfo);
                }
            }
        }
        if(errors.length>0){
            let info='';
            errors.forEach((error,index)=>{
                info+=(index+1)+'.'+error+'<br>';
            });
            info='<span style="color:orangered">?????????<br>'+info+'</span>';
            MsgBox.alert(info);
            throw info;
        }
        return true;
    }
    elementsToJSON(){
        const jsonData=[];
        this.context.allFigures.forEach((figure,index)=>{
            if(figure instanceof Node){
                jsonData.push(figure.toJSON());
            }
        });
        return jsonData;
    }
}


