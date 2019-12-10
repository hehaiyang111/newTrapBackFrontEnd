<template>
    <div>
        <div style="margin-bottom:20px;display:flex;align-items:center;">
            <el-tag style="height:40px;line-height:40px;border-radius:0;">请选择抄报项目：</el-tag>
            <div style="margin-left:5px;">
                <el-checkbox-group v-model="project" >
                <!-- <el-select v-model="project" placeholder="选择一个项目"> -->
                    <!-- lable和value的值？ -->
                    <el-checkbox label="诱捕器管理" value="诱捕器管理"  ></el-checkbox>
                    <el-checkbox label="注干剂监测" value="注干剂监测"></el-checkbox>
                    <el-checkbox label="天敌防治" value="天敌防治"></el-checkbox>
                    <el-checkbox label="药剂防治" value="药剂防治"></el-checkbox>
                    <el-checkbox label="枯死树采伐" value="枯死树采伐"></el-checkbox>
                    <el-checkbox label="轨迹追踪" value="轨迹追踪"></el-checkbox>
                <!-- </el-select> -->
                </el-checkbox-group>
            </div>
        </div>          
        <div style="margin-bottom:20px;">
            <el-tag style="height:40px;line-height:40px;border-radius:0;">请选择抄报工程：</el-tag>
            <el-select v-model="value" placeholder="抄报工程" >
                <el-option
                v-for="item in options"
                :key="item.username"
                :label="item.username"
                :value="item.username">
                </el-option>
            </el-select>
            <el-button  @click="ReportData" type="primary" style="margin-left:5px">上报</el-button>
        </div>
        
    </div>
</template>

<script>
import http from "../../../utils/http";

export default {
    data(){
        return{
            project:[],   //项目
            CustomProject:'',   //工程
            options: [],    //
            value:''     //工程的值

        }
    },
    mounted(){
      let role = this.$store.state.user.role;
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
      console.log(this.area);

            http.requestWithToken(
            "/system/getCustomProject",
            "get",
            {
                adcode:this.area
            },
            res => {
                console.log(res);
                     for(var i = 0; i < res.data.data.length; i++){
                        this.options.push(res.data.data[i]);
                    }
            },
            () => {}
        );

    },
    methods:{
        ReportData(){
            console.log("数据报告");
            console.log(this.project);
            console.log(this.value);
            for (var j = 0; j < this.project.length; ++j) {
                http.requestWithToken(
                "/system/dataReport",
                "get",
                {
                    project:this.project[j],
                    customProject: this.value
                },
                res => {
                    console.log(res);
                    if(res.data == "OK"){
                      this.$message({
                      message: "上报成功",
                      type: "success"
              });
            }
                },
                    () => {}
                );
                
        }
            

        }
    }
}
</script>

<style>
#sure{
    color: #fff;
    background-color: #1D7155;
    border-color: #1D7155;
}
</style>