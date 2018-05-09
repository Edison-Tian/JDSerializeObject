(function ($) {
    $.fn.serializeObject = function () {
        "use strict";


        var result = {};
        /**
         * 处理每个元素
         * @param parent        父节点
         * @param curElement    当前元素
         */
        var extend = function (parent, curElement) {

            //用来判断是否是 student[0] 这种
            var arrayNameRegex = /^[a-zA-Z]+[0-9]*\[[0-9]+]$/;
            var hasSon = curElement.name.indexOf(".") !== -1;
            var isArray = hasSon ? arrayNameRegex.test(curElement.name.substring(0,curElement.name.indexOf("."))) : arrayNameRegex.test(curElement.name);
            //一，如果只是普通节点，没有父子节点并且不是xxx[0] 这种，直接就绑定对应的值，不做其他处理
            //例如：name=John
            if (!hasSon && !isArray) {
                bind(parent, curElement);
                return;
            }

            if(isArray){
                var arrayName = curElement.name.substring(0,curElement.name.indexOf("["));
                var curValueArrayIndex = parseInt(curElement.name.substring(curElement.name.indexOf("[")+1 , curElement.name.indexOf("]")));
                var arrayNode = parent[arrayName];
                if(hasSon){
                    //有子节点的
                    //例如：order[0].price=123
                    if('undefined' === typeof arrayNode || arrayNode === null){
                        arrayNode = new Array(curValueArrayIndex + 1);
                    }
                    if(!$.isArray(arrayNode)){
                        arrayNode = [arrayNode];
                    }
                    var sonElement = {
                        name : curElement.name.substring(curElement.name.indexOf(".") + 1),
                        value : curElement.value
                    };
                    //1，先递归下去，把数组中当前这个元素组装好
                    var curArrayObj = arrayNode[curValueArrayIndex];
                    if('undefined' === typeof curArrayObj || curArrayObj === null){
                        curArrayObj = {}
                    }
                    extend(curArrayObj,sonElement);
                    //2，把组装好的当前数组元素根据下标放到数组中
                    arrayNode[curValueArrayIndex] = curArrayObj;
                    //3，把当前数组放到parent中
                    parent[arrayName] = arrayNode;
                }else {
                    //无子节点
                    //例如：name[0]=John
                    if('undefined' === typeof arrayNode || arrayNode === null){
                        arrayNode = new Array(curValueArrayIndex + 1);
                    }
                    if(!$.isArray(arrayNode)){
                        arrayNode = [arrayNode];
                    }
                    arrayNode[curValueArrayIndex] = curElement.value;
                    parent[arrayName] = arrayNode;
                }
            }else {
                var otherSonElement = {};
                var firstLevelNodeName = curElement.name.substring(0,curElement.name.indexOf("."));
                var firstLevelNode = parent[firstLevelNodeName];
                if('undefined' === typeof firstLevelNode || firstLevelNode === null){
                    firstLevelNode = {};
                }
                otherSonElement.name = curElement.name.substring(curElement.name.indexOf(".") + 1);
                otherSonElement.value = curElement.value;

                extend(firstLevelNode,otherSonElement);
                parent[firstLevelNodeName] = firstLevelNode;
            }
        };
        /**
         * 绑定某个节点
         * @param parent    父节点
         * @param element   当前元素
         * @returns {*}     当前元素节点
         */
        var bind = function (parent, element) {
            var curNode = parent[element.name];
            if ('undefined' === typeof curNode || curNode === null) {
                parent[element.name] = element.value;
            } else {
                if ($.isArray(curNode)) {
                    curNode.push(element.value)
                } else {
                    parent[element.name] = [curNode, element.value];
                }
            }
        };


        $.each(this.serializeArray(), function (i, element) {
            extend(result, element);
        });

        return result;
    };
})(jQuery);
