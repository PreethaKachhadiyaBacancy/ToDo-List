<template>
  <b-container class="container">
    <b-row>
      <b-col>
        <b-form @submit.prevent="addTodo">
          <b-row align-h="start">
            <b-col cols="9" class="inputRow">
              <b-form-input
                v-model="newTodo"
                type="text"
                placeholder="Create a new to-do..."
              ></b-form-input>
            </b-col>
            <b-col cols="3" class="submitBtn">
              <b-button type="submit" variant="warning">Add</b-button>
            </b-col>
          </b-row>
        </b-form>
      </b-col>
    </b-row>

    <b-row align-h="start">
      <b-col cols="4">
        <b-form-radio-group
          v-model="listVisibility"
          buttons
          button-variant="outline-primary"
        >
          <b-form-radio value="all">All</b-form-radio>
          <b-form-radio value="completed">Completed</b-form-radio>
          <b-form-radio value="uncompleted">Uncompleted</b-form-radio>
        </b-form-radio-group>
      </b-col>
      <b-col cols="6">
        <b-form-input v-model="search" type="text" placeholder="Search a Todo..."></b-form-input>
      </b-col>
    </b-row>

    <b-row>
      <b-list-group v-if="todoList" style="width: 100%">
        <b-list-group-item v-for="todo in todoList" :key="todo.id">
          <b-col cols="1" class="aa">
            <b-form-checkbox
              @change="toggleCompletedStatus(todo.id)"
              v-model="todo.completed"
            ></b-form-checkbox>
          </b-col>
          <b-col cols="6" class="aa">
            <div v-if="!(editId === todo.id)">
              <span
                :style="[
                  todo.completed ? { 'text-decoration': 'line-through' } : null,
                ]"
                >{{ todo.value }}</span
              >
            </div>
            <div v-else>
              <b-form-input
                v-model="editTodo"
                @blur="finishEditTodo(todo.id)"
              ></b-form-input>
            </div>
          </b-col>
          <b-col cols="5" class="btns">
            <b-button
              variant="outline-danger"
              @click="deleteTodo(todo.id)"
              class="deleteBtn"
              >Delete</b-button
            >
            <b-button
              variant="outline-primary"
              @click="startEditTodo(todo.id)"
              class="editBtn"
              >Edit</b-button
            >
          </b-col>
        </b-list-group-item>
      </b-list-group>
      <h2 v-else>No Todos to show.</h2>
    </b-row>
  </b-container>
</template>

<script>
import { Service } from "../service.js";

export default {
  name: "Todo",
  data() {
    return {
      newTodo: "",
      searchTodo: "",
      editTodo: "",
      allTodo: null,
      todoList: null,
      editId: null,
      listVisibility: "all",
      filteredTodoList: null,
      search: ""
    };
  },
  created() {
    this.getTodo();
  },
  computed: {
    filteredTodo: () => {

    }
  },
  watch: {
    listVisibility: function(newValue) {
      if (newValue === "all") {
        this.getTodo();
      } else {
        this.todoList = { ...this.allTodo };

        const keys = Object.keys(this.todoList);

        var temp = {};

        keys.forEach((key) => {
          var isCompleted = newValue === "completed" ? true : false;

          if (this.todoList[key].completed === isCompleted) {
            temp[key] = this.todoList[key];
          }
        });

        this.todoList = {
          ...temp,
        };
      }
    },
  },
  methods: {
    getTodo() {
      Service.get(`todo.json`)
        .then((res) => {
          this.todoList = res.data;
          this.allTodo = { ...this.todoList };
        })
        .catch((error) =>
          this.$toaster.error(
            "Error in getting the Todo from Database" + error,
            { timeout: 3000 }
          )
        );
    },
    addTodo() {
      if (this.newTodo) {
        const todo = {
          id: new Date().toISOString(),
          value: this.newTodo,
          completed: false,
        };

        Service.post(`todo.json`, todo)
          .then(() => {
            this.newTodo = "";
            this.getTodo();
            setTimeout(() => {
              this.$toaster.success("Todo added Succesfully!", {
                timeout: 3000,
              });
            }, 400);
          })
          .catch((error) =>
            this.$toaster.error("Error in adding a Todo" + error, {
              timeout: 3000,
            })
          );
      } else {
        this.$toaster.warning("You cannot add an Empty Todo.", {
          timeout: 3000,
        });
        return;
      }
    },
    getActualId(id) {
      var list = Object.entries(this.todoList);
      const demo = list.find((todo) => todo[1].id === id);
      return demo;
    },
    toggleCompletedStatus(id) {
      var toggleArray = this.getActualId(id);

      console.log("toggleArray", toggleArray);

      var toggledTodo = {
        id: toggleArray[1].id,
        value: toggleArray[1].value,
        completed: toggleArray[1].completed,
      };

      console.log("toggledTodo", toggledTodo);

      var toggleId = toggleArray[0];

      Service.put(`todo/${toggleId}.json`, toggledTodo)
        .then(() => {
          // this.todoList[toggleId].completed = !this.todoList[
          // toggleId.completed
          // ];
          this.todoList = { ...this.todoList };
          this.allTodo = { ...this.todoList };
        })
        .catch((error) =>
          this.$toaster.error("Error in toggling the Todo." + error, {
            timeout: 3000,
          })
        );
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

      Service.put(`todo/${editId}.json`, editedTodo)
        .then(() => {
          this.todoList[editId].value = editedTodo.value;
          this.allTodo = { ...this.todoList };
          this.editId = null;
          this.$toaster.success("Todo edited Succesfully!", {
            timeout: 3000,
          });
        })
        .catch((error) =>
          this.$toaster.error("Error in Editing Todo." + error, {
            timeout: 3000,
          })
        );
    },
    deleteTodo(id) {
      if (confirm("Are You sure you want to Delete the ToDo ?")) {
        var deleteArray = this.getActualId(id);
        var deleteId = deleteArray[0];

        Service.delete(`todo/${deleteId}.json`)
          .then(() => {
            delete this.todoList[deleteId];

            this.todoList = {
              ...this.todoList,
            };

            this.allTodo = { ...this.todoList };

            this.$toaster.success("Todo deleted Succesfully!", {
              timeout: 3000,
            });
          })
          .catch((error) =>
            this.$toaster.error("Error in Deleting Todo." + error, {
              timeout: 30000,
            })
          );
      }
    },
  },
};
</script>

<style scoped>
.container {
  width: 70%;
}

.inputRow,
.submitBtn {
  padding: 0;
}

.submitBtn {
  padding-left: 5%;
}

button[type="submit"] {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  padding: 0;
  font-size: 120%;
  font-weight: 500;
  cursor: pointer;
}

.row {
  margin: 2% auto;
}

.list-group-item {
  display: flex;
  align-items: space-between;
  text-align: left;
  align-content: center;
  padding: 1%;
}

.aa {
  margin: auto 0;
}

span {
  text-align: center;
}

.editBtn,
.deleteBtn
 {
  margin: 0 3%;
  float: right;
}
</style>
