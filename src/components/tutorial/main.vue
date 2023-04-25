<template>
  <div :class="['helper', inGame ? 'in-game' : '', ...helperClass]">
    <div
      v-for="link in helperLinks"
      :key="link.code"
      :class="['helper-link', 'helper-avatar', link.customClass]"
      :style="{
        left: `${link.clientRect.left + (link.pos.left ? 0 : link.clientRect.width)}px`,
        top: `${link.clientRect.top + (link.pos.top ? 0 : link.clientRect.height)}px`,
      }"
      v-on:click.stop="showTutorial(link)"
    />

    <div v-if="!menu" :class="['helper-guru', 'helper-avatar', `scale-${guiScale}`]" v-on:click.stop="initMenu" />
    <div v-if="menu" :class="['helper-menu', `scale-${guiScale}`]">
      <div class="helper-avatar" />
      <div class="content">
        <div class="text">
          {{ menu.text }}
        </div>

        <ul v-if="menu.showTutorials && inGame" class="tutorials">
          <li v-on:click.stop="action({ tutorial: 'tutorialGameStart' })">Стартовое приветствие игры</li>
        </ul>
        <ul v-if="menu.showTutorials && !inGame" class="tutorials">
          <li v-on:click.stop="action({ tutorial: 'tutorialLobbyStart' })">Стартовое приветствие</li>
        </ul>

        <div v-if="menu.buttons" :class="['controls', menu.bigControls ? 'big' : '']">
          <button
            v-for="button in menu.buttons"
            :key="button.text"
            v-on:click.stop="menuAction({ action: button.action })"
          >
            {{ button.text }}
            <font-awesome-icon v-if="button.exit" :icon="['far', 'circle-xmark']" size="lg" style="color: #f4e205" />
            <font-awesome-icon
              v-if="button.action === 'leaveGame'"
              :icon="['fas', 'right-from-bracket']"
              size="lg"
              style="color: #f4e205"
            />
          </button>
        </div>
      </div>
    </div>
    <div :class="['helper-dialog', `scale-${guiScale}`, ...dialogClass]" :style="dialogStyle">
      <div class="helper-avatar" />
      <div class="content">
        <div v-if="helperData.img" class="img">
          <img :src="helperData.img" />
        </div>
        <div class="text">
          {{ helperData.text }}
        </div>
        <div class="video" />
        <div v-if="helperData.buttons" class="controls">
          <button v-for="button in helperData.buttons" :key="button.text" v-on:click.stop="action({ ...button })">
            {{ button.text }}
            <div v-if="button.exit" class="exit-icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'helper',
  components: {},
  props: {
    inGame: Boolean,
  },
  data() {
    return { menu: null, dialogActive: false, helperClassMap: {}, dialogStyle: {}, dialogClassMap: {} };
  },
  watch: {
    helperData: function() {
      this.update();
    },
  },
  computed: {
    ...mapGetters({
      getStore: 'getStore',
      currentUser: 'currentUser',
      guiScale: 'guiScale',
      getHelperLinks: 'getHelperLinks',
      helperLinksBounds: 'helperLinksBounds',
    }),
    helperData() {
      return this.getStore(this.currentUser, 'user').helper || {};
    },
    helperLinks() {
      return Object.entries(this.getHelperLinks)
        .map(([code, link]) => ({
          code,
          pos: {},
          ...link,
          clientRect: this.helperLinksBounds[code],
        }))
        .filter(({ clientRect }) => clientRect);
    },
    helperClass() {
      return Object.entries(this.helperClassMap)
        .filter(([name, enabled]) => enabled)
        .map(([name]) => name);
    },
    dialogClass() {
      return Object.entries(this.dialogClassMap)
        .filter(([name, enabled]) => enabled)
        .map(([name]) => name);
    },
    menuData() {
      return this.helperData.menu || null;
    },
  },
  methods: {
    update() {
      let { text, img, active, pos = 'bottom-right', fullscreen = false } = this.helperData;

      this.$set(this.helperClassMap, 'dialog-active', text || img ? true : false);
      this.$set(this.helperClassMap, 'fullscreen', fullscreen);

      const dialogStyle = {};
      const offset = '20px';
      if (fullscreen) {
        if (pos.includes('top'))
          Object.assign(dialogStyle, { top: offset, left: offset, width: '100%', height: '100%' });
      } else {
        pos = pos.split('-');
        if (pos.includes('top')) Object.assign(dialogStyle, { top: offset, bottom: 'auto' });
        if (pos.includes('bottom')) Object.assign(dialogStyle, { bottom: offset, top: 'auto' });
        if (pos.includes('left')) Object.assign(dialogStyle, { left: offset, right: 'auto' });
        if (pos.includes('right')) Object.assign(dialogStyle, { right: offset, left: 'auto' });
        dialogStyle['transform-origin'] = pos.join(' ');
      }
      this.dialogStyle = dialogStyle;

      document.querySelectorAll('.tutorial-active').forEach(el => {
        el.classList.remove('tutorial-active');
      });
      if (active) {
        if (typeof active === 'string') active = { selector: active };
        let { selector, update, customClass } = active;

        // document.getElementById('app').setAttribute('tutorial-active', true);
        document.querySelectorAll(selector).forEach(el => {
          if (el) {
            el.classList.add('tutorial-active');
            if(customClass) el.classList.add(customClass);
            if (update) {
              el.addEventListener('click', () => {
                this.action(update);
              });
            }
          }
        });
      } else {
        // document.getElementById('app').removeAttribute('tutorial-active');
      }
    },
    async action({ action, step, tutorial, link }) {
      if (link) {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = link;
        a.target = '_blank';
        document.body.appendChild(a);
        // const url = window.URL.createObjectURL(link);
        // a.href = url;
        // a.download = 'rules';
        a.click();
      } else {
        await api.helper.action({ action, step, tutorial });
        if (tutorial) this.menu = null;
      }
    },
    async initMenu() {
      if (this.inGame) {
        this.menu = {
          text: 'Чем могу помочь?',
          bigControls: true,
          buttons: [
            { text: 'Спасибо, ничего не нужно', action: 'exit', exit: true },
            { text: 'Покажи доступные обучения', action: 'tutorials' },
            { text: 'Закончить игру', action: 'leaveGame' },
          ],
        };
      } else {
        this.menu = {
          text: 'Чем могу помочь?',
          bigControls: true,
          buttons: [
            { text: 'Спасибо, ничего не нужно', action: 'exit', exit: true },
            { text: 'Покажи доступные обучения', action: 'tutorials' },
          ],
        };
      }
    },
    menuAction({ action }) {
      switch (action) {
        case 'exit':
          this.menu = null;
          break;
        case 'init':
          this.initMenu();
          break;
        case 'tutorials':
          this.menu = {
            text: 'Выберите на нужное обучение, чтобы запустить его повторно:',
            showTutorials: true,
            buttons: [
              { text: 'Назад в меню', action: 'init' },
              { text: 'Спасибо', action: 'exit', exit: true },
            ],
          };
          break;
        case 'leaveGame':
          api.lobby.leaveGame().catch(err => {
            console.log({ err });
            alert(err.message);
          });
          break;
      }
    },
    showTutorial({ tutorial, code }) {
      if (tutorial) api.helper.action({ tutorial, usedLink: code });
      return;
    },
  },
  mounted() {
    // watch не всегда ловит обновление helperData на старте
    this.$nextTick(this.update);
  },
};
</script>

<style>
.helper-avatar {
  border-radius: 50%;
  background-image: url(../../assets/helper.png);
  background-size: contain;
  border: 4px solid #f4e205;
}
.helper-guru {
  position: fixed;
  z-index: 10000 !important;
  bottom: 20px;
  left: 20px;
  width: 64px;
  height: 64px;
  cursor: pointer;
  font-size: 14px;
  transform-origin: left top;
}
.helper-guru.scale-1 {
  scale: 0.8;
}
.helper-guru.scale-2 {
  scale: 1;
}
.helper-guru.scale-3 {
  scale: 1.5;
}
.helper-guru.scale-4 {
  scale: 2;
}
.helper-guru.scale-5 {
  scale: 2.5;
}
.mobile-view .helper-guru {
  scale: 0.6;
  transform-origin: left top;
}
#lobby.mobile-view .helper-guru {
  top: 20px;
  right: 20px;
  left: auto;
}
.helper.in-game .helper-guru {
  top: 20px;
  bottom: auto;
}
.helper.dialog-active > .helper-guru {
  display: none;
}

.helper-menu {
  position: fixed;
  display: flex;
  z-index: 10000 !important;
  width: 600px;
  right: 20px;
  top: 20px;
  max-width: 100%;
  transform-origin: left top;
}
.helper-menu.scale-1 {
  scale: 0.8;
}
.helper-menu.scale-2 {
  scale: 1;
}
.helper-menu.scale-3 {
  scale: 1.5;
}
.helper-menu.scale-4 {
  scale: 2;
}
.helper-menu.scale-5 {
  scale: 2.5;
}
.mobile-view .helper-menu {
  scale: 1;
  transform-origin: left top;
}
#lobby.mobile-view .helper-menu {
  right: 10px;
  top: 10px;
}
.helper.in-game .helper-menu {
  left: 0px;
  right: auto;
}

.helper-menu > .content > .tutorials > * {
  cursor: pointer;
  padding: 0px 20px;
}

.helper-dialog {
  display: none;
  position: fixed;
  z-index: 10001 !important;
  width: 600px;
  max-width: 100%;
  max-height: 95%;
}
.helper-dialog.scale-1 {
  scale: 0.8;
}
.helper-dialog.scale-2 {
  scale: 1;
}
.helper-dialog.scale-3 {
  scale: 1.5;
}
.helper-dialog.scale-4 {
  scale: 2;
}
.helper-dialog.scale-5 {
  scale: 2.5;
}
.mobile-view .helper-dialog {
  scale: 1;
}
.helper.dialog-active > .helper-dialog {
  display: flex;
}
.helper-dialog > .content,
.helper-menu > .content {
  width: 100%;
  margin: 30px;
  min-height: 100px;
  border: 2px solid #f4e205;
  background-image: url(../../assets/clear-black-back.png);
  padding: 20px;
  padding-right: 60px;
  white-space: pre-wrap;
  color: #f4e205;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
}
.helper-menu > .content {
  min-height: 50px;
}

.helper-dialog > .content > .controls,
.helper-menu > .content > .controls {
  position: absolute;
  bottom: 6px;
  left: 0px;
  width: 100%;
  display: flex;
  justify-content: center;
}
.helper-dialog > .content > .controls.big,
.helper-menu > .content > .controls.big {
  top: 100%;
  flex-wrap: wrap;
  margin-top: -40px;
}
.helper-dialog > .content > .controls > button,
.helper-menu > .content > .controls > button {
  border-color: #f4e205;
  color: #f4e205;
  background-image: url(../../assets/clear-black-back.png);
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  cursor: pointer;
}

#lobby.mobile-view .helper-dialog > .content > .controls > button,
#lobby.mobile-view .helper-menu > .content > .controls > button {
  padding: 10px 10px;
}

.helper-dialog > .content > .controls.big > button,
.helper-menu > .content > .controls.big > button {
  width: 60%;
}
.helper-dialog > .content > .controls > button:hover,
.helper-menu > .content > .controls > button:hover {
  color: white;
}
.helper-dialog > .content > .controls.big > button > svg,
.helper-menu > .content > .controls.big > button > svg {
  margin-left: 4px;
}
.helper-dialog > .helper-avatar,
.helper-menu > .helper-avatar {
  position: absolute;
  z-index: 10001 !important;
  border-radius: 50%;
  border: 3px solid #f4e205;
  right: 10px;
  top: 10px;
  width: 64px;
  height: 64px;
}

#app[tutorial-active]:after {
  content: '';
  position: fixed !important;
  z-index: 9999;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background-image: url(../../assets/clear-grey-back.png);
}
.tutorial-active {
  z-index: 10000 !important;
  position: relative;
  box-shadow: 0 0 100px 10px #f4e205;
}
.tutorial-active.rounded {
  box-shadow: 0 0 20px 20px #f4e205;
  border-radius: 50%;
}

.helper.fullscreen {
  width: 100%;
  display: flex;
  justify-content: center;
}
.helper.fullscreen .helper-dialog {
  width: auto !important;
}

.helper-link {
  position: fixed;
  width: 50px;
  height: 50px;
  margin-left: -25px;
  margin-top: -25px;
  z-index: 2;
  cursor: pointer;
  box-shadow: 0 0 10px 10px #f4e205;
}
.helper-link:hover {
  opacity: 0.7;
}
</style>
