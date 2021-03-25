<template>
  <!-- <div class="formDiv">
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
  </div> -->
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
    </b-row>

    <b-row>
      <b-col>
        <b-row>
          <b-list-group v-if="todoList" style="width: 100%">
            <b-list-group-item v-for="todo in todoList" :key="todo.id">
              <b-col cols="1" class="aa">
                <b-form-checkbox
                  @click="toggleCompletedStatus(todo.id)"
                ></b-form-checkbox>
              </b-col>
              <b-col cols="8" class="aa">
                <div v-if="!(editId === todo.id)">
                  <span>{{ todo.value }}</span>
                </div>
                <div v-else>
                  <b-form-input
                    v-model="editTodo"
                    @blur="finishEditTodo(todo.id)"
                  ></b-form-input>
                </div>
              </b-col>
              <b-col cols="3">
                <b-button
                  variant="outline-primary"
                  @click="startEditTodo(todo.id)"
                  class="editBtn"
                  >Edit</b-button
                >
                <b-button
                  variant="outline-danger"
                  @click="deleteTodo(todo.id)"
                  class="deleteBtn"
                  >Delete</b-button
                >
              </b-col>
            </b-list-group-item>
          </b-list-group>
        </b-row>
      </b-col>
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
      todoList: null,
      editId: null,
      listVisibility: "all",
    };
  },
  created() {
    this.getTodo();
  },
  watch: {

  },
  methods: {
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
    getTodo() {
      Service.get(`todo.json`)
        .then((res) => {
          this.todoList = res.data;
          console.log("todoList:", this.todoList);
        })
        .catch((error) =>
          this.$toaster.error(
            "Error in getting the Todo from Database" + error,
            { timeout: 3000 }
          )
        );
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

      Service.put(`todo/${editId}.json`, editedTodo)
        .then(() => {
          this.todoList[editId].value = editedTodo.value;
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

            console.log(this.todoList);

            // const tempTodoList = this.todoList.fi

            // const tempTodoList = arrayTodo.filter(([key, value]) => console.log(key, value.id));

            // this.todoList = {
            //   ...tempTodoList
            // };

            this.$toaster.success("Todo deleted Succesfully!", {
              timeout: 3000,
            });
            // setTimeout(() => {
            //   this.$toaster.success("Todo deleted Succesfully!", {
            //     timeout: 3000,
            //   });
            // }, 500);
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
/* .formDiv {
  width: 70%;
  margin: 0 auto;
} */

/* input[type="text"] {
  border-radius: 5px;
  border: 1px solid lightgray;
  height: 32px;
  width: 70%;
  align-self: flex-start;
  padding-left: 5px;
  font-size: 100%;
  margin: 0;
} */

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
  /* display: inline-block; */
  width: 100%;
  height: 100%;
  border-radius: 5px;
  padding: 0;
  /* background-color: lightpink; */
  /* margin-left: 2%; */
  font-size: 120%;
  font-weight: 500;
  cursor: pointer;
}

.row {
  margin: 2% auto;
}

/* .list-group { */
/* display: flex; */
/* flex-direction: row; */
/* align-items: center; */
/* } */

.list-group-item {
  display: flex;
  align-items: space-between;
  text-align: left;
  align-content: center;
  padding: 1%;
  /* flex-direction: ; */
}

.aa {
  margin: auto 0;
}

.deleteBtn,
.editBtn {
  margin: 0 3%;
}

/* .listDiv {
  margin: 5% auto;
} */

/* ul {
  list-style: none;
  margin: 0;
  padding: 0;
} */

/* li {
  border: 1px solid lightgray;
  margin: 0 auto;
  padding: 1%;
  border-bottom: 1px solid lightgray;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
} */

/* li > div {
  width: 70%;
  float: inline-start;
} */

/* li > button {
  display: inline-block;
} */

/* .edit {
  width: 10%;
  background-color: lightseagreen;
  cursor: pointer;
  float: inline-start;
  height: 25px;
  margin-right: 2%;
} */

/* .delete {
  display: inline-block;
  width: 10%;
  background-color: rgb(247, 54, 92);
  cursor: pointer;
}  */
</style>
