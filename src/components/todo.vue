<template>
  <div class="formDiv">
    <form @submit.prevent="addTodo">
      <input
        type="text"
        placeholder="Create a new to-do..."
        v-model="newTodo"
      />
      <button type="submit">Add</button>
    </form>
    <div class="listDiv">
      <ul v-if="todoList">
        <li v-for="todo in todoList" :key="todo.id">
          <div v-if="!(editId === todo.id)">
            <span>{{ todo.value }}</span>
          </div>
          <div v-else>
            <input
              type="text"
              v-model="editTodo"
              @blur="finishEditTodo(todo.id)"
            />
          </div>
          <button @click="startEditTodo(todo.id)" class="edit">Edit</button>
          <button @click="deleteTodo(todo.id)" class="delete">Delete</button>
        </li>
      </ul>
      <h2 v-else>
        No todo to Show. Please add a new Todo.
      </h2>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Todo",
  data() {
    return {
      newTodo: "",
      searchTodo: "",
      editTodo: "",
      todoList: null,
      editId: null,
    };
  },
  computed: {},
  created() {
    this.getTodo();
  },
  methods: {
    addTodo() {
      if (this.newTodo) {
        const todo = {
          id: new Date().toISOString(),
          value: this.newTodo,
        };
        axios
          .post(
            "https://to-do-list-72aeb-default-rtdb.firebaseio.com/todo.json",
            todo
          )
          .then(() => {
            this.newTodo = "";
            this.getTodo();
            setTimeout(() => {
            this.$toaster.success('Todo added Succesfully!', { timeout: 2000 });
            }, 300);
          })
          .catch((error) => this.$toaster.error('Error in adding a Todo' + error, { timeout: 2000 }));
      } else {
        this.$toaster.warning('You cannot add an Empty Todo.', { timeout: 2000 });
        return;
      }
    },
    getTodo() {
      axios
        .get("https://to-do-list-72aeb-default-rtdb.firebaseio.com/todo.json")
        .then((res) => {
          this.todoList = res.data;
        })
        .catch((error) => this.$toaster.error('Error in getting the Todo from Database' + error, { timeout: 2000 }));
    },
    getActualId(id) {
      var list = Object.entries(this.todoList);
      const demo = list.find((todo) => todo[1].id === id);
      return demo;
    },
    startEditTodo(id) {
      if (this.editId) {
        this.finishEditTodo(id);
      } else {
        this.editId = id;
        var editArray = this.getActualId(id);
        this.editTodo = editArray[1].value;
      }
    },
    finishEditTodo(id) {
      var editArray = this.getActualId(id);
      var editedTodo = {
        id: editArray[1].id,
        value: this.editTodo,
      };

      var editId = editArray[0];

      axios
        .put(
          `https://to-do-list-72aeb-default-rtdb.firebaseio.com/todo/${editId}.json`,
          editedTodo
        )
        .then(() => {
          this.getTodo();
          this.editId = null;
          setTimeout(() => {
            this.$toaster.success('Todo edited Succesfully!', { timeout: 2000 });
            }, 300);
        })
        .catch((error) => this.$toaster.error('Error in Editing Todo.' + error, { timeout: 2000 }));
    },
    deleteTodo(id) {
      if (confirm("Are You sure you want to Delete the ToDo ?")) {
        var deleteArray = this.getActualId(id);
        var deleteId = deleteArray[0];
        axios
          .delete(
            `https://to-do-list-72aeb-default-rtdb.firebaseio.com/todo/${deleteId}.json`
          )
          .then(() => {
            this.getTodo();
            setTimeout(() => {
            this.$toaster.success('Todo deleted Succesfully!', { timeout: 2000 });
            }, 300);
          })
          .catch((error) => this.$toaster.error('Error in Deleting Todo.' + error, { timeout: 2000 }));
      }
    },
  },
};
</script>

<style scoped>
.formDiv {
  width: 70%;
  margin: 0 auto;
}

input[type="text"] {
  border-radius: 5px;
  border: 1px solid lightgray;
  height: 32px;
  width: 70%;
  align-self: flex-start;
  padding-left: 5px;
  font-size: 100%;
  margin: 0;
}

button[type="submit"] {
  display: inline-block;
  width: 10%;
  height: 36px;
  border-radius: 5px;
  background-color: lightpink;
  margin-left: 2%;
  font-size: 110%;
  cursor: pointer;
}

.listDiv {
  margin: 5% auto;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  border: 1px solid lightgray;
  margin: 0 auto;
  padding: 1%;
  border-bottom: 1px solid lightgray;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
}

li > div {
  width: 70%;
  float: inline-start;
}

li > button {
  display: inline-block;
}

.edit {
  width: 10%;
  background-color: lightseagreen;
  cursor: pointer;
  float: inline-start;
  height: 25px;
  margin-right: 2%;
}

.delete {
  display: inline-block;
  width: 10%;
  background-color: rgb(247, 54, 92);
  cursor: pointer;
}
</style>
