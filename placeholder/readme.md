Placeholder UI
=========================
HTML5의 `placeholder` 속성(attribute)을 지원하지 않는 브라우저에 대해 WAI-ARIA를 이용하여 지원할 수 있도록 해주는 플러그인입니다.

* `placeholder` 속성(attribute)을 지원하는 브라우저에서는 native 기능을 사용하며, 어떠한 동작도 하지 않습니다.
* pure JavaScript로 작성되었기 때문에 타 라이브러리 혹은 프레임워크에 대한 의존성을 가지지 않습니다.

## 적용된 WAI-ARIA 설명
Internet Explorer 8, 9 (이하 IE8, 9) 에서는 HTML5의 Placeholder 기능이 동작하지 않기 때문에, 
이 브라우저 상에서 Screen Reader를 사용할 경우 해당 내용을 들을 수 없습니다.

이를 해결하기 위한 방법으로, 
WAI-ARIA의 aria-describedby 속성(attribute)를 사용할 수 있고
mulder21c-placeholder.js를 IE8, 9에서 적용할 경우,
아래와 같은 마크업을 얻을 수 있습니다.

**Before *mulder21c-placeholder.js* applied.**

```html 
<label for="user-name"> 
    아이디
</label> 
<input id="user-name" 
       name="user-id" 
       placeholder="홍길동" 
       type="text">
```

**After *mulder21c-placeholder.js* applied.**

```html 
<label for="user-name"> 
    아이디
</label> 
<input id="user-name" 
       name="user-id" 
       placeholder="홍길동" 
       type="text" 
       aria-describedby="mulder21c-username1496018449239" >
<span class="mulder21c-placeholder" 
      style="margin-left:-33px;left:-205px" 
      id="mulder21c-username1496018449239" >
    홍길동
</span>
```
`<input>` 요소(element)에 추가된 aria-describedby 속성(attribute)와 
그 값과 동일한 값을 `id`로 가지는 `<span>` 요소(element)에 의해
Screen Reader가 `<input>` 요소(element)에 접근 시 `<span>` 요소(element)의 콘텐트를 읽어주게 됩니다.

## Support Browser
Chrome, Firefox, IE 8+

## How to use
### Step1 : Create HTML markup
You only need to write in HTML5. No other is needed for placeholder.

```html
<label for="user-email">이메일</label>
<input type="text" name="user-email" id="user-email" placeholder="example@mydoamin.com">

...

<script src="/js/mulder21c-placeholder.js"></script>
```

### Step2 : Create CSS

```css
::-webkit-input-placeholder{
    font-size:.75em;
    color:#666;
}
::-moz-placeholder{
    font-size:.75em;
    color:#666;
}
:-ms-input-placeholder{
    font-size:.75em;
    color:#666;
}
:-moz-placeholder{
    font-size:.75em;
    color:#666;
}
/*
 *  1. If you set the classname option, use that as a class selector for the placeholder.
 *  2. If you didn't set the classname option and used the prefix option, 
 *     the selector for the placeholder is .{prefix}-placeholder. 
 *     ex) If you set the prefix option to "ph", the selector is a ".pl-placeholder".
 *  3. Use the "input:focus + .{selector}" and ".{selector}-hidden" as the class selector
 *     to set the style for the invisible state of the placeholder.
 */
.mulder21c-placeholder{
    position:relative;
    font-size:.75em;
    color:#666;
}
input:focus + .mulder21c-placeholder,
.mulder21c-placeholder-hidden{
    overflow:hidden;
    clip:rect(1px,1px,1px,1px);
    position:absolute;
    width:1px;
    height:1px
}
```

### Step 3. Call the Placeholder
You can apply `Placeholder` using the CSS selector.
But, some browsers do not apply to CSS selectors that are not supported.

```javascript
Placeholder({
    selector : "input[placeholder]"
});
```

## Options (and default value)

```javascript
Placeholder({
    selector : "input[placeholder]",    // A selector for the element to which Placeholder applies.
    classname : "",                     // The class name to use as a selector for placeholders in CSS.
    prefix : "mulder21c"                // A prefix to prevent duplication of id, class and etc with other libraries.
});
```
