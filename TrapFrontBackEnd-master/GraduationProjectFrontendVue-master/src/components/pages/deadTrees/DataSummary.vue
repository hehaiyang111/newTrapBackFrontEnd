<template>
  <div>
    <div>
      <el-select
        placeholder="市"
        v-if="this.$store.state.user.role < 2"
        v-model="city"
        @change="cityChanged"
      >
        <el-option value>全部</el-option>
        <el-option v-for="item in cities" :value="item.code" :key="item.code" :label="item.name"></el-option>
      </el-select>
      <el-select
        placeholder="县"
        v-if="this.$store.state.user.role < 3"
        v-model="area"
        @change="areaChanged()"
      >
        <el-option value>全部</el-option>
        <el-option v-for="item in areas" :value="item.code" :key="item.code" :label="item.name"></el-option>
      </el-select>
      <el-date-picker v-model="startDate" type="date" value-format="yyyy-MM-dd" placeholder="起始日期"></el-date-picker>
      <el-date-picker v-model="endDate" type="date" value-format="yyyy-MM-dd" placeholder="终止日期"></el-date-picker>
      <el-button type="primary" @click="query()">查询</el-button>
    </div>
    <div style="font-size:18px;color:#1D7155">
      <br>
       枯死木总株数:{{totalCount}} &nbsp;&nbsp;&nbsp;&nbsp; 总材积数：{{totalSum}}
      <br>
      <br>
    </div>

    <el-tabs id="statistics-tabs" v-model="tabPage" type="card">

            <el-card :header="'各' + contentLabelDict[contentLabelIndex] + '枯死树管理情况表'" style="padding:5px; font-size:16px;color:#1D7155" v-if="this.$store.state.user.role < 4">
              <el-table :data="summaryDeviceData.list" :row-style="tableRowStyle">
                <el-table-column :label="contentLabelDict[contentLabelIndex]" prop="name"></el-table-column>
                <el-table-column label="枯死树数量" prop="woodNum"></el-table-column>
                <el-table-column label="总材积（m³）" prop="woodVolume"></el-table-column>
                <el-table-column label="处理方式(株)" prop="mannerSum0"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" @click="showMaintenanceView(scope.row.name)">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>

            </el-card>

            <el-card header="各工人枯死树管理情况表" style="padding:5px; font-size:16px;color:#1D7155" v-if="this.$store.state.user.role >3">
              <el-table :data="summaryWorkerData.list" :row-style="tableRowStyle">
                <el-table-column label="工人" prop="name"></el-table-column>
                <el-table-column label="诱捕器总数" prop="deviceCount"></el-table-column>
                <el-table-column label="总诱虫量" prop="releaseNum"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button  type="primary" @click="showMaintenanceView(scope.row.name)">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>

            </el-card>
            <el-card header="各项目工程诱捕情况表" style="padding:5px; font-size:16px;color:#1D7155" v-if="this.$store.state.user.role ==3">
                          <el-table :data="summaryManagerData.list" :row-style="tableRowStyle">
                            <el-table-column label="项目工程" prop="name"></el-table-column>
                            <el-table-column label="枯死树数量" prop="woodNum"></el-table-column>
                            <el-table-column label="总材积（m³）" prop="woodVolume"></el-table-column>
                            <el-table-column label="处理方式(株)" prop="mannerSum"></el-table-column>
                            <el-table-column label="操作">
                              <template slot-scope="scope">
                                <el-button type="primary" @click="showMaintenanceView(scope.row.name)">查看</el-button>
                              </template>
                            </el-table-column>
                          </el-table>

                        </el-card>

        </el-tabs>

    <el-dialog :title="'设备维护信息'" :visible.sync="dialogVisible" >
      <t-maintenance-data ref="maintenanceView"></t-maintenance-data>
    </el-dialog>

  </div>

</template>
<script>
import http from "../../../utils/http";
import echarts from "echarts";
import MaintenanceData from "../MaintenanceData.vue";
export default {
name:'DeadTreesDataSummary',
  components: {
    "t-maintenance-data": MaintenanceData
  },
  data() {
    return {

    returNnum:0,
    levelList: null,
      dialogVisible: false,
      provinces: [],
      province: "",
      cities: [],
      city: "",
      areas: [],
      area: "",
      towns: [],
      town: "",
      managers: [],
      manager: "",
      startDate: "",
      endDate: "",

      contentLabelDict: ["市", "县", "乡镇", "管理员","工人"],
      contentLabelIndex: 0,
          summaryData:[],
          deviceCount:0,
          beetleCount:0,
          dCount:0,
          bCount:0,
      summaryDeviceData: {
        list: [],
        page: 1,
        limit: 9999,
        name: "",
        deviceCount:0,
        beetleCount:0
      },
      managerData:[],
      summaryManagerData: {
            list: [],
            page: 1,
            limit: 9999,
            name: "",
            deviceCount:0,
            beetleCount:0
       },
      summaryWorkerData: {
        list: [],
        page: 1,
        limit: 9999,
        name:"",
        deviceCount:0,
        beetleCount:0
      },
      tabPage: "first",
      totalCount: 0,
      totalSum: 0
    };
  },
  methods: {
    init() {
      let role = this.$store.state.user.role;
      console.log(role);
      if (role == 1) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.loadCity();
      } else if (role == 2) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
        this.loadArea();
      } else if (role == 3) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
        this.area = this.$store.state.user.adcode;
      this.loadManagers();
            }
            else if (role == 4) {
                          this.province = this.$store.state.user.adcode.substr(0, 2);
                          this.city = this.$store.state.user.adcode.substr(0, 4);
                          this.area = this.$store.state.user.adcode;
                          this.manager=this.$store.state.user.username;
                        }


    },
    querySum(adcode) {
      http.requestWithToken(
        "/deadTree/Summary/sum",
        "get",
        {
          adcode: adcode,
          startDate: this.startDate,
          endDate: this.endDate,
                  },
        res => {
          this.totalCount = res.data.data.count;
          this.totalSum = res.data.data.sum;
        },
        () => {}
      );
    },
    query() {
      this.tabPage = "first";
      // 管理员只查看下级工人统计信息
      let role = this.$store.state.user.role;
      if (role == 4) {
        this.queryWorkerData(this.manager);
      }
      if (role == 3) {
        if (this.manager == "") {
          this.queryTownData();
        } else {
          this.queryManagerData();
        }
      }
      if (role == 2) {
        if (this.area == "" && this.manager == "") {
          this.queryAreaData();
        }
        if (this.area != "" && this.manager == "") {
          this.queryTownData();
        }
        if (this.area != "" && this.manager != "") {
          this.queryWorkerData();
        }
      }
      if (role == 1) {
        if (this.city == "") {
          this.queryCityData();
        }
        if (this.city != "" && this.area == "") {
          this.queryAreaData();
        }
        if (this.city != "" && this.area != "" && this.manager == "") {
          this.queryTownData();
        }
        if (this.city != "" && this.area != "" && this.manager != "") {
          this.queryWorkerData();
        }
      }

    },
    queryWorkerData(adcode) {
      //   this.contentLabelIndex = 3;
      http.requestWithToken(
        "/deadTree/Summary/worker",
        "get",
        {
          adcode: adcode,
          startDate: this.startDate,
          endDate: this.endDate,
          page: this.summaryWorkerData.page,
          limit: this.summaryWorkerData.limit
        },
        res => {
          this.summaryWorkerData.list = res.data.data.data;

          if(this.$store.state.user.role == 4){

                this.querySum(this.manager);
                }
        },
        () => {}
      );

    },

    summaryTotalData(){
              this.dCount = 0;
              this.bCount= 0;
        if(this.summaryData.length>0){

            for(let i=0;i<this.summaryData.length;++i){
                  this.dCount=this.summaryData[i].deviceCount;
                  this.bCount=this.summaryData[i].beetleCount;
            }
            this.totalCount =this.dCount;
            this.totalSum = this.bCount;
        }else{
                  this.totalCount = 0;
                  this.totalSum = 0;
        }
    },
    queryTownData() {
      this.contentLabelIndex = 2;
      http.requestWithToken(
        "/deadTree/Summary/area",
        "get",
        {
          adcode: this.area,
          startDate: this.startDate,
          endDate: this.endDate,
          page: this.summaryDeviceData.page,
          limit: this.summaryDeviceData.limit
        },
        res => {
          this.summaryDeviceData.list = res.data.data.data;
          console.log(this.summaryDeviceData.list);
          // this.makeAnalysisData(res.data.data.analysisEntity);
        },
        () => {}
      );
      if(this.$store.state.user.role == 3) {
            this.queryManagerData();
      }else{
            this.queryWorkerData(this.area);
            this.querySum(this.area);
      }
    },
    queryManagerData() {
          this.contentLabelIndex = 2;
          http.requestWithToken(
            "/deadTree/Summary/manager",
            "get",
            {
              adcode: this.area,
              startDate: this.startDate,
              endDate: this.endDate,
              page: this.summaryDeviceData.page,
              limit: this.summaryDeviceData.limit
            },
            res => {
              this.summaryManagerData.list = res.data.data.data;
              this.managerData=res.data.data;
              // this.makeAnalysisData(res.data.data.analysisEntity);
            },
            () => {}
          );
 this.querySum(this.area);

        },
    queryAreaData() {
      this.contentLabelIndex = 1;
      http.requestWithToken(
        "/deadTree/Summary/city",
        "get",
        {
          adcode: this.city,
          startDate: this.startDate,
          endDate: this.endDate,
          page: this.summaryDeviceData.page,
          limit: this.summaryDeviceData.limit
        },
        res => {
          this.summaryDeviceData.list = res.data.data.data;
          // this.makeAnalysisData(res.data.data.analysisEntity);

        },
        () => {}
      );
      this.queryWorkerData(this.city);
      this.querySum(this.city);

    },
    queryCityData() {
      this.contentLabelIndex = 0;
      http.requestWithToken(
        "/deadTree/Summary/province",
        "get",
        {
          adcode: this.province,
          startDate: this.startDate,
          endDate: this.endDate,
          page: this.summaryDeviceData.page,
          limit: this.summaryDeviceData.limit
        },
        res => {
          this.summaryDeviceData.list = res.data.data.data;

        },
        () => {}
      );
      this.queryWorkerData(this.province);
      this.querySum(this.province);
    },
    makeAnalysisData(data) {
      console.log(data);
      let list = [];
      list.push({
        "0": this.contentLabelDict[this.contentLabelIndex] + "间",
        "1": data.ssa,
        "2": data.dfa,
        "3": data.msa,
        "4": data.f,
        "5": data.fcrit,
        "6": data.r
      });
      list.push({
        "0": this.contentLabelDict[this.contentLabelIndex] + "内",
        "1": data.sse,
        "2": data.dfe,
        "3": data.mse,
        "4": "",
        "5": "",
        "6": ""
      });
      list.push({
        "0": "总计",
        "1": data.sst,
        "2": data.dft,
        "3": "",
        "4": "",
        "5": "",
        "6": ""
      });
      this.analysisList = list;
      console.log(this.analysisList);
    },
    loadProvince() {
      http.requestWithToken(
        "/auth_api/dist/provinces",
        "get",
        {},
        res => {
          console.log(res.data);
          this.provinces = res.data;
          this.province = "";
          this.city = "";
          this.area = "";
          this.cities = [];
          this.areas = [];
          // this.userInfoDialog.form.area = ''
        },
        () => {}
      );
    },
    loadCity() {
      http.requestWithToken(
        "/auth_api/dist/cities",
        "get",
        { id: this.province },
        res => {
          this.cities = res.data;
          this.city = "";
          this.area = "";
          this.areas = [];
        },
        () => {}
      );
    },
    loadArea() {
      http.requestWithToken(
        "/auth_api/dist/areas",
        "get",
        { id: this.city },
        res => {
          this.area = "";
          this.areas = res.data;
        },
        () => {}
      );
    },
    loadManagers() {
      http.requestWithToken(
        "/auth_api/manager_list",
        "get",
        { adcode: this.area },
        res => {
          // alert()
          this.managers = res.data.data;
          console.log(this.managers);
        },
        () => {}
      );
    },
    areaChanged() {
      this.manager = "";
      this.loadManagers();
    },
    cityChanged() {
      this.area = "";
      this.manager = "";
      this.loadArea();
    },

    tableRowStyle({ row, rowIndex }) {
      return "border: 0;border-top-color:white;";
    },
    // 修改table header的背景色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background-color: lightblue;color: #fff;font-weight: 500;";
      }
    },
    showMaintenanceView(name) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.maintenanceView.setSearchText(name);
        this.$refs.maintenanceView.loadMaintenanceData();
      });
      sessionStorage.setItem('SearchText',name);
      sessionStorage.setItem('startDate',this.startDate);
      sessionStorage.setItem('endDate',this.endDate);

this.$router.push({ path: '/pages/deadTrees/Maintance' });

    }
  },
  mounted() {
    this.init();

  }
};
</script>
<style>
#statistics-tabs .el-table thead {
  color: black;
  font-weight: 500;
}
#statistics-tabs .el-table__header-wrapper table {
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
}
#statistics-tabs .el-table__body-wrapper {
  padding-bottom: 5px;
}
#statistics-tabs .el-table__body-wrapper table {
  border-bottom: 1px solid #000;
}
#statistics-tabs .el-table__body-wrapper tbody {
  border-top-color: white;
  border-bottom-color: white;
}
#statistics-tabs .el-table__body-wrapper tr {
  border-top-color: white;
  border-bottom-color: white;
}
#search{
    color: #fff;
    background-color: #1D7155;
    border-color: #1D7155;
}
#chakan{
    color: #fff;
    background-color: #1D7155;
    border-color: #1D7155;
}
#chakan1{
    color: #fff;
    background-color: #1D7155;
    border-color: #1D7155;
}
#chakan2{
    color: #fff;
    background-color: #1D7155;
    border-color: #1D7155;
}
/* .el-button--primary {
    background: #1D7155;
    border-color: #1D7155;
    color: #fff;
}
.el-button {
    color: #fff;
    background-color: #1D7155;
    border-color: #1D7155;
} */
</style>


