<template>
    <div>
      <div style="margin-bottom:5px;">
        <el-date-picker v-model="startYear" type="date" value-format="yyyy-MM-dd" placeholder="起始日期"></el-date-picker>
        <el-date-picker v-model="endYear" type="date" value-format="yyyy-MM-dd" placeholder="终止日期"></el-date-picker>
        <el-button type="primary" @click="query()">查询</el-button>
      </div>
      <el-table 
        class="tableGreen" 
        border :data="list" 
        style="width: 100%" height="600" 
        stripe 
        :header-cell-style="{background:'#70AD47',color:'#FFFFFF'}">
        <el-table-column prop="Worker" label="工人名称" align="center"></el-table-column>
        <!-- <el-table-column prop="Worker" label="姓名" align="center"></el-table-column> -->
        <el-table-column prop="Num" label="管理诱捕器数量" align="center"></el-table-column>
        <el-table-column prop="distinctId" label="维护诱捕器数量" align="center"></el-table-column>
        <el-table-column prop="Num1" label="松墨天牛数量" align="center"></el-table-column>
        <el-table-column prop="Num2" label="其它天牛数量" align="center"></el-table-column>
        <el-table-column prop="Num3" label="天牛总数" align="center"></el-table-column>
        <el-table-column prop="day" label="出勤天数" align="center"></el-table-column>
        <el-table-column prop="Avg" label="日均维护诱捕器个次" align="center"></el-table-column>
        <el-table-column prop="Avg1" label="日均捕获天牛数" align="center"></el-table-column>


      </el-table>
    </div>
</template>
<script>
import http from "../../../utils/http";
import echarts from "echarts";

export default {
    data(){
        return{
            list:[],
            startYear:"",
            endYear:"",
            province:"",
            city:"",
            area:"",
            manager:""
        }
    },
    methods:{
        query(){
      let role = this.$store.state.user.role;
      console.log("init");
      console.log(role);
      if (role == 1) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        // this.loadCity();
      } else if (role == 2) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
        // this.loadArea();
      } else if (role == 3) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
        this.area = this.$store.state.user.adcode;
        // this.loadManagers();
      } else if (role == 4) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
        this.area = this.$store.state.user.adcode;
        this.manager = this.$store.state.user.username;
      }

            console.log(this.startYear);
            console.log(this.endYear);
            console.log(this.manager);
                        http.requestWithToken(
        "/statics/worker",
        "get",
        {
            ProjectAdminName:this.manager,
            startM:this.startYear,
            endM:this.endYear
        },
        res => {
            console.log(res);
            this.list = res.data;

        },
        () => {}
      );

        }
    },
          mounted(){

                  let role = this.$store.state.user.role;
      console.log("init");
      console.log(role);
      if (role == 1) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        // this.loadCity();
      } else if (role == 2) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
        // this.loadArea();
      } else if (role == 3) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
        this.area = this.$store.state.user.adcode;
        // this.loadManagers();
      } else if (role == 4) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
        this.area = this.$store.state.user.adcode;
        this.manager = this.$store.state.user.username;
      }

            console.log(this.startYear);
            console.log(this.endYear);
            console.log(this.manager);


      http.requestWithToken(
        "/statics/worker",
        "get",
        {
            ProjectAdminName:this.manager
        },
        res => {
            console.log(res);
            this.list = res.data;

        },
        () => {}
      );

      }

}
</script>
<style lang="scss">
  .tableGreen{
    .el-table__row{
      background-color: #D5E4CF !important;
    }
    .el-table__row--striped{
      background-color: #ECF0EA !important;
    }
  }
</style>