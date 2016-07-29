/*************************************************************************************************************************


*************************************************************************************************************************/
(function(win) {
    //string展
    String.prototype.trim = function() {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }
    String.prototype.LTrim = function() {
        return this.replace(/(^\s*)/g, "");
    }
    String.prototype.RTrim = function() {
        return this.replace(/(\s*$)/g, "");
    }
    String.prototype.isEmail = function() {
        return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(this);
    }
    String.prototype.existChinese = function() {
        return /^[\x00-\xff]*$/.test(this);
    }
    String.prototype.isUrl = function() {
        return new RegExp("^http[s]?:\/\/([\w-]+\.)+[\w-]+([\w-./?%&=]*)?$", "i").test(this);
        //return /^http[s]?:\/\/([\w-]+\.)+[\w-]+([\w-./?%&=]*)?$/i.test(this);
    }
    String.prototype.isPhoneCall = function() {
        return /(^[0-9]{3,4}\-[0-9]{3,8}$)|(^[0-9]{3,8}$)|(^\([0-9]{3,4}\)[0-9]{3,8}$)|(^0{0,1}13[0-9]{9}$)/.test(this);
    }
    String.prototype.isNumber = function() {
        return /^[0-9]+$/.test(this);
    }
    String.prototype.startWith = function(str) {
        return this.indexof(str) == 0;
    }

    Array.prototype.insert = function(startIndex, data) {
        this.splice(startIndex, 0, data);
        return this;
    }
    Array.prototype.del = function(startIndex, delLen) {
        this.splice(startIndex, delLen);
        return this;
    }
    Array.prototype.replace = function(index, obj) {
        this.splice(index, 1, obj);
        return this;
    }
    Array.prototype.subArray = function(startIndex, len) {
        return this.slice(startIndex, startIndex + len);
    }

    Date.prototype.getDateString = function() {  //鏄剧ず 骞存湀鏃?
        return this.toLocaleDateString();
    }
    Date.prototype.getTimeString = function() {  //鏄剧ず 鏃跺垎绉?
        return this.toLocaleTimeString();
    }

    //瀵筬irefox winodw.event鐨勬墿灞?
    function __firefox() {
        HTMLElement.prototype.__defineGetter__("runtimeStyle", __element_style);
        window.constructor.prototype.__defineGetter__("event", __window_event);
        Event.prototype.__defineGetter__("srcElement", __event_srcElement);
    }
    function __element_style() {
        return this.style;
    }
    function __window_event() {
        return __window_event_constructor();
    }
    function __event_srcElement() {
        return this.target;
    }
    function __window_event_constructor() {
        if (document.all) {
            return window.event;
        }
        var _caller = __window_event_constructor.caller;
        while (_caller != null) {
            var _argument = _caller.arguments[0];
            if (_argument) {
                var _temp = _argument.constructor;
                if (_temp.toString().indexOf("Event") != -1) {
                    return _argument;
                }
            }
            _caller = _caller.caller;
        }
        return null;
    }
    if (window.addEventListener) {
        __firefox();
    }

    var isIE = (navigator.userAgent.toUpperCase().indexOf("MSIE")) > 0 ? true : false;
    var isFireFox = (navigator.userAgent.toUpperCase().indexOf("FIREFOX")) > 0 ? true : false;
    var isChrome = (navigator.userAgent.toUpperCase().indexOf("CHROME")) > 0 ? true : false;
    var httpRequest = function() {
        var request = null;
        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        }

        if (window.ActiveXObject) {
            try {
                request = new ActiveXObject("Msxml2.XMLHTTP");
            }
            catch (e) {
                try {
                    request = new ActiveXObject("Microsoft.XMLHTTP");
                }
                catch (e) {
                }
            }
        }
        return request;
    };

    var _$ = function(selector) {
        //Array展
        //if(/Array/.test((typeof selector=='string')?selector:(selector.consturctor?selector.constructor.toString():""))){
        if (selector.constructor && !/object HTMLCollection/.test(selector.constructor.toString()) && (/object array/.test(Object.prototype.toString.call(selector).toLowerCase()) || /object htmlcollection/.test(Object.prototype.toString.call(selector).toLowerCase()))) {
            selector.each = function(fn) {
                for (var k = 0; k < selector.length; k++) {
                    if (k != 'length') {
                        if (selector.toString().indexOf("HTML") > 0) {

                        }
                        fn.call(this[k], k, this[k]);
                    }
                }
            }
            //展诖

            return selector;
        }

        //远展
        //if(/Object/.test((typeof selector=='string')?selector:(selector.consturctor?selector.constructor.toString():""))){
        if (selector.constructor && !/object NodeList/.test(selector.constructor.toString()) && !/object HTMLCollection/.test(selector.constructor.toString()) && selector != undefined && /object object/.test(Object.prototype.toString.call(selector).toLowerCase()) && (typeof selector != 'string') ? selector.innerHTML == undefined : false) {
            selector.each = function(fn) {
                for (var key in selector) {
                    if (key == 'length' || key == 'each') continue;
                    //if((typeof selector[key]) !='function')
                    fn.call(selector[key], key, selector[key]);
                }
            }
            //展诖

            return selector;
        }

        var ele = {};
        ele.find = function(selector) {
            if (!selector) {
                return null;
            }

            /*------------------------selector为outhtml---------------------------*/
            function outhtml(selector) {
                var _DIV = document.createElement('div');
                if (typeof selector != 'string') {
                    _DIV.appendChild(selector.cloneNode(false));
                    return _DIV.innerHTML;
                }

                return "";
            }

            if (/^#/.test(selector)) {
                return _$.prototype.id(selector);
            }
            else if (/^\./.test(selector)) {
                return _$.prototype.cls(selector);
            } else if ((typeof selector != 'string') && (!(/object array/.test(selector)) || new RegExp("(S*?)[^>]*>.*?|<.*?/>").test(selector.outerHTML ? selector.outerHTML : outhtml(selector)))) {//}else if(new RegExp("(S*?)[^>]*>.*?|<.*?/>").test(selector.outerHTML?selector.outerHTML:outhtml(selector))){
                return _$.prototype.htmlEle(selector);
            }
            else {
                //alert(selector);
                return _$.prototype.ele(selector);
            }
        }

        ele.col = ele.find(selector);

        ele.col.each = function(fn) {         //一趴
            //樱支莼
            if (this.length == undefined) {
                if (typeof fn == 'function') {
                    fn.call(this, 0, this);
                } else {
                    this.data = function(key, value) {
                        this.cache = this.cache || {};
                        if (key && value) {
                            this.cache[key] = value;
                            //eval('(this.cache.'+key+'="'+value+'")');
                        } else {
                            //return eval('this.cache.'+key);
                            return this.cache[key];
                        }
                    }
                }
            }

            for (var i = 0; i < this.length; i++) {                //each氐
                if (typeof fn == 'function') {
                    fn.call(this[i], i, this[i]);
                } else {                            //data莼
                    this[i].data = function(key, value) {
                        this.cache = this.cache || {};
                        if (key && value) {
                            //eval('(this.cache.'+key+'="'+value+'")');
                            this.cache[key] = value;
                        } else {
                            //return eval('this.cache.'+key);
                            return this.cache[key];
                        }
                    }
                }
            }
        };

        //支旨虾头羌
        ele.col.bind = function(typ, fn) {
            var evr = function() { fn.call(this, window.event); }; //屑没

            if (this.length) {
                for (var i = 0; i < this.length; i++) {
                    if (typeof fn == 'function') {
                        eval((isIE ? "this[i].on" : (isFireFox ? "this[i]." : "noneEvent.")) + typ + "=" + evr);
                        if (isFireFox) {//莼
                            this[i].addEventListener(typ, evr, false);
                        }
                    }
                    if (isChrome) {
                        eval("this.on" + typ + "=" + evr);
                    }
                }
            } else {//id取玫
                eval((isIE ? "this.on" : (isFireFox ? "this." : "noneEvent")) + typ + "=" + evr);
                if (isFireFox) {//莼
                    this.addEventListener(typ, evr, false);
                }
                if (isChrome) {
                    eval("this.on" + typ + "=" + evr);
                }
            }
        };

        //ele.col羌希堑元兀取elementhtml
        ele.col.html = function(htm) {
            if (htm == '' || htm) {
                this.innerHTML = htm;
            } else {
                return this.innerHTML;
            }
        };

        //ele.col羌希堑元
        ele.col.css = function(sty, val) {
            if (typeof sty == 'object') {
                for (var key in sty) {
                    this.style[key] = sty[key];
                }
            } else if (typeof sty == 'string' && typeof val == 'string') {
                try {
                    this.style[sty] = val;
                }
                catch (e) {
                }
            } else {
                return this.style[sty];
            }
        };

        ele.col.append = function(elem) {
            this.appendChild(elem);
        };

        ele.col.prepend = function(elem) {
            this.insertBefore(elem, $(this).first());
        }

        ele.col.after = function(elem) {
            var tem = $.html("");
            $(this).parent().append(tem);
            $(this).parent().insertBefore(elem, tem);
            document.body.appendChild(tem);
        }

        ele.col.before = function(elem) {
            $(this).parent().insertBefore(elem, this);
        }

        ele.col.hasClass = function(className) {
            var state = false;
            var arr = this.className.split(' ');
            $(arr).each(function(k, v) {
                if (v && v.toString() == className) {
                    state = true;
                }
            });

            return state;
        }

        ele.col.addClass = function(className) {
            var arr = this.className.split(' ');
            var state = false;
            $(arr).each(function(k, v) {
                if (v && v.toString() == className) {
                    state = true;
                }
            });
            if (state) return;

            this.className = this.className.trim();
            this.className += " " + className;
        }

        ele.col.removeClass = function(className) {
            var arr = this.className.split(' ');
            $(arr).each(function(k, v) {
                if (v && v.toString() == className) {
                    arr[k] = "";
                }
            });

            this.className = arr.join(' ').trim(); //this.className.toLowerCase().replace(className,"");
        }

        ele.col.replaceClass = function(newName, oldName) {
            this.removeClass(oldName);
            this.addClass(newName);
        }

        //绾ц仈鏌ユ壘鍏冪礌
        ele.col.find = function(tagName) {
            if (tagName.indexOf("#") >= 0)
                return $(tagName);
            if ("div,span,a,input,table,tr,td,button".indexOf(tagName) >= 0)
                return $(this.getElementsByTagName(tagName));

            var eleCollection = [];
            var nodeCol = this.getElementsByTagName("*");
            var allEle = $(tagName);
            $(allEle).each(function(key, val) {
                $(nodeCol).each(function(k, v) {
                    if (val == v)
                        eleCollection.push(v);
                });
            });

            return $(eleCollection);
        }

        ele.col.toggle = function(fn1, fn2) {
            this.bind('click', function() {
                if ($(this).data('state') == undefined) {
                    $(this).data('state', "false");
                }

                if (typeof fn1 == 'function' && typeof fn2 == 'function') {
                    if ($(this).data('state') == 'true') {
                        $(this).data('state', 'false');
                        fn2.call(this, fn2.arguments);
                    } else {
                        $(this).data('state', 'true');
                        fn1.call(this, fn1.arguments);
                    }
                }
            });
        }

        ele.col.removeData = function(attrName) {
            if ($(this).cache) {
                return delete $(this).cache[attrName];
            }
            return false;
        };

        ele.col.attr = function(k, v) {
            if (k && v)
                this.setAttribute(k, v);
            else
                return this.getAttribute(k);
        }

        ele.col.removeAttr = function(k) {
            return this.removeAttribute(k);
        }

        ele.col.val = function(str) {
            if (!this.tagName) {              //鏄竴涓猦tmlCollection
                if (str) {
                    this.each(function(k, v) {
                        $(str).each(function(key, val) {
                            if (v.value == val) {
                                v.checked = true;
                            }
                        });
                    });
                } else {//杩斿洖閫変腑鐨勮妭鐐?
                    var selectedCollection = [];
                    this.each(function(k, v) {
                        if (v.checked)
                            selectedCollection.push(v);
                    });
                    return $(selectedCollection);
                }

                return;
            }

            switch (this.tagName.toLowerCase()) {//璁剧疆鍗曚釜鍏冪礌
                case 'input':
                    switch ($(this).attr('type')) {
                        case 'button':
                        case 'text':
                        case 'area':
                            if (str) {
                                $(this).attr('value', str);
                            } else {
                                return this.value;
                            }
                            break;
                        case 'radio':
                        case 'checkbox':
                            if (str) {
                                $(this).attr('checked', str);
                            } else {
                                return this.checked ? true : false;
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                case 'select':
                    var me = this;
                    if (str) {
                        $(this.options).each(function(k, v) {
                            if (me[k].value.toString() == str.toString()) {
                                me.selectedIndex = k;
                            }
                        });
                    } else {
                        return this.options[this.selectedIndex].value;
                    }
                    break;
                case 'textarea':
                    if (str) {
                        $(this).attr('value', str);
                    } else {
                        return this.value;
                    }
                    break;
                default:
                    break;
            }
        }

        ele.col.hasChild = function() {
            return this.hasChildNodes();
        }

        ele.col.prev = function() {
            var fNode = null;
            var findNodes = function(node) {
                if (node.previousSibling) {
                    if (node.previousSibling.nodeType != 1) {
                        findNodes(node.previousSibling);
                    } else {
                        fNode = node.previousSibling;
                    }
                } else {
                    return null;
                }
            }

            findNodes(this);
            return $(fNode);
        }

        ele.col.next = function() {
            var fNode = null;
            var findNodes = function(node) {
                if (node.nextSibling) {
                    if (node.nextSibling.nodeType != 1) {
                        findNodes(node.nextSibling);
                    } else {
                        fNode = node.nextSibling;
                    }
                } else {
                    return null;
                }
            }

            findNodes(this);
            return $(fNode);
        }

        ele.col.first = function() {
            var fNode = null;
            var findNodes = function(node) {
                if (node && node.nodeType != 1) {
                    findNodes(node.nextSibling);
                }
                else {
                    fNode = node;
                }
            }

            findNodes(this.firstChild);
            return $(fNode);
        }

        ele.col.last = function() {
            var fNode = null;
            var findNodes = function(node) {
                if (node && node.nodeType != 1) {
                    findNodes(node.previousSibling);
                }
                else {
                    fNode = node;
                }
            }

            findNodes(this.lastChild);
            return $(fNode);
        }

        ele.col.parent = function() {
            return $(this.parentNode);
        }

        ele.col.siblings = function() {
            var fNode = $(this).parent().child();
            var me = this;
            $(fNode).each(function(k, v) {
                if (v == me) {
                    fNode.del(k, 1);
                }
            });

            return $(fNode);
        }

        ele.col.child = function() {
            var fNode = [];
            for (var i = 0; i < this.childNodes.length; i++) {
                if (this.childNodes[i].nodeType == 1) {
                    fNode.push(this.childNodes[i]);
                }
            }

            return $(fNode);
        }

        ele.col.remove = function() {
            $(this).each(function(k, v) {
                $(v).parent().removeChild(v);
            });
        }

        ele.col.nextAll = function() {
            var fNode = [];
            var findNodes = function(node) {
                if (node && node.nodeType != 1) {
                    findNodes(node.nextSibling);
                }
                else {
                    if (node) {
                        findNodes(node.nextSibling);
                        fNode.push(node);
                    }
                }
            }

            findNodes($(this).next());
            return $(fNode);
        }

        ele.col.prevAll = function() {
            var fNode = [];
            var findNodes = function(node) {
                if (node && node.nodeType != 1) {
                    findNodes(node.previousSibling);
                }
                else {
                    if (node) {
                        findNodes(node.previousSibling);
                        fNode.push(node);
                    }
                }
            }

            findNodes($(this).prev());
            return $(fNode);
        }

        ele.col.slideUp = function() {
            if (this.css('height') == '0px') {   //瑙ｅ喅ie杩炵画闅愯棌鎶ラ敊闂
                return;
            }
            var obj = {
                ele: this,
                startHeight: this.offsetHeight == 0 ? parseInt(this.style.height.substring(0, this.style.height.indexOf('px'))) : this.offsetHeight,
                i: 1,
                endHeight: 1
            };

            this.data('slideUpHeight', obj.startHeight);
            obj.ele.css("height", obj.startHeight + 'px');
            obj.ele.css('overflow', 'hidden');

            $.animateQueue.insert($.animateQueue.length, { state: false, ele: this });
            $.wait(this, function() {
                var id = window.setInterval(function() {
                    (function(o) {
                        o.startHeight -= obj.i * (isIE ? 1 : 0.06);
                        obj.i++;

                        if (o.startHeight > 10)
                            obj.ele.css("height", o.startHeight + "px");
                        else {
                            obj.endheight = obj.endHeight * (isIE ? 2 : 0.12);
                            var h = obj.ele.css("height");
                            obj.ele.css("height", (parseInt(h.substring(0, h.indexOf('px'))) - obj.endHeight) + 'px');
                            if (parseInt(obj.ele.css('height').substring(0, 2)) <= 0) {
                                obj.ele.css("height", '0px');
                                obj.ele.css('display', 'none');
                                window.clearInterval(id);
                            }
                        }
                    })(obj);
                }, 1);
                if ($.animateQueue.length > 1) {
                    $.animateQueue[1].state = true;
                }
                $.animateQueue.del(0, 1);
            });
        }

        ele.col.slideDown = function() {
            this.css('display', 'block');
            this.css('overflow', 'hidden');

            var obj = { ele: this, startHeight: 1, i: 1, endHeight: (this.data('slideUpHeight') ? this.data('slideUpHeight') : parseInt(this.style.height.substring(0, this.style.height.indexOf('px')))) };
            if (obj.endHeight <= 0) {
                obj.endHeight = this.offsetHeight;
                alert(obj.endHeight);
            }
            obj.ele.css("height", '0px');
            obj.ele.css('overflow', 'hidden');
            obj.ele.css('display', 'block');

            $.animateQueue.insert($.animateQueue.length, { state: false, ele: this });
            $.wait(this, function() {
                var id = window.setInterval(function() {
                    (function(o) {
                        if (o.startHeight < obj.endHeight - 10) {
                            o.startHeight += obj.i * (isIE ? 1 : 0.06);
                            obj.i++;
                            obj.ele.css("height", o.startHeight + "px");
                        } else {
                            var ii = o.startHeight++;
                            obj.ele.css("height", ii + 'px');
                            if (parseInt(obj.ele.css('height').substring(0, obj.ele.css('height').indexOf('px'))) > obj.endHeight) {
                                obj.ele.css('height', obj.endHeight + "px");
                                window.clearInterval(id);
                            }
                        }
                    })(obj);
                }, 1);

                if ($.animateQueue.length > 1) {
                    $.animateQueue[1].state = true;
                }
                $.animateQueue.del(0, 1);
            });
        }

        ele.col.empty = function() {
            this.innerHTML = "";
        }

        /*ele.col.width = function() {
            return this.offsetWidth;
        }

        ele.col.height = function() {
            return this.offsetHeight;
        }*/

        ele.col.paddingLeft = function() {
            if (isIE) {
                return window.event.offsetX;
            } else if (isFireFox) {
                return $.window.x() - this.left();
            } else if (isChrome) {
                return window.event.offsetX;
            }
        };

        ele.col.paddingTop = function() {
            if (isIE) {
                return window.event.offsetY;
            } else if (isFireFox) {
                return $.window.y() - this.top();
            } else if (isChrome) {
                return window.event.offsetY;
            }
        };

        ele.col.left = function() {
            if (isIE) {
                return $.window.x() - window.event.offsetX;
            } else if (isFireFox) {
                return $.window.x() - window.event.layerX + $.window.target().offsetLeft;
            } else if (isChrome) {
                return $.window.x() - window.event.offsetX;
            }
        }

        ele.col.top = function() {
            if (isIE) {
                return $.window.y() - window.event.offsetY;
            } else if (isFireFox) {
                return $.window.y() - window.event.layerY + $.window.target().offsetTop;
            } else if (isChrome) {
                return $.window.y() - window.event.offsetY;
            }
        }

        ele.col.clone = function(state) {
            return this.cloneNode(state);
        }

        //蠖ɑ
        ele.col.each();

        return ele.col;
    };

    //id选
    _$.prototype.id = function(selector) {
        if (selector.indexOf('#') > -1) {
            return document.getElementById(selector.trim().replace(/#/, ''));
        }
    }

    //class选
    _$.prototype.cls = function(selector) {
        if (selector.indexOf('.') > -1) {
            var eleCollection = [];
            var allEle = document.body.getElementsByTagName('*');
            for (var i = 0; i < allEle.length; i++) {
                if (allEle[i].className && allEle[i].className.indexOf(selector.trim().replace(/^./, '')) > -1) {
                    eleCollection.push(allEle[i]);
                }
            }
            return eleCollection;
        }

        return [];
    }

    //元选
    _$.prototype.ele = function(selector) {
        var eleCollection = [];
        var allEle = document.body.getElementsByTagName('*');
        for (var i = 0; i < allEle.length; i++) {
            if (allEle[i].tagName.toString().toUpperCase() == selector.toString().toUpperCase()) {
                eleCollection.push(allEle[i]);
            }
        }
        return eleCollection;
    }

    _$.prototype.htmlEle = function(selector) {
        return selector;
    }

    _$.html = function(htm) {
        if (htm.toLowerCase().indexOf("<") != 0) {
            return document.createTextNode(htm);
        }

        if (htm.toLowerCase().indexOf('thead') == 1) {
            return document.createElement('thead');
        };
        if (htm.toLowerCase().indexOf('tbody') == 1) {
            return document.createElement('tbody');
        };
        if (htm.toLowerCase().indexOf('tfoot') == 1) {
            return document.createElement('tfoot');
        };
        if (htm.toLowerCase().indexOf('th') == 1) {
            var text = htm.toLowerCase().substring(4, htm.length - 5);
            var th = document.createElement('th');
            th.appendChild(document.createTextNode(text));
            return th;
        };
        if (htm.toLowerCase().indexOf('td') == 1) {
            var text = htm.toLowerCase().substring(4, htm.length - 5);
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(text));
            return td;
        };
        if (htm.toLowerCase().indexOf('tr') == 1) {
            return document.createElement('tr');
        };

        var _div = document.createElement('div');
        if (typeof htm == 'string') {
            _div.innerHTML = htm;
            return _div.firstChild;
        }
        return null;
    }

    _$.ajax = function(obj) {
        switch (obj.type.toLowerCase()) {
            case "post":
                this.post(obj);
                break;
            case "get":
                this.get(obj);
                break;
            default:
                break;
        }
    }

    _$.get = function(obj) {//{url,data,fn beforsend,fn sending,fn success,fn error}
        httpRequ = httpRequest();
        if (!httpRequ) {
            alert("浣犵殑娴忚鍣ㄤ笉鏀寔ajax");
            return;
        }

        httpRequ.onreadystatechange = function() {
            if (httpRequ.readyState == 3) {//鏁版嵁浼犺緭涓?
                if (obj.sending) {
                    obj.sending();
                }
            }
            if (httpRequ.readyState == 4) {
                if (httpRequ.status == 200) {
                    var string = httpRequ.responseText;
                    if (obj.success) {
                        obj.success(string);
                    }
                } else {
                    var str = "";
                    if (httpRequ.status.toString().indexOf('5') == 0) {
                        str = '鏈嶅姟鍣ㄥ唴閮ㄩ敊璇?';
                    } else if (httpRequ.status.toString().indexOf('4') == 0) {
                        str = '瀹㈡埛绔敊璇?';
                    }

                    if (obj.error) {
                        obj.error(str);
                    }
                }
            }
        }

        httpRequ.open('GET', obj.url, false);
        if (obj.beforSend) {
            obj.beforSend();
        }
        httpRequ.send();
    }

    _$.post = function(obj) {
        httpRequ = httpRequest();
        if (!httpRequ) {
            alert("浣犵殑娴忚鍣ㄤ笉鏀寔ajax");
            return;
        }

        httpRequ.onreadystatechange = function() {
            if (httpRequ.readyState == 3) {//鏁版嵁浼犺緭涓?
                if (obj.sending) {
                    obj.sending();
                }
            }
            if (httpRequ.readyState == 4) {
                if (httpRequ.status == 200) {
                    var string = httpRequ.responseText;
                    if (obj.success) {
                        obj.success(string);
                    }
                } else {
                    var str = "";
                    if (httpRequ.status.toString().indexOf('5') == 0) {
                        str = '鏈嶅姟鍣ㄥ唴閮ㄩ敊璇?';
                    } else if (httpRequ.status.toString().indexOf('4') == 0) {
                        str = '瀹㈡埛绔敊璇?';
                    }

                    if (obj.error) {
                        obj.error(str == "" ? "鏈煡閿欒" : str);
                    }
                }
            }
        }

        httpRequ.open('POST', obj.url, false);
        if (obj.beforSend) {
            obj.beforSend();
        }

        httpRequ.send(obj.data);
    }

    _$.json = function(obj) {
        return eval('(' + obj + ')');
    }

    _$.jsonToString = function(o) {
        if (o == undefined) {
            return "";
        }
        var r = [];
        if (typeof o == "string") return "\"" + o.replace(/([\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
        if (typeof o == "object") {
            if (!o.sort) {
                for (var i in o)
                    r.push(i + ":" + _$.jsonToString(o[i]));
                if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                    r.push("toString:" + o.toString.toString());
                }
                r = "{" + r.join() + "}"
            } else {
                for (var i = 0; i < o.length; i++)
                    r.push(_$.jsonToString(o[i]))
                r = "[" + r.join() + "]";
            }
            return r;
        }
        return o.toString().replace(/\"\:/g, '":""');
    }

    _$.stopEvent = function(e) {
        if (event.stopPropagation) event.stopPropagation();
        else event.cancelBubble = true;
    }

    _$.intervalSend = function(interval, obj, fn) {
        return window.setInterval(function() { fn(obj); }, interval, obj);
    }

    _$.ready = function(fn) {
        this.state = false;
        var id = window.setInterval(function() {
            (function() {
                if (document.body) {
                    window.clearInterval(id);
                    if (!this.state) {
                        this.state = true;
                        fn.call();
                    }
                }
            })();
        }, 1);
    }

    //鍔ㄧ敾涓撶敤
    _$.animateQueue = [];
    _$.wait = function(ele, fn) {
        window.setTimeout(function() {
            if (_$.animateQueue.length >= 1) {
                _$.animateQueue[0].state = true;
            }

            var id = window.setInterval(function() {
                (function() {
                    if (_$.animateQueue[0].state && _$.animateQueue[0].ele == ele) {
                        window.clearInterval(id);
                        fn.call(ele);
                    }
                })();
            }, 1)
        }, 200);

    }

    _$.window = {
        x: function() {                        //相对于body左上角的距离
            if (isIE) {
                return window.event.x;
            } else if (isFireFox) {
                return window.event.pageX;
            } else if (isChrome) {
                return window.event.x;
            }
        },
        y: function() {
            if (isIE) {
                return window.event.y;
            } else if (isFireFox) {
                return window.event.pageY;
            } else if (isChrome) {
                return window.event.y;
            }
        },
        clientX: function() {                    //相对于body左上角的距离,不包括边框
            return window.event.clientX;
        },
        clientY: function() {
            return window.event.clientY;
        },
        width: function() {
            return window.event.clientWidth;
        },
        height: function() {
            if (window.event) {
                return window.event.clientHeight;
            } else {
                return $(document.body).height();
            }
        },
        fromElement: function() {
            if (isIE) {
                return window.event.fromElement;
            } else if (isFireFox) {
                return window.event.relatedTarget;
            }
        },
        toElement: function() {
            if (isIE) {
                return window.event.srcElement;
            } else if (isFireFox) {
                return window.event.target;
            }
        },
        target: function() {
            if (isIE) {
                return window.event.srcElement;
            } else if (isFireFox) {
                return window.event.target;
            }
        }
    }

    //展涌
    _$.extend = function(fnName, fn) {
        eval("_$." + fnName + "=" + fn);
    };

    win.$ = _$;
})(window);