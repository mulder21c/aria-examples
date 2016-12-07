Tab UI
=========================

## TabUI jQuery Plugin

### 적용된 WAI-ARIA 설명
차후 기재 예정

### How to use
#### example 1 - tab without link
```html
<div class="mulder21c-tabui">
	<ul class="tablist">
		<li id="tab1" data-controls="tabpanel1" class="tab">메뉴</li>
		<li id="tab2" data-controls="tabpanel2" class="tab">메뉴</li>
		<li id="tab3" data-controls="tabpanel3" class="tab">메뉴</li>
	</ul>
	<div id="tabpanel1" class="tabpanel" data-focusable-content="false">
		...
	</div>
	<div id="tabpanel2" class="tabpanel" data-focusable-content="false">
		...
	</div>
	<div id="tabpanel3" class="tabpanel" data-focusable-content="false">
		...
	</div>
</div>
```
```javascript
$(".mulder21c-tabui").TabUI();
```

#### example 2 - tab with link
```html
<div class="mulder21c-tabui">
	<ul class="tablist">
		<li id="tab1" class="tab">
			<a href="#tabpanel1">메뉴</a>
		</li>
		<li id="tab2" class="tab">
			<a href="#tabpanel2">메뉴</a>
		</li>
		<li id="tab3" class="tab">
			<a href="#tabpanel3">메뉴</a>
		</li>
	</ul>
	<div id="tabpanel1" class="tabpanel" data-focusable-content="false">
		...
	</div>
	<div id="tabpanel2" class="tabpanel" data-focusable-content="false">
		...
	</div>
	<div id="tabpanel3" class="tabpanel" data-focusable-content="false">
		...
	</div>
</div>
```
```javascript
$(".mulder21c-tabui").TabUI();
```
* tab 요소에는 data-controls의 값으로 연결된 tabpanel의 ID 입력 <br />
* tab 요소가 anchor(a) 요소일 경우 data-controls 대신 href 값으로 이용 가능
* tab pannel이 focusable 요소로 구성 될 경우 data-focusable-content를 true로 설정 <br />
  (tab pannel로 진입 시 첫 번째 focusable 요소가 focus를 얻음)
* tab pannel이 texture 콘텐트일 경우  data-focusable-content를 false로 설정 <br />
  (tab pannel로 진입 시 tab panel 자체가 focus를 얻음)

### Options
**useAria**
WAI-ARIA 사용 여부
```
	type : boolean
	default : true
```
**tabListSelector**
selector for the element intented tab-list (grouping tabs)
```
	type : string
	default : ".tablist"
```
**tabSelector**
selector for the elements intented tab
```
	type : string
	default : ".tab"
```
**tabPanelSelector**
selector for the elements intented tab-panel
```
	type : string
	default : ".tabpnel"
```
**activeClass**
the class name intended to indicate active elements
```
	type : string
	default : "active-tab"
```
**startTab**
starting(pre-opened) tab index (zero-based)
```
	type : number
	default : 0
```
**useAria**
whether or not to use WAI-ARIA
```
	type : boolean
	default : true
```