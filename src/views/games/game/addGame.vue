<template> 
  <game-detail :is-edit='false'></game-detail>
</template>
<script>
import GameDetail from "./components/GameDetail";
export default {
  name: "addGame",
  components: { GameDetail },
};
</script>
<style>
</style>
