<template>
  <div>
  <router-link to='/pages/drywatch/Maintance'>注干剂管理情况</router-link>
>
  <router-link to='/pages/drywatch/Maintance'>注干剂维护信息</router-link>
      >注干剂信息


    <div style="padding-top:10px">
      <el-table
        border
        :data="maintenanceData.list"
        style="width: 100%"
        height="600"
        stripe 
        :header-cell-style="{background:'#70AD47',color:'#FFFFFF'}"

      >
         <!-- <el-table-column label width="50" align="center" fixed="left">

                </el-table-column>-->
        <el-table-column type="selection" width="55" fixed="left" align="center"></el-table-column>
        <el-table-column prop="batch" label="维护批次" align="center"></el-table-column>
        <el-table-column prop="injectionNum" label="注剂数量" align="center"></el-table-column>
        <el-table-column prop="woodstatus" label="树木状态" align="center"></el-table-column>
         <el-table-column prop="submitDate" label="日期" align="center"></el-table-column>
         <el-table-column prop="workContent" label="工作内容" align="center"></el-table-column>

      </el-table>

    </div>


  </div>
</template>
<script>
import http from '../../../utils/http'
export default {
    name:'DryWatchDeviceMessage',
  data() {
    return {
      username:"",
      deviceID:"",
      startDate:"",
      endDate:"",
      maintenanceData:{
        list: []

},
          date:"",
          num: 0,
          batch:0,
          working_content:"",
          contentLabelIndex: 0,
          drug: "",
  receveData:[],
  receveDataContent:[],
 workingContentDict: ["首次悬挂诱捕器", "换药+收虫", "收虫", "其他"]
    };
  },
  methods: {
    init(){
        this.deviceID=sessionStorage.getItem('deviceID');
        this.username=sessionStorage.getItem('username');
        this.startDate =sessionStorage.getItem('startDate');
        this.endDate =sessionStorage.getItem('endDate');
        this.loadMaintenanceData();
    },
returnlast(){
    this.$router.push({ path: '/pages/device_maintenance.html' });
},
    // 表格相关
    loadMaintenanceData() {

      http.requestWithToken(
        "/dryWatch/maintenance/byDeviceId",
        "get",
        {
          deviceId: this.deviceID,
          myusername:this.username,
          endDate:this.endDate,
          startDate:this.startDate
        },
        res => {
          if (!res.data.error) {
            this.receveData= res.data.data;

            this.showList();
            }else{
this.$message({
              message: "失败",
              type: "error"
            });
            }
        },
        () => {}
      );
    },
showList(){
      if(this.receveData.length>0){
            for (let i = 0; i < this.receveData.length; ++i) {
                  this.contentLabelIndex=this.receveData[i].working_content;
                  this.receveData[i].working_content= this.workingContentDict[this.contentLabelIndex];

                  }
                  this.maintenanceData.list= this.receveData;


    }else{
          this.maintenanceData.list=[];
    }
    }

  },
  mounted() {
    this.init();

    // this.loadOtherBeetleType();
  }
};
</script>
<style>
#tool-row {
  display: flex;
  justify-content: space-between;
}
#userInfoDialogData {
  display: flex;
  justify-content: space-around;
}
</style>


