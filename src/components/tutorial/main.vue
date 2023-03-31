<template>
  <div :class="['helper', ...helperClass]">
    <div class="helper-guru helper-avatar" v-on:click.stop="initMenu" />
    <div v-if="menu" class="helper-menu">
      <div class="helper-avatar" />
      <div class="content">
        <div class="text">
          {{ menu.text }}
        </div>

        <ul v-if="menu.showTutorials" class="tutorials">
          <li v-on:click.stop="action({ tutorial: 'tutorialLobbyStart' })">Стартовое приветствие</li>
        </ul>

        <div v-if="menu.buttons" :class="['controls', menu.bigControls ? 'big' : '']">
          <button
            v-for="button in menu.buttons"
            :key="button.text"
            v-on:click.stop="menuAction({ action: button.action })"
          >
            {{ button.text }}
            <div v-if="button.exit" class="exit-icon" />
          </button>
        </div>
      </div>
    </div>
    <div class="helper-dialog" :style="dialogStyle">
      <div class="helper-avatar" />
      <div class="content">
        <div class="img" />
        <div class="text">
          {{ helperData.text }}
        </div>
        <div class="video" />
        <div v-if="helperData.buttons" class="controls">
          <button
            v-for="button in helperData.buttons"
            :key="button.text"
            v-on:click.stop="action({ action: button.action, step: button.step })"
          >
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
  props: {},
  data() {
    return { menu: null, dialogActive: false, helperClassMap: {}, dialogStyle: {} };
  },
  watch: {
    helperData: function ({ text, active, pos = 'bottom-right' }) {
      this.$set(this.helperClassMap, 'dialog-active', text ? true : false);

      const dialogStyle = {};
      const offset = '20px';
      pos = pos.split('-');
      if (pos.includes('top')) Object.assign(dialogStyle, { top: offset, bottom: 'auto' });
      if (pos.includes('bottom')) Object.assign(dialogStyle, { bottom: offset, top: 'auto' });
      if (pos.includes('left')) Object.assign(dialogStyle, { left: offset, right: 'auto' });
      if (pos.includes('right')) Object.assign(dialogStyle, { right: offset, left: 'auto' });
      this.dialogStyle = dialogStyle;

      document.querySelectorAll('.tutorial-active').forEach((el) => {
        el.classList.remove('tutorial-active');
      });
      if (active) {
        document.body.setAttribute('tutorial-active', true);
        const el = document.querySelector(active);
        el.classList.add('tutorial-active');
      } else {
        document.body.removeAttribute('tutorial-active');
      }
    },
  },
  computed: {
    ...mapGetters({
      getStore: 'getStore',
      currentUser: 'currentUser',
    }),
    helperData() {
      return this.getStore(this.currentUser, 'user').helper || {};
    },
    helperClass() {
      return Object.entries(this.helperClassMap)
        .filter(([name, enabled]) => enabled)
        .map(([name]) => name);
    },
    menuData() {
      return this.helperData.menu || null;
    },
  },
  methods: {
    async action({ action, step, tutorial }) {
      await api.helper.action({ action, step, tutorial });
      if (tutorial) this.menu = null;
    },
    async initMenu() {
      this.menu = {
        text: 'Чем могу помочь?',
        bigControls: true,
        buttons: [
          { text: 'Спасибо, ничего не нужно', action: 'exit', exit: true },
          { text: 'Покажи доступные обучения', action: 'tutorials' },
        ],
      };
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
      }
    },
  },
  mounted() {},
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
}
.helper-menu > .content > .tutorials > * {
  cursor: pointer;
  padding: 0px 20px;
}

.helper-dialog {
  display: none;
  position: fixed;
  z-index: 10000 !important;
  width: 600px;
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
  overflow: hidden;
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
.helper-dialog > .content > .controls.big > button,
.helper-menu > .content > .controls.big > button {
  width: 60%;
}
.helper-dialog > .content > .controls > button > .exit-icon,
.helper-menu > .content > .controls > button > .exit-icon {
  background-image: url(../../assets/exit.png);
  background-size: contain;
  margin-left: 4px;
  height: 16px;
  width: 16px;
}
.helper-dialog > .content > .controls > button:hover,
.helper-menu > .content > .controls > button:hover {
  color: white;
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

body[tutorial-active]:after {
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
  box-shadow: 0 0 10px 20px #ffffff;
}

/* #tutorial > .controls {
  position: absolute;
  bottom: 6px;
  left: 0px;
  width: 100%;
  display: flex;
  justify-content: center;
}
#tutorial > .controls.big {
  top: 100%;
  flex-wrap: wrap;
  margin-top: -40px;
}
#tutorial > .controls > button {
  color: #888;
  border: 2px solid #888;
  background-image: url(/XAOC/images/clear-black-back.png);
  padding: 10px 20px;
  display: flex;
  justify-content: space-evenly;
}
#tutorial > .controls.big > button {
  width: 60%;
}
#tutorial > .controls > button.active {
  border-color: #d5ad51;
  color: #d5ad51;
}
#tutorial > .controls > button.active:hover {
  color: white;
}
#tutorial > .controls > button > .img {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0px 10px;
  height: 20px;
  width: 20px;
}
#tutorial > .content > .contentControls {
  margin-top: 10px;
}
#tutorial > .content > .contentControls > .control {
  display: flex;
  cursor: pointer;
  padding: 4px 20px;
}
#tutorial > .content > .contentControls > .control:hover {
  color: white;
}
#tutorial > .content > .contentControls > .control > .img {
  background-image: url(/blocks/tutorial/static/img/star.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin: 0px 10px;
  height: 20px;
  width: 20px;
}

#tutorial > .content > .contentControls textarea {
  background: transparent;
  border-color: #d8b35f;
  padding: 10px;
  width: 100%;
  color: #ddd;
}
#tutorial > .content > .contentControls textarea:focus {
  outline: none;
}
#tutorial > .content > .contentControls .img {
  background-size: cover;
  width: 100%;
}
#tutorial > .content > .contentControls .img.active {
  height: 300px;
  border: 2px solid #9f8750;
}

#tutorial > .guru {
  position: absolute;
  z-index: 10001 !important;
  border-radius: 50%;
  border: 3px solid #d5ad51;
  right: 10px;
  top: 10px;
  width: 64px;
}
body.isMobileSmall #tutorial > .guru {
  right: 10px;
  top: 10px;
  width: 64px;
}

#tutorial > .content {
  width: 100%;
  margin: 30px;
  min-height: 100px;
  border: 2px solid #d5ad51;
  background-image: url(/XAOC/images/clear-black-back.png);
  padding: 20px;
  padding-right: 60px;
  white-space: pre-wrap;
  color: #d5ad51;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
}
body.isMobile #tutorial > .content {
  min-height: 0px;
}
#tutorial.has-controls > .content {
  padding-bottom: 30px;
}
body.isMobileSmall #tutorial > .content {
  font-size: 12px;
  padding-right: 40px;
}
#tutorial > .content > .typed-cursor {
  display: none !important;
}
#tutorial > .content > .text,
#tutorial > .content > .contentControls {
  width: 100%;
}
#tutorial > .content > .img {
  width: 60px;
  background-size: contain;
  flex-shrink: 0;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 20px;
  display: none;
}
#tutorial > .content > .video {
  height: auto;
  display: none;
}
body.isMobileSmall #tutorial > .content > .img {
  width: 40px;
}
#tutorial > .content > .img.active,
#tutorial > .content > .video.active {
  display: block;
} */
</style>
