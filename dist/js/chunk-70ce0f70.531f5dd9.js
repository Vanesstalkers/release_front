(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-70ce0f70"],{"04d1":function(e,t,n){var a=n("342f"),r=a.match(/firefox\/(\d+)/i);e.exports=!!r&&+r[1]},"140f":function(e,t,n){},"157e":function(e,t,n){},"379d":function(e,t,n){"use strict";n("157e")},"38bc":function(e,t,n){},"3a17":function(e,t,n){"use strict";n("e830")},4057:function(e,t,n){var a=n("23e7"),r=Math.hypot,i=Math.abs,c=Math.sqrt,o=!!r&&r(1/0,NaN)!==1/0;a({target:"Math",stat:!0,forced:o},{hypot:function(e,t){var n,a,r=0,o=0,s=arguments.length,l=0;while(o<s)n=i(arguments[o++]),l<n?(a=l/n,r=r*a*a+1,l=n):n>0?(a=n/l,r+=a*a):r+=n;return l===1/0?1/0:l*c(r)}})},"44ba":function(e,t,n){},"4e82":function(e,t,n){"use strict";var a=n("23e7"),r=n("59ed"),i=n("7b0b"),c=n("50c4"),o=n("577e"),s=n("d039"),l=n("addb"),u=n("a640"),d=n("04d1"),p=n("d998"),f=n("2d00"),m=n("512c"),g=[],h=g.sort,v=s((function(){g.sort(void 0)})),b=s((function(){g.sort(null)})),y=u("sort"),k=!s((function(){if(f)return f<70;if(!(d&&d>3)){if(p)return!0;if(m)return m<603;var e,t,n,a,r="";for(e=65;e<76;e++){switch(t=String.fromCharCode(e),e){case 66:case 69:case 70:case 72:n=3;break;case 68:case 71:n=4;break;default:n=2}for(a=0;a<47;a++)g.push({k:t+a,v:n})}for(g.sort((function(e,t){return t.v-e.v})),a=0;a<g.length;a++)t=g[a].k.charAt(0),r.charAt(r.length-1)!==t&&(r+=t);return"DGBEFHACIJK"!==r}})),I=v||!b||!y||!k,P=function(e){return function(t,n){return void 0===n?-1:void 0===t?1:void 0!==e?+e(t,n)||0:o(t)>o(n)?1:-1}};a({target:"Array",proto:!0,forced:I},{sort:function(e){void 0!==e&&r(e);var t=i(this);if(k)return void 0===e?h.call(t):h.call(t,e);var n,a,o=[],s=c(t.length);for(a=0;a<s;a++)a in t&&o.push(t[a]);o=l(o,P(e)),n=o.length,a=0;while(a<n)t[a]=o[a++];while(a<s)delete t[a++];return t}})},"512c":function(e,t,n){var a=n("342f"),r=a.match(/AppleWebKit\/(\d+)\./);e.exports=!!r&&+r[1]},"568f":function(e,t,n){"use strict";n("c457")},5899:function(e,t){e.exports="\t\n\v\f\r                　\u2028\u2029\ufeff"},"58a8":function(e,t,n){var a=n("1d80"),r=n("577e"),i=n("5899"),c="["+i+"]",o=RegExp("^"+c+c+"*"),s=RegExp(c+c+"*$"),l=function(e){return function(t){var n=r(a(t));return 1&e&&(n=n.replace(o,"")),2&e&&(n=n.replace(s,"")),n}};e.exports={start:l(1),end:l(2),trim:l(3)}},"642b":function(e,t,n){},7541:function(e,t,n){"use strict";n("d4ff")},"7cc8":function(e,t,n){"use strict";n("8ee0")},"7d36":function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.game._id?n("div",{class:[e.isMobile?"mobile-view":"",e.isLandscape?"landscape-view":"portrait-view"],attrs:{id:"game"},on:{wheel:function(t){return t.preventDefault(),e.zoomGamePlane.apply(null,arguments)}}},[n("tutorial",{attrs:{inGame:!0}}),n("div",{style:Object.assign({},e.gamePlaneCustomStyleData,{opacity:1,transformOrigin:"top"},e.gamePlaneControlStyle),attrs:{id:"gamePlane"}},[e._l(Object.keys(this.game.planeMap),(function(e){return n("plane",{key:e,attrs:{planeId:e}})})),e._l(Object.keys(this.game.bridgeMap),(function(e){return n("bridge",{key:e,attrs:{bridgeId:e}})})),e._l(e.possibleAddPlanePositions,(function(t){return n("div",{key:t.joinPortId+t.joinPortDirect+t.targetPortId+t.targetPortDirect,staticClass:"fake-plane",style:t.style,attrs:{joinPortId:t.joinPortId,joinPortDirect:t.joinPortDirect,targetPortId:t.targetPortId,targetPortDirect:t.targetPortDirect},on:{click:e.addPlane}})}))],2),n("div",{staticClass:"gui game-decks"},[n("div",{staticClass:"wrapper"},[n("div",{staticClass:"game-status-label"},[e._v(e._s(e.statusLabel))]),e._l(e.deckList,(function(t){return n("div",{key:t._id,staticClass:"deck",attrs:{code:t.code}},[t._id&&"Deck[domino]"===t.code?n("div",{staticClass:"hat",on:{click:e.takeDice}},[e._v(" "+e._s(Object.keys(t.itemMap).length)+" ")]):e._e(),t._id&&"Deck[card]"===t.code?n("div",{staticClass:"card-event",on:{click:e.takeCard}},[e._v(" "+e._s(Object.keys(t.itemMap).length)+" ")]):e._e(),t._id&&"Deck[card_drop]"===t.code?n("div",{staticClass:"card-event"},[e._v(" "+e._s(Object.keys(t.itemMap).length)+" ")]):e._e(),t._id&&"Deck[card_active]"===t.code?n("div",{staticClass:"deck-active"},e._l(e.sortActiveCards(Object.keys(t.itemMap)),(function(e){return n("card",{key:e,attrs:{cardId:e,canPlay:!0}})})),1):e._e()])}))],2)]),n("player",{attrs:{playerId:e.currentPlayer,customClass:["gui"],iam:!0,showControls:e.showPlayerControls}}),n("div",{staticClass:"gui players"},e._l(e.playerIds,(function(e,t){return n("player",{key:e,attrs:{playerId:e,customClass:["idx-"+t],showControls:!1}})})),1)],1):e._e()},r=[],i=n("3835"),c=n("1da1"),o=n("5530"),s=(n("96cf"),n("a15b"),n("4e82"),n("b64b"),n("99af"),n("fb6a"),n("d81d"),n("7db0"),n("4057"),n("2f62")),l=n("2226"),u=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.player._id?n("div",{class:["player"].concat(e.customClass,[e.iam?"iam":""],[e.player.active?"active":""])},[n("div",{staticClass:"player-hands"},[e.planeInHandIds.length?n("div",{staticClass:"hand-planes"},e._l(e.planeInHandIds,(function(e){return n("plane",{key:e,attrs:{planeId:e,inHand:!0}})})),1):e._e(),e.iam?n("div",{staticClass:"hand-cards-list"},e._l(e.cardDecks,(function(t){return n("div",{key:t._id,staticClass:"hand-cards"},e._l(Object.keys(t.itemMap),(function(t){return n("card",{key:t,attrs:{cardId:t,canPlay:e.iam}})})),1)})),0):e._e(),n("div",{staticClass:"hand-dices-list"},e._l(e.dominoDecks,(function(t){return n("div",{key:t._id,staticClass:"hand-dices"},[e.iam&&"teamlead"===t.subtype?n("card",{attrs:{card:{name:"teamlead"}}}):e._e(),e.iam&&"flowstate"===t.subtype?n("card",{attrs:{card:{name:"flowstate"}}}):e._e(),e._l(Object.keys(t.itemMap),(function(t){return n("dice",{key:t,attrs:{diceId:t,inHand:!0,iam:e.iam}})}))],2)})),0)]),n("div",{staticClass:"workers"},[n("card-worker",{attrs:{playerId:e.playerId,iam:e.iam,showControls:e.showControls}})],1)]):e._e()},d=[],p=(n("4de4"),function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.plane._id?n("div",{class:["plane",e.activeEvent?"active-event":""].concat(e.plane.customClass,Object.values(e.customClass)),style:e.customStyle,on:{click:function(t){return t.stopPropagation(),function(t){return e.activeEvent?e.choosePlane():e.selectPlane(t)}.apply(null,arguments)}}},[n("div",{staticClass:"zone-wraper"},e._l(e.zoneIds,(function(t){return n("plane-zone",{key:t,attrs:{zoneId:t,linkLines:e.linkLines}})})),1),n("div",{staticClass:"port-wraper"},e._l(e.portIds,(function(t){return n("plane-port",{key:t,attrs:{portId:t,linkLines:e.linkLines}})})),1),e.cardPlane?e._e():n("div",{staticClass:"custom-bg",attrs:{div:""}},e._l(e.customBG(e.plane._id),(function(e){return n("span",{key:e.code,style:"background-position-x: "+e.x+"; background-position-y: "+e.y})})),0),n("svg",e._l(Object.entries(e.linkLines),(function(e){var t=e[0],a=e[1];return n("line",{key:t,attrs:{x1:a.x1,y1:a.y1,x2:a.x2,y2:a.y2,fill:"none",stroke:"yellow","stroke-width":"10"}})})),0)]):e._e()}),f=[],m=(n("caad"),n("2532"),n("159b"),function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.zone._id?n("div",{class:["zone",e.zone.vertical?"vertical":"",e.zone.available?"available":""],style:{left:e.zone.left+"px",top:e.zone.top+"px",color:"white",fontSize:"10px"},on:{click:e.putDice}},[n("div",{staticClass:"scroll-off wraper"},[n("plane-zone-sides",{attrs:{linkLines:e.linkLines,sideList:e.zone.sideList,position:{left:e.zone.left,top:e.zone.top,vertical:e.zone.vertical}}}),e._l(Object.keys(e.zone.itemMap),(function(e){return n("dice",{key:e,attrs:{diceId:e}})}))],2)]):e._e()}),g=[],h=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"sideList"},e._l(e.sideList,(function(t,a){return n("div",{key:t._id,class:["side"+a],attrs:{index:a,id:t._id,code:t.code,x:e.position.left+(e.position.vertical||0===a?36:108),y:e.position.top+(e.position.vertical?0===a?36:108:36)}})})),0)},v=[],b=n("b85c"),y=(n("a9e3"),{props:{sideList:Array,position:{left:Number,top:Number},linkLines:Object},methods:{},mounted:function(){var e=this;this.$nextTick((function(){var t,n=Object(b["a"])(e.sideList);try{for(n.s();!(t=n.n()).done;)for(var a=t.value,r=document.getElementById(a._id),i=0,c=Object.keys(a.links);i<c.length;i++){var o=c[i],s=document.getElementById(o);if(r.closest(".plane")&&s.closest(".plane")){var l=r.getAttribute("x"),u=r.getAttribute("y"),d=s.getAttribute("x"),p=s.getAttribute("y"),f=[[l,u].join("."),[d,p].join(".")].sort().join(".");e.$set(e.linkLines,f,{x1:l,y1:u,x2:d,y2:p})}}}catch(m){n.e(m)}finally{n.f()}}))}}),k=y,I=(n("d468"),n("2877")),P=Object(I["a"])(k,h,v,!1,null,"6ba0e0c1",null),_=P.exports,j=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.dice._id?n("div",{class:["domino-dice",e.dice.deleted?"deleted":"",e.locked?"locked":"",e.activeEvent?"active-event":"",e.hide?"hide":""],attrs:{code:e.dice.code},on:{click:function(t){return t.stopPropagation(),function(t){return e.activeEvent?e.chooseDice():e.pickDice()}.apply(null,arguments)}}},[e.locked?e._e():n("div",{staticClass:"controls"},[n("div",{class:["scroll-off","control rotate",e.dice.deleted?"hidden":""],on:{click:function(t){return t.stopPropagation(),e.rotateDice.apply(null,arguments)}}},[n("font-awesome-icon",{staticStyle:{color:"#f4e205"},attrs:{icon:["fas","rotate"],size:"2xl"}})],1),n("div",{class:["scroll-off","control","fake-rotate","disabled",e.dice.deleted?"hidden":""],on:{click:function(e){e.stopPropagation()}}},[n("font-awesome-icon",{staticStyle:{color:"#ccc"},attrs:{icon:["fas","rotate"],size:"2xl"}})],1),n("div",{class:["scroll-off","control","disabled",e.replaceAllowed||e.dice.deleted?"hidden":""]},[n("font-awesome-icon",{staticStyle:{color:"#ccc"},attrs:{icon:["fass","trash"],size:"2xl"}})],1),n("div",{class:["scroll-off","control",e.replaceAllowed&&!e.dice.deleted?"":"hidden"],on:{click:function(t){return t.stopPropagation(),e.deleteDice.apply(null,arguments)}}},[n("font-awesome-icon",{staticStyle:{color:"#f4e205"},attrs:{icon:["fass","trash"],size:"2xl"}})],1),n("div",{class:["scroll-off","control",e.replaceAllowed&&e.dice.deleted?"":"hidden"],on:{click:function(t){return t.stopPropagation(),e.restoreDice.apply(null,arguments)}}},[n("font-awesome-icon",{staticStyle:{color:"#f4e205"},attrs:{icon:["fas","trash-arrow-up"],size:"2xl"}})],1)]),e._l(e.sideList,(function(t){return[n("div",{key:t._id,class:["el",t.activeEvent?"active-event":"",t.eventData.fakeValue?"fake-value":""],attrs:{id:t._id,value:t.value},on:{click:function(n){return t.activeEvent?(n.stopPropagation(),e.openDiceSideValueSelect(t._id)):null}}},[e.selectedDiceSideId===t._id?n("dice-side-value-select",{on:{select:e.pickActiveEventDiceSide}}):e._e()],1)]}))],2):e._e()},w=[],x=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"select-side-value"},[n("div",{staticClass:"el",attrs:{value:"0"},on:{click:function(t){return e.selectValue(t,0)}}}),n("div",{staticClass:"el",attrs:{value:"1"},on:{click:function(t){return e.selectValue(t,1)}}}),n("div",{staticClass:"el",attrs:{value:"2"},on:{click:function(t){return e.selectValue(t,2)}}}),n("div",{staticClass:"el",attrs:{value:"3"},on:{click:function(t){return e.selectValue(t,3)}}}),n("div",{staticClass:"el",attrs:{value:"4"},on:{click:function(t){return e.selectValue(t,4)}}}),n("div",{staticClass:"el",attrs:{value:"5"},on:{click:function(t){return e.selectValue(t,5)}}}),n("div",{staticClass:"el",attrs:{value:"6"},on:{click:function(t){return e.selectValue(t,6)}}})])},S=[],O={props:{},computed:{},methods:{selectValue:function(e,t){e.stopPropagation(),this.$emit("select",t)}},mounted:function(){}},D=O,C=(n("9b3a"),Object(I["a"])(D,x,S,!1,null,"7d068b7e",null)),A=C.exports,E={components:{diceSideValueSelect:A},props:{diceId:String,inHand:Boolean,iam:Boolean},computed:Object(o["a"])(Object(o["a"])({},Object(s["b"])({getStore:"getStore",currentRound:"currentRound",currentPlayerIsActive:"currentPlayerIsActive",actionsDisabled:"actionsDisabled",selectedDiceSideId:"selectedDiceSideId"})),{},{dice:function(){var e=this.getStore(this.diceId,"dice");return e._id?e:{_id:this.diceId}},sideList:function(){var e=this,t=this.dice.sideList||[{},{}];return t.map((function(t){var n=t._id,a=e.getStore(n,"diceside");return a._id?a:{eventData:{}}}))},locked:function(){return this.dice.locked||this.actionsDisabled},activeEvent:function(){return this.currentPlayerIsActive&&this.dice.activeEvent},hide:function(){return this.inHand&&!this.iam&&!this.dice.visible},replaceAllowed:function(){return this.dice.placedAtRound!==this.currentRound}}),methods:{chooseDice:function(){var e=this;return Object(c["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,api.game.action({name:"eventTrigger",data:{eventData:{targetId:e.diceId,targetPlayerId:e.$parent.playerId}}}).catch((function(e){console.log({err:e}),alert(e.message)}));case 2:case"end":return t.stop()}}),t)})))()},openDiceSideValueSelect:function(e){this.$store.commit("setSelectedDiceSideId",e)},pickActiveEventDiceSide:function(e){var t=this;return Object(c["a"])(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,api.game.action({name:"eventTrigger",data:{eventData:{targetId:t.selectedDiceSideId,fakeValue:e}}}).catch((function(e){console.log({err:e}),alert(e.message)}));case 2:t.$store.commit("setSelectedDiceSideId",null);case 3:case"end":return n.stop()}}),n)})))()},pickDice:function(){var e=this;return Object(c["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(e.iam){t.next=2;break}return t.abrupt("return");case 2:if(!e.locked){t.next=4;break}return t.abrupt("return");case 4:return e.$store.commit("setPickedDiceId",e.diceId),t.next=7,api.game.action({name:"getZonesAvailability",data:{diceId:e.diceId}}).catch((function(e){console.log({err:e}),alert(e.message)}));case 7:case"end":return t.stop()}}),t)})))()},rotateDice:function(){var e=this;return Object(c["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,api.game.action({name:"rotateDice",data:{diceId:e.diceId}}).catch((function(e){console.log({err:e}),alert(e.message)}));case 2:case"end":return t.stop()}}),t)})))()},deleteDice:function(){var e=this;return Object(c["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,api.game.action({name:"deleteDice",data:{diceId:e.diceId}}).catch((function(e){console.log({err:e}),alert(e.message)}));case 2:case"end":return t.stop()}}),t)})))()},restoreDice:function(){var e=this;return Object(c["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,api.game.action({name:"restoreDice",data:{diceId:e.diceId}}).catch((function(e){console.log({err:e}),alert(e.message)}));case 2:case"end":return t.stop()}}),t)})))()}}},R=E,M=(n("90b9"),Object(I["a"])(R,j,w,!1,null,"59c5c82d",null)),T=M.exports,L={components:{planeZoneSides:_,dice:T},props:{zoneId:String,linkLines:Object},computed:Object(o["a"])(Object(o["a"])({},Object(s["b"])({getStore:"getStore",pickedDiceId:"pickedDiceId"})),{},{zone:function(){return this.getStore(this.zoneId,"zone")}}),methods:{putDice:function(){var e=this;return Object(c["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!e.pickedDiceId){t.next=3;break}return t.next=3,api.game.action({name:"replaceDice",data:{diceId:e.pickedDiceId,zoneId:e.zoneId}}).then((function(t){t.gameFinished||(e.$store.commit("setPickedDiceId",null),e.$store.commit("hideZonesAvailability"))})).catch((function(e){console.log({err:e}),alert(e.message)}));case 3:case"end":return t.stop()}}),t)})))()}},mounted:function(){}},z=L,X=(n("379d"),Object(I["a"])(z,m,g,!1,null,"652bed6a",null)),Y=X.exports,$=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.port._id?n("div",{staticClass:"port",style:{left:e.port.left+"px",top:e.port.top+"px",opacity:e.port.linkedBridge?0:1},attrs:{id:e.port.code,x:e.port.left+37.5,y:e.port.top+37.5}}):e._e()},N=[],B={props:{portId:String,linkLines:Object},computed:Object(o["a"])(Object(o["a"])({},Object(s["b"])({getStore:"getStore"})),{},{port:function(){return this.getStore(this.portId,"port")}}),methods:{},mounted:function(){var e=this;this.$nextTick((function(){for(var t=document.getElementById(e.port.code),n=0,a=Object.keys(e.port.links);n<a.length;n++){var r=a[n],i=document.getElementById(r);if(t.closest(".plane")&&i.closest(".plane")){var c=t.getAttribute("x"),o=t.getAttribute("y"),s=i.getAttribute("x"),l=i.getAttribute("y"),u=[[c,o].join("."),[s,l].join(".")].sort().join(".");e.$set(e.linkLines,u,{x1:c,y1:o,x2:s,y2:l})}}}))}},V=B,H=(n("7cc8"),Object(I["a"])(V,$,N,!1,null,"344e6e0c",null)),G=H.exports,F={name:"plane",components:{planePort:G,planeZone:Y},data:function(){return{linkLines:{},customClass:{},inHandStyle:{}}},props:{planeId:String,inHand:Boolean},computed:Object(o["a"])(Object(o["a"])({},Object(s["b"])({getStore:"getStore",currentPlayerIsActive:"currentPlayerIsActive"})),{},{plane:function(){return this.getStore(this.planeId,"plane")},customStyle:function(){var e=Object(o["a"])(Object(o["a"])({},this.plane),this.inHand?this.inHandStyle:{})||{};if(e.left&&(e.left+="px"),e.top&&(e.top+="px"),e.width&&(e.width+="px"),e.height&&(e.height+="px"),e.rotation){var t=90*(e.rotation||0);e.transform="rotate(".concat(t,"deg)"),this.customClass=Object(o["a"])(Object(o["a"])({},this.customClass),{},{rotate:"rotate".concat(t)})}return e},cardPlane:function(){return this.plane.customClass.includes("card-plane")},zoneIds:function(){return Object.keys(this.plane.zoneMap||{})},portIds:function(){return Object.keys(this.plane.portMap||{})},activeEvent:function(){return this.currentPlayerIsActive&&this.plane.activeEvent}}),methods:{selectPlane:function(e){var t=this;return Object(c["a"])(regeneratorRuntime.mark((function n(){var a;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:if(a=e.target.closest(".plane"),!a.closest(".player-hands")){n.next=5;break}return t.$store.commit("setAvailablePorts",[]),n.next=5,api.game.action({name:"getPlanePortsAvailability",data:{joinPlaneId:t.planeId}}).catch((function(e){console.log({err:e}),alert(e.message)}));case 5:case"end":return n.stop()}}),n)})))()},choosePlane:function(){var e=this;return Object(c["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,api.game.action({name:"eventTrigger",data:{eventData:{targetId:e.planeId}}}).catch((function(e){console.log({err:e}),alert(e.message)}));case 2:case"end":return t.stop()}}),t)})))()},customBG:function(e){var t=localStorage.getItem("gamePlaneBackgroundData");if(t)try{t=JSON.parse(t)}catch(r){}t||(t={});var n=t[e];if(n)return n;n=[];for(var a=0;a<18;a++)n[a]={x:-80*Math.floor(14*Math.random())+"px",y:-80*Math.floor(6*Math.random())+"px"};return t[e]=n,localStorage.setItem("gamePlaneBackgroundData",JSON.stringify(t)),n},centerPlaneBackground:function(){var e={},t=document.getElementById("gamePlane"),n=t.getBoundingClientRect();t.querySelectorAll(".plane").forEach((function(t){t.getAttribute("_id");var a=t.getBoundingClientRect(),r=a.top-n.top,i=a.left-n.left;(void 0==e.t||a.top<e.t)&&(e.t=a.top),(void 0==e.b||a.bottom>e.b)&&(e.b=a.bottom),(void 0==e.l||a.left<e.l)&&(e.l=a.left),(void 0==e.r||a.right>e.r)&&(e.r=a.right),(void 0==e.ot||r<e.ot)&&(e.ot=r),(void 0==e.ol||i<e.ol)&&(e.ol=i)}));var a={height:e.b-e.t+"px",width:e.r-e.l+"px",top:"calc(50% - "+((e.b-e.t)/2+1*e.ot)+"px)",left:"calc(50% - "+((e.r-e.l)/2+1*e.ol)+"px)"};this.$store.dispatch("setSimple",{gamePlaneCustomStyleData:a})}},mounted:function(){var e=this;setTimeout((function(){e.inHand?e.customClass=Object(o["a"])(Object(o["a"])({},e.customClass),{},{inHand:"in-hand"}):e.inHandStyle={},e.centerPlaneBackground()}),100)}},U=F,J=(n("7541"),Object(I["a"])(U,p,f,!1,null,"4a12e60d",null)),Z=J.exports,q=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.card._id?n("div",{class:["card-event",e.card.played?"played":""],style:e.customStyle,attrs:{name:e.card.name},on:{click:function(t){return t.stopPropagation(),e.showInfo(e.card.name)}}},[e.canPlay&&e.currentPlayerIsActive&&!e.actionsDisabled&&!e.card.played?n("div",{staticClass:"play-btn",on:{click:function(t){return t.stopPropagation(),e.playCard.apply(null,arguments)}}},[e._v(" Разыграть ")]):e._e()]):e._e()},K=[],W=(n("b0c0"),{props:{cardId:String,canPlay:Boolean},computed:Object(o["a"])(Object(o["a"])({},Object(s["b"])({getStore:"getStore",actionsDisabled:"actionsDisabled",currentPlayerIsActive:"currentPlayerIsActive"})),{},{card:function(){var e=this.getStore(this.cardId,"card");return e._id?e:{_id:this.cardId}},customStyle:function(){var e={backgroundImage:"url(/img/cards/".concat(this.card.name,".jpg)")};return e}}),methods:{playCard:function(){var e=this;return Object(c["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(!e.card.played){t.next=2;break}return t.abrupt("return");case 2:return t.next=4,api.game.action({name:"playCard",data:{cardId:e.cardId}}).catch((function(e){console.log({err:e}),alert(e.message)}));case 4:case"end":return t.stop()}}),t)})))()},showInfo:function(e){api.helper.action({tutorial:"tutorialCardEvent",step:e})}},mounted:function(){}}),Q=W,ee=(n("9026"),Object(I["a"])(Q,q,K,!1,null,null,null)),te=ee.exports,ne=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.player._id?n("div",{class:["card-worker","card-worker-"+e.player.code,e.player.active?"active":"",e.choiceEnabled?"active-event":""],style:e.customStyle,attrs:{id:e.player._id}},[e.showControls&&e.iam&&e.currentPlayerIsActive?n("div",{staticClass:"end-round-btn",on:{click:e.endRound}},[e._v(" Закончить раунд ")]):e._e(),e.player.active&&e.player.timerEndTime?n("div",{staticClass:"end-round-timer"},[e._v(e._s(this.localTimer))]):e._e(),e.iam?e._e():n("div",{staticClass:"card-event"},[e._v(" "+e._s(e.cardDeckCount)+" ")])]):e._e()},ae=[],re={props:{playerId:String,iam:Boolean,showControls:Boolean},data:function(){return{localTimer:null,localTimerUpdateTime:null,localTimerId:null}},computed:Object(o["a"])(Object(o["a"])({},Object(s["b"])({getStore:"getStore",currentPlayerIsActive:"currentPlayerIsActive"})),{},{player:function(){var e=this,t=this.getStore(this.playerId,"player")||{};return t.timerEndTime&&this.localTimerUpdateTime!==t.timerUpdateTime&&(clearTimeout(this.localTimerId),this.localTimer=Math.floor((t.timerEndTime-Date.now())/1e3),this.localTimerUpdateTime=t.timerUpdateTime,this.localTimerId=setInterval((function(){null!==e.localTimer&&(e.localTimer--,e.localTimer<0&&(e.localTimer=0))}),1e3)),t},customStyle:function(){var e={};return e},choiceEnabled:function(){var e;return this.currentPlayerIsActive&&(null===(e=this.player.activeEvent)||void 0===e?void 0:e.choiceEnabled)},cardDeckCount:function(){var e,t=this;return Object.keys((null===(e=Object.keys(this.player.deckMap||{}).map((function(e){return t.getStore(e,"deck")})).filter((function(e){return"card"===e.type&&!e.subtype}))[0])||void 0===e?void 0:e.itemMap)||{}).length||0}}),methods:{endRound:function(){return Object(c["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,api.game.action({name:"endRound"}).catch((function(e){console.log({err:e}),alert(e.message)}));case 2:case"end":return e.stop()}}),e)})))()}},mounted:function(){}},ie=re,ce=(n("a5e1"),Object(I["a"])(ie,ne,ae,!1,null,"2d47ed98",null)),oe=ce.exports,se={components:{plane:Z,dice:T,card:te,cardWorker:oe},props:{customClass:Array,playerId:String,iam:Boolean,showControls:Boolean},data:function(){return{}},computed:Object(o["a"])(Object(o["a"])({},Object(s["b"])({getStore:"getStore",currentPlayer:"currentPlayer",currentPlayerIsActive:"currentPlayerIsActive"})),{},{player:function(){return this.getStore(this.playerId,"player")},dominoDecks:function(){var e=this;return this.deckIds.map((function(t){return e.getStore(t,"deck")})).filter((function(e){return"domino"===e.type}))||[]},cardDecks:function(){var e=this;return this.deckIds.map((function(t){return e.getStore(t,"deck")})).filter((function(e){return"card"===e.type}))||[]},deckIds:function(){return Object.keys(this.player.deckMap||{})},deckCounters:function(){var e,t;return this.iam?null:{domino:Object.keys((null===(e=this.dominoDecks.find((function(e){return!e.subtype})))||void 0===e?void 0:e.itemMap)||{}).length||0,card:Object.keys((null===(t=this.cardDecks.find((function(e){return!e.subtype})))||void 0===t?void 0:t.itemMap)||{}).length||0}},planeInHandIds:function(){var e,t=this;return Object.keys((null===(e=this.deckIds.map((function(e){return t.getStore(e,"deck")})).find((function(e){return"plane"===e.type})))||void 0===e?void 0:e.itemMap)||{})},showDecks:function(){var e;return this.currentPlayerIsActive&&(null===(e=this.player.activeEvent)||void 0===e?void 0:e.showDecks)}}),methods:{},mounted:function(){}},le=se,ue=(n("3a17"),Object(I["a"])(le,u,d,!1,null,"1a5beabe",null)),de=ue.exports,pe=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.bridge._id?n("div",{class:["bridge"].concat(Object.values(e.customClass)),style:e.customStyle,attrs:{id:e.bridge._id}},[n("div",{staticClass:"zone-wraper"},e._l(e.zoneIds,(function(e){return n("plane-zone",{key:e,attrs:{zoneId:e}})})),1)]):e._e()},fe=[],me={name:"bridge",components:{planeZone:Y},props:{bridgeId:String},data:function(){return{customClass:{}}},computed:Object(o["a"])(Object(o["a"])({},Object(s["b"])({getStore:"getStore"})),{},{bridge:function(){return this.getStore(this.bridgeId,"bridge")},customStyle:function(){var e=Object(o["a"])({},this.bridge)||{};if(e.left&&(e.left+="px"),e.top&&(e.top+="px"),e.width&&(e.width+="px"),e.height&&(e.height+="px"),e.rotation){var t=90*(e.rotation||0);e.transform="rotate(".concat(t,"deg)"),this.customClass={rotate:"rotate".concat(t)}}return e},zoneIds:function(){return Object.keys(this.bridge.zoneMap||{})}}),methods:{},mounted:function(){}},ge=me,he=(n("bea6"),Object(I["a"])(ge,pe,fe,!1,null,"a8e970ae",null)),ve=he.exports,be={components:{tutorial:l["a"],player:de,plane:Z,bridge:ve,card:te},data:function(){return{gamePlaneScale:1,gamePlaneTranslateX:0,gamePlaneTranslateY:0,gamePlaneRotation:0,gamePlaneConfig:{isDragging:!1,isTouchMoved:!1,currentX:0,currentY:0,initialX:0,initialY:0,distanceX:0,distanceY:0,initialDistance:0,xOffset:0,yOffset:0,isRotating:!1,initialRotateAngle:0,rotation:0,rotationLast:0},gameId:this.$route.params.id}},computed:Object(o["a"])(Object(o["a"])({},Object(s["b"])({getStore:"getStore",isMobile:"isMobile",isLandscape:"isLandscape",currentPlayer:"currentPlayer",currentPlayerIsActive:"currentPlayerIsActive",gamePlaneCustomStyleData:"gamePlaneCustomStyleData",availablePorts:"availablePorts"})),{},{gamePlaneControlStyle:function(){var e=[];return e.push("translate("+this.gamePlaneTranslateX+"px, "+this.gamePlaneTranslateY+"px)"),e.push("scale(".concat(this.gamePlaneScale,")")),e.push("rotate(".concat(this.gamePlaneRotation,"deg)")),{transform:e.join(" ")}},game:function(){return this.getStore(this.gameId,"game")},statusLabel:function(){switch(this.game.status){case"waitForPlayers":return"Ожидание игроков";case"prepareStart":return"Создание игрового поля";case"inProcess":return"Раунд "+this.game.round;case"finished":return"Игра закончена"}},showPlayerControls:function(){return"inProcess"===this.game.status},playerIds:function(){var e=Object.keys(this.game.playerMap||{}).sort((function(e,t){return e>t?1:-1})),t=e.indexOf(this.currentPlayer);return e.slice(t+1).concat(e.slice(0,t))},helper:function(){var e;return(null===(e=this.getStore(this.currentPlayer,"player"))||void 0===e?void 0:e.helper)||{}},deckList:function(){var e=this,t=Object.keys(this.game.deckMap).map((function(t){return e.getStore(t,"deck")}))||[];return t},activeCards:function(){return this.deckList.find((function(e){return"active"===e.subtype}))||{}},possibleAddPlanePositions:function(){return this.currentPlayerIsActive?(this.game.availablePorts||[]).map((function(e){var t=e.joinPortId,n=e.joinPortDirect,a=e.targetPortId,r=e.targetPortDirect,i=e.position;return{joinPortId:t,joinPortDirect:n,targetPortId:a,targetPortDirect:r,style:{left:i.left+"px",top:i.top+"px",width:i.right-i.left+"px",height:i.bottom-i.top+"px"}}})):[]}}),watch:{"game.round":function(){this.$store.commit("setSelectedDiceSideId",null),this.$store.commit("setAvailablePorts",[])},helper:function(e,t){e.selector&&(document.getElementById("app").setAttribute("tutorial-active",!0),document.querySelector(e.selector).classList.add("tutorial-active"))},"game.status":function(e){"finished"===e&&(localStorage.setItem("currentGame",""),this.$router.push({path:"/"}))}},methods:{sortActiveCards:function(e){var t=this;return e.map((function(e){return t.getStore(e,"card")})).sort((function(e,t){return e.played>t.played?1:-1})).sort((function(e,t){return e.played?0:1})).map((function(e){return e._id}))},takeDice:function(){return Object(c["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,api.game.action({name:"takeDice",data:{count:3}}).catch((function(e){console.log({err:e}),alert(e.message)}));case 2:case"end":return e.stop()}}),e)})))()},takeCard:function(){return Object(c["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,api.game.action({name:"takeCard",data:{count:5}}).catch((function(e){console.log({err:e}),alert(e.message)}));case 2:case"end":return e.stop()}}),e)})))()},addPlane:function(e){var t=this;return Object(c["a"])(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,api.game.action({name:"addPlane",data:{gameId:t.$route.params.id,joinPortId:e.target.attributes.joinPortId.value,targetPortId:e.target.attributes.targetPortId.value,joinPortDirect:e.target.attributes.joinPortDirect.value,targetPortDirect:e.target.attributes.targetPortDirect.value}}).catch((function(e){console.log({err:e}),alert(e.message)}));case 2:t.$store.commit("setAvailablePorts",[]);case 3:case"end":return n.stop()}}),n)})))()},zoomGamePlane:function(e){this.gamePlaneScale+=e.deltaY>0?-.1:.1,this.gamePlaneScale<.3&&(this.gamePlaneScale=.3),this.gamePlaneScale>1&&(this.gamePlaneScale=1)}},created:function(){var e=this;return Object(c["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:e.$store.commit("setSimple",{gameId:e.gameId}),e.$store.commit("setSimple",{store:{}});case 2:case"end":return t.stop()}}),t)})))()},mounted:function(){var e=this;this.gamePlaneScale=this.isMobile?.5:1,api.game.enter({gameId:this.gameId}).then((function(e){console.log("api.game.enter",e)})).catch((function(t){localStorage.setItem("currentGame",""),e.$router.push({path:"/"})})),document.addEventListener("contextmenu",(function(e){e.preventDefault()}));var t=this,n=this.gamePlaneConfig;document.body.addEventListener("mousedown",(function(e){e.target.classList.contains("scroll-off")||e.target.classList.contains("gui")||(2===e.button?(n.initialRotateAngle=e.clientX,n.isRotating=!0):(n.initialX=e.clientX-n.xOffset,n.initialY=e.clientY-n.yOffset,n.isDragging=!0))})),document.body.addEventListener("mouseup",(function(e){2===e.button?(n.rotationLast=n.rotation,n.isRotating=!1):n.isDragging=!1})),document.body.addEventListener("mousemove",(function(e){n.isRotating&&(n.rotation=n.rotationLast+(e.clientX-n.initialRotateAngle)/2,t.gamePlaneRotation=n.rotation),n.isDragging&&(n.currentX=e.clientX-n.initialX,n.currentY=e.clientY-n.initialY,n.xOffset=n.currentX,n.yOffset=n.currentY,t.gamePlaneTranslateX=n.currentX,t.gamePlaneTranslateY=n.currentY)})),document.body.addEventListener("touchstart",(function(e){if(!e.target.closest(".helper-dialog")){var a=e.touches;if(2===a.length){var r=Object(i["a"])(a,2),c=r[0],o=r[1];n.initialDistance=Math.hypot(c.pageX-o.pageX,c.pageY-o.pageY),n.rotationLast=n.rotation,n.initialRotateAngle=Math.atan2(o.pageY-c.pageY,o.pageX-c.pageX)}else n.initialX=a[0].pageX,n.initialY=a[0].pageY,n.xOffset=t.gamePlaneTranslateX,n.yOffset=t.gamePlaneTranslateY,n.isTouchMoved=!1}})),document.body.addEventListener("touchmove",(function(e){if(!e.target.closest(".helper-dialog")){var a=e.touches;if(2===a.length){var r=Object(i["a"])(a,2),c=r[0],o=r[1],s=Math.hypot(c.pageX-o.pageX,c.pageY-o.pageY),l=s/n.initialDistance,u=Math.atan2(o.pageY-c.pageY,o.pageX-c.pageX);if(n.rotation=n.rotationLast+180*(u-n.initialRotateAngle)/Math.PI,t.gamePlaneRotation=n.rotation,l<.5)return;n.initialDistance=s,t.gamePlaneScale+=.5*(l-1)}else n.currentX=e.touches[0].pageX,n.currentY=e.touches[0].pageY,n.distanceX=n.currentX-n.initialX,n.distanceY=n.currentY-n.initialY,(Math.abs(n.distanceX)>10||Math.abs(n.distanceY)>10)&&(n.isTouchMoved=!0,t.gamePlaneTranslateX=n.distanceX+n.xOffset,t.gamePlaneTranslateY=n.distanceY+n.yOffset)}})),document.body.addEventListener("touchend",(function(e){n.isTouchMoved}))},beforeDestroy:function(){return Object(c["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:console.log("beforeDestroy"),api.game.exit();case 2:case"end":return e.stop()}}),e)})))()}},ye=be,ke=(n("568f"),Object(I["a"])(ye,a,r,!1,null,null,null));t["default"]=ke.exports},"8a39":function(e,t,n){},"8ee0":function(e,t,n){},9026:function(e,t,n){"use strict";n("44ba")},"90b9":function(e,t,n){"use strict";n("38bc")},"956e":function(e,t,n){},"9b3a":function(e,t,n){"use strict";n("642b")},a15b:function(e,t,n){"use strict";var a=n("23e7"),r=n("44ad"),i=n("fc6a"),c=n("a640"),o=[].join,s=r!=Object,l=c("join",",");a({target:"Array",proto:!0,forced:s||!l},{join:function(e){return o.call(i(this),void 0===e?",":e)}})},a5e1:function(e,t,n){"use strict";n("956e")},a9e3:function(e,t,n){"use strict";var a=n("83ab"),r=n("da84"),i=n("94ca"),c=n("6eeb"),o=n("5135"),s=n("c6b6"),l=n("7156"),u=n("d9b5"),d=n("c04e"),p=n("d039"),f=n("7c73"),m=n("241c").f,g=n("06cf").f,h=n("9bf2").f,v=n("58a8").trim,b="Number",y=r[b],k=y.prototype,I=s(f(k))==b,P=function(e){if(u(e))throw TypeError("Cannot convert a Symbol value to a number");var t,n,a,r,i,c,o,s,l=d(e,"number");if("string"==typeof l&&l.length>2)if(l=v(l),t=l.charCodeAt(0),43===t||45===t){if(n=l.charCodeAt(2),88===n||120===n)return NaN}else if(48===t){switch(l.charCodeAt(1)){case 66:case 98:a=2,r=49;break;case 79:case 111:a=8,r=55;break;default:return+l}for(i=l.slice(2),c=i.length,o=0;o<c;o++)if(s=i.charCodeAt(o),s<48||s>r)return NaN;return parseInt(i,a)}return+l};if(i(b,!y(" 0o1")||!y("0b1")||y("+0x1"))){for(var _,j=function(e){var t=arguments.length<1?0:e,n=this;return n instanceof j&&(I?p((function(){k.valueOf.call(n)})):s(n)!=b)?l(new y(P(t)),n,j):P(t)},w=a?m(y):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger,fromString,range".split(","),x=0;w.length>x;x++)o(y,_=w[x])&&!o(j,_)&&h(j,_,g(y,_));j.prototype=k,k.constructor=j,c(r,b,j)}},addb:function(e,t){var n=Math.floor,a=function(e,t){var c=e.length,o=n(c/2);return c<8?r(e,t):i(a(e.slice(0,o),t),a(e.slice(o),t),t)},r=function(e,t){var n,a,r=e.length,i=1;while(i<r){a=i,n=e[i];while(a&&t(e[a-1],n)>0)e[a]=e[--a];a!==i++&&(e[a]=n)}return e},i=function(e,t,n){var a=e.length,r=t.length,i=0,c=0,o=[];while(i<a||c<r)i<a&&c<r?o.push(n(e[i],t[c])<=0?e[i++]:t[c++]):o.push(i<a?e[i++]:t[c++]);return o};e.exports=a},bea6:function(e,t,n){"use strict";n("8a39")},c457:function(e,t,n){},d468:function(e,t,n){"use strict";n("140f")},d4ff:function(e,t,n){},d998:function(e,t,n){var a=n("342f");e.exports=/MSIE|Trident/.test(a)},e830:function(e,t,n){}}]);
//# sourceMappingURL=chunk-70ce0f70.531f5dd9.js.map