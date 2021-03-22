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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
