<template>
  <div id="lobby">
    <div class="lightning">
      <div class="noisy">
        <span>for business</span>
        smart
      </div>
      <div class="noisy">
        games
        <span>studio</span>
      </div>
    </div>

    <div class="menu-item game">
      <label v-on:click="pinMenuItem">
        ИГРОВАЯ КОМНАТА <font-awesome-icon icon="fa-solid fa-thumbtack" class="fa-xs" />
      </label>
      <div>
        <button v-on:click="addGame">Добавить игру</button>
        <div v-for="game in gameList" :key="game._id">
          <router-link v-if="game._id" :to="{ name: 'Game', params: { id: game._id } }">{{ game._id }}</router-link>
          ( {{ game.joinedPlayers }} )
          <span v-if="game.finished">Закончена</span>
          <span v-else>раунд №{{ game.round }}</span>
          <button v-on:click="joinGame({ gameId: game._id })">Присоединиться к игре</button>
          <!-- <button v-on:click="deleteGame({ gameId: game._id })">Удалить игру</button> -->
        </div>
      </div>
    </div>
    <div class="menu-item list">
      <label v-on:click="pinMenuItem">
        СПИСОК ИГР <font-awesome-icon icon="fa-solid fa-thumbtack" class="fa-xs" />
      </label>
      <div>123 456 789</div>
    </div>
    <div class="menu-item chat">
      <label v-on:click="pinMenuItem"> ОБЩЕНИЕ <font-awesome-icon icon="fa-solid fa-thumbtack" class="fa-xs" /> </label>
      <div>
        <div v-for="user in userList" :key="user._id">
          <span>{{ user }}</span>
          <span>(game={{ user.game }})</span>
        </div>
      </div>
    </div>
    <div class="menu-item top">
      <label v-on:click="pinMenuItem">
        ЗАЛ СЛАВЫ <font-awesome-icon icon="fa-solid fa-thumbtack" class="fa-xs" />
      </label>
      <div>123 456 789</div>
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
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';

export default {
  data() {
    return {
      bg: {
        top: 0,
        left: 0,
        showMask: '',
      },
    };
  },
  watch: {
    currentSessionGame: function (val, oldVal) {
      console.log('currentSessionGame', val, oldVal);
    },
    currentSession: function (val, oldVal) {
      console.log('currentSession', val, oldVal);
      //this.$router.push({ path: `/` });
      //this.$store.commit('setGame', {});
    },
  },
  computed: {
    ...mapGetters({
      currentSession: 'currentSession',
      currentSessionGame: 'currentSessionGame',
      isMobile: 'isMobile',
    }),
    listOfTest() {
      return Object.keys(this.$store.state.listOfTest);
    },
    userList() {
      return Object.keys(this.$store.state.lobby?.__user || {}).map(
        (userId) => this.$store.getters.getStore(userId, 'user') || {},
      );
    },
    gameList() {
      return Object.keys(this.$store.state.lobby?.__game || {}).map((gameId) => {
        const game = this.$store.getters.getClone(gameId, 'game') || {};
        if (game?.playerList) {
          game.joinedPlayers = game.playerList.filter((player) => player.ready).length + '/' + game.playerList.length;
        }
        return game;
      });
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
    async addGame() {
      const result = await api.lobby.newGame();
      // if(result.gameId)
      //   await this.joinGame({gameId: result.gameId})
    },
    async joinGame({ gameId }) {
      await api.lobby.joinGame({ gameId: gameId });
    },
    async deleteGame({ gameId }) {
      await api.lobby.deleteGame({ gameId: gameId });
    },
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
  top: attr(data-top px);
  left: 50%;
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
}
.menu-item.pinned > div {
  max-height: none !important;
}
.menu-item:hover > div,
.menu-item.pinned > div {
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
</style>