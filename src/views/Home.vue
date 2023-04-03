<template>
  <div id="lobby" :class="[isMobile ? 'mobile-view' : '', isLandscape ? 'landscape-view' : 'portrait-view']">
    <tutorial />

    <div class="menu-item game">
      <label v-on:click="pinMenuItem">
        ИГРОВАЯ КОМНАТА <font-awesome-icon icon="fa-solid fa-thumbtack" class="fa-xs" />
      </label>
      <div>
        <div class="new-game-btn-list">
          <div v-on:click="addGame('single-blitz')">
            <font-awesome-icon :icon="['fas', 'user']" size="2xl" />
            Фриланс
          </div>
          <div v-on:click="addGame('duel-blitz')">
            <font-awesome-icon :icon="['fas', 'user-group']" size="2xl" />
            Дуэль
          </div>
          <div v-on:click="addGame('ffa-blitz')">
            <font-awesome-icon :icon="['fas', 'users']" size="2xl" />
            Каждый за себя
          </div>
          <div class="disabled">
            <font-awesome-icon :icon="['fas', 'dice-four']" size="2xl" style="color: #fff" />
            Команды
          </div>
        </div>
        <hr :style="{ margin: '10px 30px', borderColor: '#f4e205' }" />
        <div v-for="game in gameList" :key="game._id">
          Набрано игроков: ( {{ game.joinedPlayers }} )
          <button class="lobby-btn" v-on:click="joinGame({ gameId: game._id })">Присоединиться к игре</button>
          <!-- <button v-on:click="deleteGame({ gameId: game._id })">Удалить игру</button> -->
        </div>
      </div>
    </div>
    <div class="menu-item list">
      <label v-on:click="pinMenuItem">
        ВИТРИНА ИГР <font-awesome-icon icon="fa-solid fa-thumbtack" class="fa-xs" />
      </label>
      <div>
        <ul>
          <li>
            <label v-on:click.stop="showRules('release')">Релиз</label>
            <div>Игра про ИТ-разработку</div>
          </li>
          <li class="disabled">
            <label>Автоаукцион</label>
            <div>Игра про продажи в автобизнесе</div>
          </li>
          <li class="disabled">
            <label>Скорринг</label>
            <div>Игра про оценку рисков в банках</div>
          </li>
        </ul>
        <!-- <iframe id="fred" style="border:1px solid #666CCC" title="PDF in an i-Frame" src="./rules.pdf" frameborder="1" scrolling="auto" height="1100" width="850" ></iframe> -->
      </div>
    </div>
    <div class="menu-item chat">
      <label v-on:click="pinMenuItem"> ОБЩЕНИЕ <font-awesome-icon icon="fa-solid fa-thumbtack" class="fa-xs" /> </label>
      <div :style="{ display: 'flex', flexWrap: 'wrap', overflow: 'hidden' }">
        <div
          class="user-list"
          :style="{
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            borderBottom: '2px solid #f4e205',
            padding: '10px',
          }"
        >
          <label class="user-list-label" :style="{ width: '100%' }">Игроки онлайн ({{ userList.length }})</label>
          <div class="user-list">
            <span v-for="user in userList" :key="user._id">
              {{ user.name || 'Гость' }}
            </span>
          </div>
        </div>
        <div
          :style="{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            overflow: 'hidden',
          }"
        >
          <div class="msg-list" :style="{ paddingBottom: '80px', paddingTop: '10px', paddingLeft: '10px', paddingRight: '10px' }">
            <div v-for="msg in getChat" :key="msg._id" class="msg">
              <div class="header">
                <b>{{ msg.user.name }}</b>
                <i>{{ msg.timeStr }}</i>
              </div>
              {{ msg.text }}
            </div>
          </div>
        </div>
        <div
          class="chat-controls"
          :style="{
            position: 'absolute',
            width: '100%',
            display: 'flex',
            left: '0px',
            bottom: '0px',
            boxShadow: 'inset 0px -20px 20px 20px black',
          }"
        >
          <div
            v-if="!userData.name"
            :style="{
              position: 'absolute',
              width: '100%',
              height: '100%',
              left: '0px',
              top: '0px',
              background: 'black',
              paddingTop: '10px',
            }"
          >
            <div :style="{ padding: '8px' }">Укажите свое имя, чтобы начать писать в чат</div>
            <div :style="{ display: 'flex', justifyContent: 'space-evenly' }">
              <input
                v-model="userName"
                :style="{ border: '1px solid #f4e205', background: 'black', color: 'white', padding: '4px 10px' }"
              /><button v-on:click="saveName" class="lobby-btn">Сохранить</button>
            </div>
          </div>
          <textarea
            v-model="chatMsgText"
            rows="3"
            :style="{
              width: '100%',
              background: 'black',
              border: '1px solid #f4e205',
              resize: 'none',
              color: 'white',
              padding: '10px',
              margin: '10px',
              zIndex: '1',
            }"
          />
          <button
            :disabled="disableSendMsgBtn > 0"
            v-on:click="sendChatMsg"
            class="lobby-btn"
            :style="{
              color: '#ffffff',
              width: '40px',
              height: '40px',
              marginTop: '10px',
              marginRight: '10px',
              boxShadow: 'black -10px 10px 20px 20px',
	            zIndex: '0',
            }"
          >
            <span v-if="disableSendMsgBtn > 0"> {{ disableSendMsgBtn }} </span>
            <font-awesome-icon v-if="disableSendMsgBtn === 0" :icon="['fas', 'share']" />
          </button>
        </div>
      </div>
    </div>
    <div class="menu-item top">
      <label v-on:click="pinMenuItem">
        ЗАЛ СЛАВЫ <font-awesome-icon icon="fa-solid fa-thumbtack" class="fa-xs" />
      </label>
      <div>раздел в разработке</div>
    </div>

    <img
      id="bg-img"
      src="../assets/lobby.png"
      usemap="#image-map"
      :style="{
        position: 'absolute',
        left: `${bg.left || 0}px`,
        top: `${bg.top || 0}px`,
        scale: bg.scale || 1,
        transformOrigin: 'center',
        filter: 'grayscale(1)',
      }"
    />
    <!-- <map
      name="image-map"
      :style="{
        position: 'absolute',
        left: `${bg.left || 0}px`,
        top: `${bg.top || 0}px`,
        scale: bg.scale || 1,
        transformOrigin: 'center',
      }"
    >
      <area
        coords="350,702,352,1021,1401,1023,1394,786,861,640,585,676"
        shape="poly"
        v-on:click="show('table')"
        v-on:mouseover="show('table')"
        v-on:mouseleave="show('')"
      />
      <area
        coords="525,282,521,517,628,545,628,664,866,633,958,659,961,228"
        shape="poly"
        v-on:click="show('leaderboard')"
        v-on:mouseover="show('leaderboard')"
        v-on:mouseleave="show('')"
      />
    </map>
    <img
      src="../assets/lobby-table.png"
      usemap="#image-map"
      :style="{
        position: 'absolute',
        left: `${bg.left || 0}px`,
        top: `${bg.top || 0}px`,
        scale: bg.scale || 1,
        display: bg.showMask === 'table' ? 'block' : 'none',
      }"
    />
    <img
      src="../assets/lobby-leaderboard.png"
      usemap="#image-map"
      :style="{
        position: 'absolute',
        left: `${bg.left || 0}px`,
        top: `${bg.top || 0}px`,
        scale: bg.scale || 1,
        display: bg.showMask === 'leaderboard' ? 'block' : 'none',
      }"
    /> -->
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';

import tutorial from '../components/tutorial/main.vue';

export default {
  components: {
    tutorial,
  },
  data() {
    return {
      userName: '',
      chatMsgText: '',
      disableSendMsgBtn: 0,
      bg: {
        top: 0,
        left: 0,
        showMask: '',
      },
    };
  },
  watch: {},
  computed: {
    ...mapGetters({
      getStore: 'getStore',
      isMobile: 'isMobile',
      isLandscape: 'isLandscape',
      currentUser: 'currentUser',
    }),
    userData() {
      return this.getStore(this.currentUser, 'user') || {};
    },
    userList() {
      const list = Object.keys(this.lobby.userMap || {}).map((id) => this.getStore(id, 'user')) || [];
      return list.map((user) => {
        return user;
      });
    },
    lobby() {
      return this.getStore('main', 'lobby') || {};
    },
    gameList() {
      const list = Object.keys(this.lobby.gameMap || {}).map((id) => this.getStore(id, 'game')) || [];
      return list.map((game) => {
        if (game.playerList) {
          game.joinedPlayers =
            game.playerList.filter((player) => player.ready).length + ' из ' + game.playerList.length;
        }
        return game;
      });
    },
    getChat() {
      const msgList = this.getStore('chat');
      return Object.values(msgList)
        .map((msg) => ({ ...msg, timeStr: new Date(msg.time).toLocaleString() }))
        .reverse();
    },
  },
  methods: {
    show(mask) {
      if (mask === '' && this.isMobile) return;
      this.bg.showMask = mask;
    },
    pinMenuItem(e) {
      e.target.closest('.menu-item').classList.toggle('pinned');
    },
    async addGame(type) {
      await api.lobby.newGame({ type });
    },
    async joinGame({ gameId }) {
      await api.lobby.joinGame({ gameId: gameId });
    },
    async deleteGame({ gameId }) {
      await api.lobby.deleteGame({ gameId: gameId });
    },
    showRules(name) {
      api.helper.action({ tutorial: 'tutorialGameRules', step: name });
      return;
    },
    saveName() {
      api.lobby.updateUser({ userName: this.userName });
    },
    sendChatMsg() {
      this.disableSendMsgBtn = 5;
      api.lobby
        .updateChat({ text: this.chatMsgText })
        .then((data) => {
          this.chatMsgText = '';
          this.restoreMsgBtn();
        })
        .catch((err) => {
          this.restoreMsgBtn();
        });
    },
    restoreMsgBtn() {
      if (this.disableSendMsgBtn > 0) {
        this.disableSendMsgBtn--;
        setTimeout(this.restoreMsgBtn, 1000);
      }
    },
  },
  async created() {
    this.$store.commit('setSimple', { store: {} });
  },
  async mounted() {
    // console.log('mounted');

    const self = this;
    function resize() {
      const bgHeight = 1024;
      const bgWidth = 2048;
      self.bg.top = window.innerHeight / 2 - bgHeight / 2;
      self.bg.left = window.innerWidth / 2 - bgWidth / 2;
      self.bg.scale = Math.max(window.innerHeight / bgHeight, window.innerWidth / bgWidth);
    }
    resize();
    window.addEventListener('resize', resize);

    api.lobby.on('event', ({ event, data }) => {
      console.log('event', event, data);
      // switch (event) {
      // case "userJoin": {
      //   const lobby = this.$store.getters.getClone("lobby");
      //   lobby.__user[data._id] = data;
      //   this.$store.dispatch("setSimple", { lobby });
      //   break;
      // }
      // case "userLeave": {
      //   const lobby = this.$store.getters.getClone("lobby");
      //   delete lobby.__user[data._id];
      //   this.$store.dispatch("setSimple", { lobby });
      //   break;
      // }
      // case "userUpdate": {
      //   const lobby = this.$store.getters.getClone("lobby");
      //   lobby.__user[data._id] = data;
      //   this.$store.dispatch("setSimple", { lobby });
      //   break;
      // }
      // case "gameAdd":
      //   this.games.push(data);
      //   break;

      // case "gameDelete":
      //   this.games = this.games.filter((game) => game._id !== data._id);
      //   break;

      // case 'gameUpdate':
      //   this.$store.dispatch('setData', { game: {[data._id]: data} });
      //   break;
      // }
    });

    const lobbyData = await api.lobby.enter();
    //this.$store.dispatch("setSimple", { lobby: lobbyData });
  },
  async beforeDestroy() {
    // console.log('beforeDestroy');
    api.lobby.exit();
  },
};
</script>
<style lang="scss">
#lobby {
  height: 100%;
  width: 100%;
  /*  */
}

:root {
  --size: 3;
  --skew: 7;
  --orange: hsl(20, 100%, 71%);
  --svgfilter: url(#squiggly-0);
  --boxshadow: rgb(22, 12, 3);
  --textshadow: rgb(42, 22, 23);
}
@media only screen and (max-width: 600px) {
  :root {
    --size: 2;
  }
}
@media only screen and (max-width: 400px) {
  :root {
    --size: 1.4;
  }
}
.lightning:before,
.lightning:after {
  content: '';
  width: 25%;
}
.lightning {
  z-index: 1;

  display: flex;
  position: relative;
  margin: 4vmin;
  filter: var(--svgfilter);
  span {
    color: black;
    letter-spacing: 10px; //calc(var(--size) * 1vmin);
    font-size: 1rem;
    padding: calc(0.5 * 1rem) 0 0 0;
    margin-right: -1rem;
    text-align: left;
    text-shadow: none;
  }
  > * {
    margin: 0;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 20px 40px; //calc(var(--size) * 0.8vmin) calc(var(--size) * 1.6vmin);
    background: rgba(#f4e205, 1); //yellow;

    transform: skew(calc(var(--skew) * -1deg), calc(var(--skew) * -1deg));
    font-size: 80px; //calc(var(--size) * 3vmax);
    font-weight: 700;
    color: Crimson;

    text-transform: uppercase;
    text-align: right;
    border: 3px solid var(--boxshadow);
    border-left: 0;
    text-shadow: var(--textshadow) 0px 0px 0px, var(--textshadow) 0.669131px 0.743145px 0px,
      var(--textshadow) 1.33826px 1.48629px 0px, var(--textshadow) 2.00739px 2.22943px 0px,
      var(--textshadow) 2.67652px 2.97258px 0px, var(--textshadow) 3.34565px 3.71572px 0px,
      var(--textshadow) 4.01478px 4.45887px 0px, var(--textshadow) 4.68391px 5.20201px 0px;
    box-shadow: var(--border) 0px 0px 0px, var(--boxshadow) 0.819152px 0.573576px 0px,
      var(--boxshadow) 1.6383px 1.14715px 0px, var(--boxshadow) 2.45746px 1.72073px 0px,
      var(--boxshadow) 3.27661px 2.29431px 0px, var(--boxshadow) 4.09576px 2.86788px 0px,
      var(--boxshadow) 4.91491px 3.44146px 0px, var(--boxshadow) 5.73406px 4.01504px 0px,
      var(--boxshadow) 6.55322px 4.58861px 0px, var(--boxshadow) 7.37237px 5.16219px 0px,
      var(--boxshadow) 8.19152px 5.73576px 0px, var(--boxshadow) 9.01067px 6.30934px 0px,
      var(--boxshadow) 9.82982px 6.88292px 0px, var(--boxshadow) 10.649px 7.45649px 0px,
      var(--boxshadow) 11.4681px 8.03007px 0px;
    &:last-child {
      left: calc(var(--size) * -1vmin);
      position: relative;
      text-align: left;
      // font-size: 8vmin;
      span {
        border-top: 1px solid;
      }
    }
  }
}

.menu-item {
  z-index: 1;
  position: absolute;
  transform: translate(-50%, -50%);
  transition: top 0.7s;
}
.menu-item > label {
  cursor: pointer;
  color: crimson;
  text-shadow: var(--textshadow) 0px 0px 0px, var(--textshadow) 0.669131px 0.743145px 0px,
    var(--textshadow) 1.33826px 1.48629px 0px, var(--textshadow) 2.00739px 2.22943px 0px,
    var(--textshadow) 2.67652px 2.97258px 0px, var(--textshadow) 3.34565px 3.71572px 0px,
    var(--textshadow) 4.01478px 4.45887px 0px, var(--textshadow) 4.68391px 5.20201px 0px;
  font-family: fantasy;
  font-weight: bold;
  letter-spacing: 10px;
  white-space: nowrap;
  padding-left: 6px;

  font-size: 3em;
  background-image: linear-gradient(#f4e205, #f4e205);
  background-size: 100% 10px;
  background-repeat: no-repeat;
  background-position: 100% 0%;
  transition: background-size 0.7s, background-position 0.5s ease-in-out;
}
.menu-item:hover > label,
.menu-item.pinned > label {
  background-size: 100% 100%;
  background-position: 0% 100%;
  transition: background-position 0.7s, background-size 0.5s ease-in-out;
  box-shadow: 1px 0px 20px 6px rgba(0, 0, 0, 1);
}
.menu-item > label > svg {
  display: none;
  padding: 10px;
  position: absolute;
  right: 100%;
  color: #f4e205;
}
.menu-item:hover > label > svg {
  display: inline-block;
}

.menu-item > div {
  visibility: hidden;
  opacity: 0;
  border: 4px solid #f4e205;
  position: absolute;
  left: 0px;
  top: 100%;
  background-image: url(../assets/clear-black-back.png);
  color: white;
  transition: visibility 0s, opacity 0.5s linear;
  overflow: auto;
}
.menu-item.pinned > div {
  max-height: none !important;
}
#lobby:not(.mobile-view) .menu-item:hover > div,
.menu-item.pinned > div,
.menu-item.tutorial-active > div {
  visibility: visible;
  opacity: 1;
}

.menu-item.game {
  top: 70%;
  left: 45%;
}
.menu-item.game.pinned {
  top: 45%;
  left: 45%;
}
.menu-item.game > div {
  height: 300px;
  width: 500px;
  max-height: 200px;
}
.menu-item.chat {
  top: 60%;
  left: 10%;
}
.menu-item.chat.pinned {
  top: 10%;
  left: 10%;
}
.menu-item.chat > div {
  height: 500px;
  width: 300px;
  max-height: 200px;
}
.menu-item.top {
  top: 35%;
  left: 40%;
}
.menu-item.top.pinned {
  top: 10%;
  left: 40%;
}
.menu-item.top > div {
  height: 200px;
  width: 500px;
}
.menu-item.list {
  top: 45%;
  left: 80%;
}
.menu-item.list.pinned {
  top: 20%;
  left: 80%;
}
.menu-item.list > div {
  height: 500px;
  width: 400px;
  max-height: 300px;
}

#lobby.mobile-view .menu-item {
  left: 0px;
  width: 100%;
  transform: none;
}
#lobby.mobile-view .menu-item > div {
  top: auto;
  left: 5%;
  width: 90%;
  height: 100%;
}
#lobby.mobile-view .menu-item.pinned {
  top: 20% !important;
  height: 70%;
  z-index: 2;
}
#lobby.mobile-view.landscape-view .menu-item.pinned {
  top: 10% !important;
}
#lobby.mobile-view .menu-item.top {
  top: 30%;
}
#lobby.mobile-view .menu-item.list {
  top: 45%;
}
#lobby.mobile-view .menu-item.chat {
  top: 60%;
}
#lobby.mobile-view .menu-item.game {
  top: 75%;
}

.menu-item.tutorial-active {
  background: white;
}

#lobby:before {
  content: '';
  z-index: 1;
  position: absolute;
  left: 0px;
  top: 0px;
  height: 100%;
  width: 100%;
  background-image: url(../assets/logo.png);
  background-size: 400px 200px;
  background-position: center top;
  background-repeat: no-repeat;
}
#lobby.mobile-view:before {
  background-size: 300px 150px;
}
#lobby.mobile-view.landscape-view:before {
  top: -25px;
}

.menu-item.list ul {
  font-size: 18px;
  color: white;
  text-align: left;
}
.menu-item.list ul > li {
  padding-bottom: 20px;
}
.menu-item.list ul > li > label,
.menu-item.list ul > li > label > a,
.menu-item.list ul > li::marker {
  cursor: pointer;
  font-family: fantasy;
  font-size: 24px;
  color: #f4e205;
}
.menu-item.list ul > li > label > a {
  font-size: 16px;
}
.menu-item.list ul > li:not(.disabled):hover > label > a,
.menu-item.list ul > li:not(.disabled):hover::marker {
  color: white;
}

.menu-item.list ul > li.disabled * {
  cursor: default !important;
}
.menu-item.list ul > li.disabled > label:after {
  content: '(в разработке)';
  color: grey;
  font-size: 20px;
  padding-left: 10px;
}

.new-game-btn-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.new-game-btn-list > div {
  width: 40%;
  text-align: left;
  border: 2px solid #f4e205;
  color: white;
  background-color: transparent;
  padding: 4px 10px;
  margin: 4px;
  border-radius: 4px;
  cursor: pointer;
}
.new-game-btn-list > div > svg {
  width: 40px;
}
.new-game-btn-list > div.disabled {
  border: 2px solid #ccc;
  background-color: #ccc;
  cursor: not-allowed;
}
.new-game-btn-list > div:not(.disabled):hover {
  background: #f4e205;
  color: black;
}
.new-game-btn-list > div:not(.disabled):hover > svg {
  color: black !important;
}
.lobby-btn {
  background: #f4e205;
  border: 2px solid #f4e205;
  color: black;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
}
.lobby-btn:hover,
.lobby-btn[disabled='disabled'] {
  background: black!important;
  color: #f4e205;
}
.chat .user-list-label {
  display: inherit;
  color: #f4e205;
  text-align: left;
  margin-bottom: 8px;
}
.chat .user-list {
  display: flex;
  flex-wrap: wrap;
}
.chat .user-list > span {
  border: 1px solid #f4e205;
  border-radius: 2px;
  padding: 2px 4px;
  margin: 2px;
}
.chat .msg-list {
  font-size: 16px;
  width: 100%;
}
.chat .msg-list > .msg {
  padding: 8px;
  text-align: left;
}
.chat .msg-list > .msg > .header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.chat .msg-list > .msg > .header > b {
  color: #f4e205;
}
.chat .msg-list > .msg > .header > i {
  font-size: 12px;
}
.menu-item:not(.pinned) .chat-controls {
  display: none!important;
}
</style>