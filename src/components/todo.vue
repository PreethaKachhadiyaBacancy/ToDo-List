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
        })
        .catch((error) => console.log("error in addTodo: ", error));

      // alert("Success!!!");
    },
    getTodo() {
      axios
        .get("https://to-do-list-72aeb-default-rtdb.firebaseio.com/todo.json")
        .then((res) => {
          console.log("inside getTodo: ", res.data);
          this.todoList = res.data;
          console.log("todo list:", this.todoList);
        })
        .catch((error) => console.log("error in getting todo list:", error));
    },
    getActualId(id) {
      console.log(id);
      var list = Object.entries(this.todoList);
      // const demo = list.find(([key, value]) => {
      //   console.log('key:', key);
      //   console.log('value:', value);
      //   if(value.id === id) {
      //     // var key1 = key;
      //     return {"key":key}
      //   }
      // });
      console.log("list", list);
      const demo = list.find((todo) => todo[1].id === id);
      // console.log('awrgaerg');
      // var list = Object.entries(this.todoList);
      // console.log('list', list);
      // list.forEach(([key, value]) => {
      //   console.log(id);
      //   console.log('key:', key, 'value:', value.id);
      //   if (value.id === id) {
      //     console.log('inside if');
      //     return key;
      //     // return { key: key, value: value.value };
      //   }
      // return 'hello';
      // });
      return demo;
    },
    getIdAndValue(id) {
      console.log(id);
    },
    startEditTodo(id) {
      // console.log(id);
      if (this.editId) {
        this.finishEditTodo(id);
      } else {
        this.editId = id;
        var editArray = this.getActualId(id);
        this.editTodo = editArray[1].value;
      }

      // this.finishEditTodo(id,editArray);
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
        .then((res) => {
          this.getTodo();
          this.editId = null;
          console.log("inside edit func", res);
          // alert('edit Successful')
        })
        .catch((error) => console.log("error in edit", error));
    },
    deleteTodo(id) {
      // for(var todo in )
      // console.log(this.getActualId(id));
      // var deleteIdObj = {
      //   ...this.getActualId(id)
      // };
      // console.log('deleteObj', deleteIdObj);
      // var deleteId = deleteIdObj.key;
      // console.log('deleteID: ', deleteId);
      // var list = Object.entries(this.todoList);
      // list.forEach(([key, value]) => {
      //   if (value.id === id) {
      //     deleteId = key;
      //   }
      // });
      // console.log('list:', list);
      // for(var element in list) {
      // if(element[0][2].id === id) {
      //   var deleteID = element[0][0];
      // }
      // }
      if (confirm("Are You sure you want to Delete the ToDo ?")) {
        var deleteArray = this.getActualId(id);
        var deleteId = deleteArray[0];
        // console.log(deleteId);
        axios
          .delete(
            `https://to-do-list-72aeb-default-rtdb.firebaseio.com/todo/${deleteId}.json`
          )
          .then(() => {
            this.getTodo();
            // alert("Todo deleted!!");
          })
          .catch((error) => console.log("Error in delete:", error));
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
  /* position: relative; */
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
  /* border: 1px solid gray; */
  /* border-radius: 5px; */
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
  /* display: inline-block; */
  width: 10%;
  background-color: lightseagreen;
  cursor: pointer;
  float: inline-start;
  height: 25px;
  margin-right: 2%;
  /* display: inline-flex; */
}

.delete {
  display: inline-block;
  width: 10%;
  background-color: rgb(247, 54, 92);
  cursor: pointer;
}
</style>
