module.exports = {
    "extends": [
        "stylelint-config-standard-scss",
        "stylelint-config-html"
    ],
    "rules": {
        "indentation": [4], //使用4个空格缩进
        "selector-pseudo-class-no-unknown": null, //允许未知伪类选择器
        "selector-pseudo-element-no-unknown": null, //允许未知伪元素选择器
        "no-empty-source": null, //允许空源
        "selector-class-pattern":null, //允许类选择器自定义命名
        "scss/double-slash-comment-whitespace-inside": null, //允许//注释前后空格
        "no-descending-specificity": null, //允许低优先级的选择器出现在高优先级的选择器之后
        "font-family-no-missing-generic-family-keyword":null, //允许缺少通用字体族关键字
        "function-url-quotes":null, //允许函数URL引号
        "no-duplicate-selectors":null, //允许重复的选择器
        "custom-property-pattern":null, //允许自定义属性自定义命名
        "color-function-notation":null, //允许颜色函数简写
    }
}
