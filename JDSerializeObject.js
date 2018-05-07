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

            //如果只是普通节点，没有父子节点的话，直接就绑定对应的值，不做其他处理
            if (curElement.name.indexOf(".") === -1) {
                bind(parent, curElement);
                return;
            }

            var firstLevelElementName = curElement.name.substring(0,curElement.name.indexOf("."));
            var firstLevelNode = parent[firstLevelElementName];
            if('undefined' === typeof firstLevelNode || firstLevelNode === null){
                firstLevelNode = {};
            }
            var otherSonElement = {
                name:curElement.name.substring(curElement.name.indexOf(".") + 1),
                value:curElement.value
            };

            extend(firstLevelNode,otherSonElement);

            parent[firstLevelElementName] = firstLevelNode;
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
