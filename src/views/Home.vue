<template>
  <div class="home">
    currentSessionGame = {{ currentSessionGame }} currentSession =
    {{ currentSession }}
    <img alt="Vue logo" src="../assets/logo.png" />
    <!-- <div v-for="user in userList" :key="user._id">
      <span>{{ user }}</span>
      <span>(game={{ user.game }})</span>
    </div> -->
    <button v-on:click="addGame">Добавить игру</button>
    <div v-for="game in gameList" :key="game._id">
      <!-- <router-link :to="{ name: 'game', params: { id: game._id }}">{{game._id}}</router-link> -->
      <router-link v-if="game._id" :to="{ name: 'Game', params: { id: game._id } }">{{ game._id }}</router-link>
      ( {{ game.joinedPlayers }} )
      <span v-if="game.finished">Закончена</span>
      <span v-else>раунд №{{ game.round }}</span>
      <button v-on:click="joinGame({ gameId: game._id })">Присоединиться к игре</button>
      <button v-on:click="deleteGame({ gameId: game._id })">Удалить игру</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex';

export default {
  data() {
    return {};
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
    }),
    listOfTest() {
      return Object.keys(this.$store.state.listOfTest);
    },
    /* userList() {
      return Object.keys(this.$store.state.lobby?.__user || {}).map(
        (userId) => this.$store.getters.getSimple(userId, "user") || {}
      );
    }, */
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
