<template>
  <div id="app">
    <div>
      <h1>To Do List</h1>
    </div>
    <todo></todo>
  </div>
</template>

<script>

import Todo from  './components/todo.vue';

export default {
  components: {
    Todo
  }
}
</script>

<style lang="scss">
#app {
  text-align: center;
}

</style>
