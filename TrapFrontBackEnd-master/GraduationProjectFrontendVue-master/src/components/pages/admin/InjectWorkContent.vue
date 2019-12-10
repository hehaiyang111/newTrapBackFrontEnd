<template>
  <div>
    <div id="tool-row">
      <div></div>
      <div>
        <el-button type="primary" @click="showAdd">增加</el-button>
      </div>
    </div>
    <div style="padding-top:5px">
      <el-table border :data="list" style="width: 100%" height="600"
      stripe
      :header-cell-style="{background:'#70AD47',color:'#FFFFFF'}">
        <el-table-column prop="id" label="id" align="center"></el-table-column>
        <el-table-column prop="name" label="名称" align="center"></el-table-column>
        <el-table-column label="操作" align="center"> 
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="showEdit(scope.row)"
              v-if="$store.state.user.role == 0"
              :size="'mini'"
            >编辑</el-button>
            <el-button type="danger" @click="handleDelete(scope.row)" :size="'mini'">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="isAdd? '增加' : '编辑' " :visible.sync="dialogVisible" width="30%">
      <el-form label-width="150px">
        <el-form-item label="id" v-if="!isAdd">
          <el-input disabled style="width:150px" v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="名称：">
          <el-input style="width:150px" v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native.prevent="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="增加" :visible.sync="townUserDialogVisible" width="30%">
      <el-select v-model="townUserToAdd">
        <el-option
          v-for="item in townUserListCanAdd"
          :value="item.id"
          :key="item.id"
          :label="item.name"
        ></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.native.prevent="handleSubmitTownUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import http from "../../../utils/http";
export default {
  data() {
      name:'Trapinject_workContent'
    return {
      list: [],
      townUserListCanAdd: [],
      townUserToAdd: "",
      allList:"",
      leftlist:[],
      dialogVisible: false,
      townUserDialogVisible: false,
      isAdd: true,
      form: {
        id: "",
        name: ""
      }
    };
  },
  methods: {
    loadOtherBeetleData() {
      let url = "/auth_api/inject_workContent";
       let role = this.$store.state.user.role;
       console.log(role);
      if (this.$store.state.user.role == 4) {
        url = "/auth_api/inject_workContent/town";
      }
      http.requestWithToken(
        url,
        "get",
        {},
        res => {
          console.log(res);
          this.list = res.data.data;
          if (this.$store.state.user.role == 4) {
            this.list = res.data;
            console.log("list");
            console.log(this.list);
            this.loadAll();
          }
        },
        () => {}
      );
    },
    loadAll() {
    this.townUserListCanAdd=[];
      http.requestWithToken(
        "/auth_api/inject_workContent",
        "get",
        {},
        res => {
          console.log("workContent");
          console.log(res);
          this.leftlist = res.data.data;
          let lefti=0;
          for (let i = 0; i < this.leftlist.length; ++i) {
            let found = 0;
            for (let j = 0; j < this.list.length; ++j) {
              if (this.leftlist[i].id == this.list[j].id) {
                found = 1;
                break;
              }
            }
            if (found==0) {
                this.allList=this.leftlist[i];
                this.townUserListCanAdd.push(this.allList);

            }

          }

        },
        () => {}
      );
    },
    showAdd() {
      if (this.$store.state.user.role == 4) {
        this.townUserToAdd = "";
        this.townUserDialogVisible = true;
        return;
      }
      this.isAdd = true;
      (this.form.id = ""), (this.form.name = "");
      this.dialogVisible = true;
    },
    showEdit(data) {
      this.isAdd = false;
      this.form.id = data.id;
      this.form.name = data.name;
      this.dialogVisible = true;
    },
    handleTownSubmit() {
      http.requestWithToken(
        "/auth_api/inject_workContent",
        "post",
        { name: this.form.name },
        res => {
          if (!res.data.error) {
            this.$message.success("添加成功");
            this.townUserDialogVisible = false;

          }
          this.loadOtherBeetleData();
        },
        () => {}
      );
    },
    handleSubmit() {
      if (this.isAdd) {
        http.requestWithToken(
          "/auth_api/inject_workContent",
          "post",
          { name: this.form.name },
          res => {
            if (!res.data.error) {
              this.$message.success("添加成功");
              this.dialogVisible = false;

            }
            this.loadOtherBeetleData();
          },
          () => {}
        );
      } else {
        http.requestWithToken(
          "/auth_api/inject_workContent",
          "put",
          { id: this.form.id, name: this.form.name },
          res => {
            if (!res.data.error) {
              this.$message.success("修改成功");
              this.dialogVisible = false;
              this.loadOtherBeetleData();
            }
          }
        );
      }
    },
    handleSubmitTownUser() {
      http.requestWithToken(
        "/auth_api/inject_workContent/town",
        "post",
        { beetleInfoId: this.townUserToAdd },
        res => {
          if (!res.data.error) {
            this.$message.success("添加成功");
            this.townUserDialogVisible = false;

          }
this.loadOtherBeetleData();
        },
        () => {}
      );

    },
    handleDelete(data) {
      if (this.$store.state.user.role == 0) {
        http.requestWithToken(
          "/auth_api/inject_workContent",
          "delete",
          { id: data.id },
          res => {
            if (!res.data.error) {
              this.$message.success("删除成功");
              this.dialogVisible = false;
              this.loadOtherBeetleData();
            }
          },
          () => {}
        );
      } else if (this.$store.state.user.role == 4) {
        http.requestWithToken(
          "/auth_api/inject_workContent/town",
          "delete",
          { beetleInfoId: data.id },
          res => {
            if (!res.data.error) {
              this.$message.success("删除成功");
              this.dialogVisible = false;

            }
            this.loadOtherBeetleData();
          },
          () => {}
        );
      }

    }

  },
  mounted() {
    this.loadOtherBeetleData();
  }
};
</script>
<style>
#tool-row {
  display: flex;
  justify-content: space-between;
}
#edit{
    border:#1D7155;
    background-color:#1D7155 
}
#add{
    border:#1D7155;
    background-color:#1D7155 
}
/* .el-button {
    color: #fff;
    background-color: #1D7155;
    border-color: #1D7155;
}
.el-button--danger:focus{
    background: #f78989;
    border-color: #f78989;
    color: #fff;
}
.el-button--danger:hover{
    background: #1d7155;
    border-color: #1d7155;
    color: #fff;
} */
</style>


