Tab UI
=========================

## TabUI jQuery Plugin

Tab UI에 WAI-ARIA를 적용하는 방법에 대한 설명은 [접근 가능한 탭 UI 만들기](https://mulder21c.github.io/2018/06/04/how-to-make-accessible-tab-content/)에서 
보실 수 있습니다.  
jQuery를 이용하여 절차적으로 설명되어 있으니, 직접 만들어보고 싶으신 분은 위 참고해보시면 어렵지 않게 만들어 보실 수 있습니다.

### 적용된 WAI-ARIA 설명

#### Tab의 기본 동작
- 탭 UI가 초기화 되면, 한 개 탭 패널을 노출시키고 이 탭 패널과 연관된 탭을 활성화 되었다고 표시
- 사용자가 다른 탭을 선택하면, 선택된 탭을 활성화 표시하고, 이전 탭 패널을 숨기고 활성화 된 탭과 연관된 탭 패널을 노출

#### 탭 UI의 키보드 인터랙션

- <kbd>Tab</kbd>: 탭 목록 내부로 초점이 이동할 때, 활성화 되어 있는 탭으로 초점 이동. 탭 목록이 초점을 포함하고 있을 경우, 
탭 패널이나 탭 패널 내부의 첫 번째 초점을 얻을 수 있는 요소로 초점 이동
- 초점이 탭 요소에 있을 때
  + <kbd>Left Arrow</kbd>: 이전 탭으로 초점 이동. 초점이 첫 번째 요소에 있었다면 마지막 탭으로 초점 이동.
  + <kbd>Right Arrow</kbd>: 다음 탭으로 초점 이동. 초점이 마지막 요소에 있었다면 첫 번째 탭으로 초점 이동.
- 탭 목록 내부에 초점이 있을 때
  + <kbd>Space</kbd>, <kbd>Enter</kbd>: 탭 활성화
  + <kbd>Home</kbd>: (선택적 제공) 첫 번째 탭으로 초점 이동
  + <kbd>End</kbd>: (선택적 제공) 마지막 탭으로 초점 이동
  + <kbd>Shift</kbd> + <kbd>F10</kbd>: 탭이 연관된 팝업 메뉴를 가질 경우 메뉴 노출
  + <kbd>Delete</kbd>: (선택적 제공) 탭이 삭제 가능하다면, 탭과 연관된 탭 패널을 모두 삭제하고, 나머지 탭이 존재한다면
  삭제된 다음 탭으로 초점을 이동시키고 활성화.

#### WAI-ARIA Roles, Properties, States

- 탭 목록에 해당하는 요소(element)에 tablist role 부여
  + AT가 "탭 목록"을 인식.
- 탭에 해당하는 요소(element)에 tab role 부여
  + AT가 해당 탭에 접근 시 "탭" 콘텐츠임을 알려주며, 인식 된 tablist role을 통해 총 몇 개의 탭 중 현재 몇 번째 탭을 탐색 
  중인지를 알려줌. ex) "bar 탭 2/3"
- 탭에 대한 콘텐츠 패널에 해당하는 요소(element)에 tabpanel role 부여
  + AT가 해당 패널에 접근 시, "탭 패널" 콘텐츠임을 알려줌.
- 각 탭에 탭과 연관된 탭 패널을 참조하는 aria-controls property 부여
  + AT가 해당 탭 접근 시, 연관된 탭 패널 정보를 인식. 
- 활성화 된 탭에 aria-selected state를 부여하고 true 값 설정, 나머지 탭들에는 false로 설정된 aria-selected state를 부여
  + AT가 aria-selected 상태에 따라 선택된 상태인지 미선택된 상태인지를 인식하고 사용자에게 알려줌. ex) "foo 탭 1/3 선택됨"
- 각 탭 패널에 이 패널과 연관된 탭 요소를 참조하는 aria-labelledby property 부여
  + AT가 접근한 "탭 패널" 콘텐츠의 label을 참조 인식하여 어떤 탭의 패널인지 사용자에게 알려줌. ex) "foo 속성 페이지"


### How to use
#### example 1 - tab without link
```html
<div class="mulder21c-tabui">
  <ul class="tablist">
    <li id="tab1" data-controls="tabpanel1" class="tab">메뉴</li>
    <li id="tab2" data-controls="tabpanel2" class="tab">메뉴</li>
    <li id="tab3" data-controls="tabpanel3" class="tab">메뉴</li>
  </ul>
  <div id="tabpanel1" class="tabpanel">
    ...
  </div>
  <div id="tabpanel2" class="tabpanel">
    ...
  </div>
  <div id="tabpanel3" class="tabpanel">
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
  <div id="tabpanel1" class="tabpanel">
    ...
  </div>
  <div id="tabpanel2" class="tabpanel">
    ...
  </div>
  <div id="tabpanel3" class="tabpanel">
    ...
  </div>
</div>
```
```javascript
$(".mulder21c-tabui").TabUI();
```
* tab 요소에는 data-controls의 값으로 연결된 tabpanel의 ID 입력 <br />
* tab 요소가 anchor(a) 요소일 경우 data-controls 대신 href 값으로 이용 가능

### Options
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