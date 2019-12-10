<template>
<div>
  <div id="tool-row">
    <div>
        <el-date-picker v-model="startDate" type="date" value-format="yyyy-MM-dd" placeholder="起始日期" style="width: 150px;"></el-date-picker>
        <el-date-picker v-model="endDate" type="date" value-format="yyyy-MM-dd" placeholder="终止日期" style="width: 150px;"></el-date-picker>
        <el-select v-model="value" placeholder="请选择" style="width: 150px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="input" placeholder="请输入内容" style="width: 180px;"></el-input>
        <el-button type="primary" @click="query()">查询</el-button>
    </div>  
    <div style=" display: flex;" >
      <el-button type="primary" @click="exportExcel">导出</el-button>
      <el-button type="primary" @click="exportImage">导出图像</el-button>
        <!--<el-button type="primary" @click="someExportExcel">批量导出</el-button>-->

        <!--<el-button type="primary" @click="importExcel(scope.$index)">导入</el-button>-->
        <el-upload  class="upload-demo" ref="upload"
        :action="uploadUrl"
        :on-success="loadMaintenanceData">
          <el-button  type="primary"  style="margin-left:20px" >导入</el-button>
        </el-upload>
    </div>
  </div>

        <el-table 
          class="tableGreen"
          border :data="QRData.list" style="width: 100%" height="600"
          stripe 
          :header-cell-style="{background:'#70AD47',color:'#FFFFFF'}">
        <el-table-column prop="scanId" label="设备ID" align="center"></el-table-column>
        <el-table-column prop="serial" label="编号" align="center"></el-table-column>
        <el-table-column prop="customTown" label="区域" align="center"></el-table-column>
        <el-table-column prop="submitDate" label="日期" align="center"></el-table-column>
        <el-table-column prop="batch" label="批次" align="center"></el-table-column>
        <el-table-column prop="longitude" label="经度" align="center"></el-table-column>
        <el-table-column prop="latitude" label="纬度" align="center"></el-table-column>
        <el-table-column label="位置" width="200px" align="center">
          <template
            slot-scope="scope"
          >{{scope.row.province + scope.row.city + scope.row.area + scope.row.town}}</template>
        </el-table-column>
        <el-table-column prop="predatorstype" label="天敌类型" align="center"></el-table-column>
        <el-table-column prop="releaseNum" label="释放数量" align="center"></el-table-column>
        <el-table-column prop="pic" label="照片" align="center">
                            <template slot-scope="scope">
            <el-button
              @click="showPhotoDialog(scope.row.pic)"
              v-if="scope.row.pic != null && scope.row.pic !=''"
              size="mini"
            >显示</el-button>
          </template>

        </el-table-column>
        <el-table-column prop="worker" label="施工人员" align="center"></el-table-column>
        <el-table-column prop="remarks" label="备注" align="center"></el-table-column>
        <el-table-column
          prop="username"
          label="管理员"
          align="center"
          v-if="this.$store.state.user.role == 3"
        ></el-table-column>

                <el-table-column
          label="操作"
          align="center"
          width="150px"
          fixed="right"
          v-if="this.$store.state.user.role == 3 || this.$store.state.user.role == 4"
        >
          <template slot-scope="scope">
            <div v-if="!scope.row.reported">
              <el-button
                style="background-color: #1d7155;border-color: #1d7155;color:#ffffff;"
                size="mini"
                type="primary"
                @click="showEditMaintenanceDataDialog(scope.row)"
                v-if="!scope.row.reported"
              >编辑</el-button>
              <el-button
                style="background-color: #1d7155;border-color: #1d7155;color:#ffffff;"
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                v-if="!scope.row.reported"
              >删除</el-button>
            </div>
            <div v-if="scope.row.reported">不可操作</div>
          </template>
        </el-table-column>
        
      </el-table>

        <div class="block" id="tool-row" >
          <div>
            <el-pagination
                background
                @current-change="handleQRDataCurrentPageChanged"
                :current-page.sync="QRData.page"
                :page-size="10"
                layout="total, prev, pager, next"
                :total="QRData.total"
            ></el-pagination>
          </div>
        <div class="divcss5-right">
          释放地点:{{releasePlace}} &nbsp;
          成虫数量:{{releaseNum}} &nbsp;
          卵卡数量:{{LuanKaNum}} 
        </div>
        </div>
                        <el-dialog title="现场照片" :visible.sync="PhotoDialog.visible" width="700px">
      <div style="overflow-y:scroll;height: 300px">
        <img v-bind:src="PhotoDialog.pic" style="width: 600px; ">
      </div>
    </el-dialog>

        <el-dialog title="编辑维护信息" :visible.sync="EditMaintenanceDialog.visible" width="30%">
      <el-form label-width="120px">
        <el-form-item label="经度">
          <el-input v-model="EditMaintenanceDialog.form.longitude"></el-input>
        </el-form-item>
        <el-form-item label="纬度">
          <el-input v-model="EditMaintenanceDialog.form.latitude"></el-input>
        </el-form-item>
        <!-- <el-form-item label="设备ID">
          <el-input v-model="EditMaintenanceDialog.form.deviceId"></el-input>
        </el-form-item>

        <el-form-item label="编号">
          <el-input v-model="EditMaintenanceDialog.form.serial"></el-input>
        </el-form-item>
        <el-form-item label="区域">
          <el-input v-model="EditMaintenanceDialog.form.customtown"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="日期">
          <el-input v-model="EditMaintenanceDialog.form.submitDate"></el-input>
        </el-form-item> -->
        <el-form-item label="天敌类型">
          <el-input v-model="EditMaintenanceDialog.form.predatorstype"></el-input>
        </el-form-item>
        <el-form-item label="释放数量">
          <el-input v-model="EditMaintenanceDialog.form.releaseNum"></el-input>
        </el-form-item>
        <el-form-item label="工人">
          <el-input v-model="EditMaintenanceDialog.form.worker"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="EditMaintenanceDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click.native.prevent="handleEditMaintenanceDataSubmit">确 定</el-button>
      </div>
    </el-dialog>
    

</div>


</template>

<script>
import http from "../../../utils/http";
export default {
    mounted(){
      this.uploadUrl =
              http.getBaseUrl() +
              "/natural/importExcel?token=" +
              sessionStorage["token"];
     console.log("init");
      let role = this.$store.state.user.role;
              this.loadDevice();
      console.log(role);
      if (role == 1) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
      } else if (role == 2) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
      } else if (role == 3) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
        this.area = this.$store.state.user.adcode;
            }
            else if (role == 4) {
                          this.province = this.$store.state.user.adcode.substr(0, 2);
                          this.city = this.$store.state.user.adcode.substr(0, 4);
                          this.area = this.$store.state.user.adcode;
                          this.manager=this.$store.state.user.username;
                        }
                           console.log(this.city);
                            console.log(this.province);
                             console.log(this.area);

    },
    methods:{
      handleEditMaintenanceDataSubmit(){
         console.log(this.EditMaintenanceDialog.form);
               http.requestWithTokenJson(
        "/natural/updateRec",
        "post",
        this.EditMaintenanceDialog.form,
        res => {
          this.$message.success("修改成功");
          this.EditMaintenanceDialog.visible = false;
          this.loadMaintenanceData();
        },
        () => {}
      );

        this.EditMaintenanceDialog.visible = false;
      },
            handleDelete(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {

          http.requestWithToken(
            "/natural/deleteRecord",
            "post",
            {
              id: row.id,
              deviceID: row.deviceId
            },
            res => {
              if (!res.data.error) {
                this.loadDevice();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.clearMultipleSelection();
              } else {
                this.$message({
                  type: "error",
                  message: "删除失败!"
                });
              }
            },
            () => {}
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      this.loadDevice();
    },
          showEditMaintenanceDataDialog(data) {
            console.log("编辑");
            console.log(data);
      this.EditMaintenanceDialog.visible = true;
      this.EditMaintenanceDialog.form = {
        otherType: "",
        longitude: "",
        latitude: "",
        batch:0,
        deviceId:"",
        id:"",
        
        serial:"",
        customTown:"",
        submitDate:"",
        predatorstype:"",
        releaseNum:"",
        worker:"",
      };
      this.EditMaintenanceDialog.form.id = data.id;
      this.EditMaintenanceDialog.form.longitude = data.longitude;
      this.EditMaintenanceDialog.form.deviceId = data.deviceId;
      this.EditMaintenanceDialog.form.batch = data.batch;
      this.EditMaintenanceDialog.form.latitude = data.latitude;

      this.EditMaintenanceDialog.form.serial = data.serial;
      this.EditMaintenanceDialog.form.customTown = data.customTown;
      this.EditMaintenanceDialog.form.submitDate = data.submitDate;
      this.EditMaintenanceDialog.form.predatorstype = data.predatorstype;
      this.EditMaintenanceDialog.form.releaseNum = data.releaseNum;
      this.EditMaintenanceDialog.form.worker = data.worker;




    },

      loadMaintenanceData(){
        alert("请手动刷新");
      },
      exportExcel(){
        console.log(this.QRData.list);
        let role = this.$store.state.user.role;
          console.log(role);
            console.log(this.area);
            console.log(this.city);
              console.log(this.province);


        /**
         *        colName: this.value,
                  searchText: this.input,
                  adcode: this.area
         */
        console.log(http.getBaseUrl());
        setTimeout(()=>{
                  window.location =
        http.getBaseUrl() +
        "/natural/exportExcel?startDate=" +
        this.startDate +
        "&endDate=" +
        this.endDate +
        "&searchText=" +
        this.input +
        "&colName=" +
        this.value +
        "&adcode=" +
        this.area +
        "&username="+
        sessionStorage['username'] +
        "&token=" +
        sessionStorage["token"];
        },1000)

      },
      exportImage(){
        console.log(this.QRData.list);
        let role = this.$store.state.user.role;
          console.log(role);
            console.log(this.area);
            console.log(this.city);
              console.log(this.province);


        /**
         *        colName: this.value,
                  searchText: this.input,
                  adcode: this.area
         */
        console.log(http.getBaseUrl());
        setTimeout(()=>{
                  window.location =
        http.getBaseUrl() +
        "/natural/exportImage?startDate=" +
        this.startDate +
        "&endDate=" +
        this.endDate +
        "&searchText=" +
        this.input +
        "&colName=" +
        this.value +
        "&adcode=" +
        this.area +
        "&username="+
        sessionStorage['username'] +
        "&token=" +
        sessionStorage["token"];
        },1000)

      },

    showPhotoDialog(id) {
            console.log(id);
      this.PhotoDialog.visible = true;
     // let BASE_URL = "http://47.103.66.70:8081";
    let BASE_URL = "http://106.15.200.245:50000";
      this.PhotoDialog.pic = BASE_URL + "/device_img?imgName=" + id;
    },

      handleQRDataCurrentPageChanged(val) {
        this.QRData.page = val;
        console.log("valChange" + val);
        this.loadDevice();
      },
      query(){
        console.log("query");
        console.log(this.startDate);
        console.log(this.endDate);
        console.log(this.input);
        console.log(this.value);
        let role = this.$store.state.user.role;
          console.log(role);
            console.log(this.area);
            console.log(this.city);
              console.log(this.province);
          // if(role==3){
                        http.requestWithToken(
                "/natural/searchDetail",
                "post",
                { 
                  page: this.QRData.page, 
                  limit: 10, 
                  username: sessionStorage['username'],
                  startDate: this.startDate,
                  endDate: this.endDate,
                  colName: this.value,
                  searchText: this.input,
                  adcode: this.area
                },
                res => {
                  console.log(res);
                this.QRData.list = res.data.data;
                this.QRData.total = res.data.totalNum;

                this.LuanKaNum = res.data.data[0].LuanKaNum;
                this.releaseNum = res.data.data[0].releaseNum;
                this.releasePlace = res.data.data[0].deviceNum;


                },
                () => {}
            );

          // }


      },
      handleQRDataCurrentPageChanged() {
        console.log("hello");
        this.loadDevice();
      },

        loadDevice() {
          console.log("load");
                let role = this.$store.state.user.role;
                this.role = role;
          console.log(this.role);
          if(this.role == 3){
              console.log(sessionStorage['username']);
            http.requestWithToken(
                "/natural/areaDetail",
                "post",
                { page: this.QRData.page, limit: 10, username: sessionStorage['username']},
                res => {
                this.QRData.list = res.data.Data;
                this.QRData.total = res.data.total;

                this.LuanKaNum = res.data.LuanKaNum;
                this.releaseNum = res.data.releaseNum;
                this.releasePlace = res.data.deviceNum;

                },
                () => {}
            );
          }else if(this.role == 4){
              http.requestWithToken(
                "/natural/searchDetail",
                "post",
                { page: this.QRData.page, limit: 10, username: sessionStorage['username'],
                  startDate: this.startDate,
                  endDate: this.endDate,
                  colName: this.value,
                  searchText: this.input,
                  adcode: this.area
                },
                res => {
                                console.log(res.data);

                this.QRData.list = res.data.data.data;
                this.QRData.total = res.data.data.totalNum;


                

                this.LuanKaNum = res.data.data.data[0].luanKaNumSum;
                this.releaseNum = res.data.data.data[0].releaseNum;
                this.releasePlace = res.data.data.data[0].deviceNum;

                },
                () => {}
            );
          }
        },
    },
    data(){
        return{
      EditMaintenanceDialog: {
        visible: false,
        form: {
          id: 0,
          batch:0,
          num: 0,
          otherNum: 0,
          otherType: "",
          longitude: "",
          latitude: "",
          altitude:"",
          workingContent: 0,
          deviceId:"",
          drug: ""
        }
      },
        role:'',
        releasePlace:0,
        releaseNum:0,
        LuanKaNum:0,
                      PhotoDialog: {
        visible: false,
        pic: ""
      },
      
        QRData: {
            selectedIndex: -1,
            list: [],
            page: 1,
            limit: 10,
            total: 0
        },
        startDate:'',
        endDate: '',
        options: [{
          value: 'CustomSerial',
          label: '编号'
        }, {
          value: 'CustomTown',
          label: '区域'
        }, {
          value: 'batch',
          label: '批次'
        }, {
          value: 'Worker',
          label: '施工人员'
        }],
        value: '',
        input:'',
        province:'',
        city:'',
        area:'',
        manager:''

        }
    },
    name:'NaturalEnemiesDataDetail'
}
</script>

<style lang="scss">
#tool-row {
  /* display: flex; */
  justify-content: space-between;
  margin-bottom: 5px;
  display:flex;
}
.tableGreen{
    .el-table__row{
      background-color: #D5E4CF !important;
    }
    .el-table__row--striped{
      background-color: #ECF0EA !important;
    }
  }
#search{
    background: #1D7155;
    border-color: #1D7155;
    color: #fff;
}
#upload{
    background: #1D7155;
    border-color: #1D7155;
    color: #fff;
}
#download{
    background: #1D7155;
    border-color: #1D7155;
    color: #fff;
    height:fit-content;
}
// .el-button--danger:focus{
//     background: #f78989;
//     border-color: #f78989;
//     color: #fff;
// }
// .el-button--danger:hover{
//     background: #1d7155;
//     border-color: #1d7155;
//     color: #fff;
// }
.divcss5-right{float:right} 
</style>