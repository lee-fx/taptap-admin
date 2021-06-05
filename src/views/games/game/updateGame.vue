<template> 
  <game-detail :is-edit='true'></game-detail>
</template>
<script>
import GameDetail from "./components/GameDetail";
export default {
  name: "updateGame",
  components: { GameDetail },
};
</script>
<style>
</style>
