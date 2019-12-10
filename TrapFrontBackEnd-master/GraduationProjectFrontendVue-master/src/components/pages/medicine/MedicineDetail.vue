<template>
  <div>
    <div id="tool-row">
      <div>
          <!-- <span style="font-size: 14px">搜索条件:</span> -->
          <el-date-picker v-model="DryWatchData.startDate" type="date" value-format="yyyy-MM-dd"
                          placeholder="起始日期" style="width: 150px;"></el-date-picker>
          <el-date-picker v-model="DryWatchData.endDate" type="date" value-format="yyyy-MM-dd"
                          placeholder="终止日期" style="width: 150px;"></el-date-picker>
          <el-select v-if="this.$store.state.user.role==3 || this.$store.state.user.role==4" placeholder="编号/区域/批次/施工人员" v-model="selected" style="width: 220px;">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
   
            <!-- <span style="font-size: 14px; ">搜索内容:</span> -->
            <el-input style="width: 200px" placeholder="搜索内容" v-model="searchText"></el-input>
            <el-button type="primary" @click="handleSubmit">搜索</el-button>
      </div>
      <div style=" display: flex;">
            <el-button type="primary" @click="exportExcel">导出</el-button>
                      <el-button  type="primary" @click="exportImage" style="height: fit-content;">导出图像</el-button>

              <!--<el-button type="primary" @click="someExportExcel">批量导出</el-button>-->

              <!--<el-button type="primary" @click="importExcel(scope.$index)">导入</el-button>-->
              <el-upload  class="upload-demo" ref="upload"
              :action="uploadUrl"
              :on-success="loadDevice">
                <el-button type="primary" style="margin-left:20px" >导入</el-button>
              </el-upload>

      </div>
    </div>
    <el-table 
        class="tableGreen" border :data="DryWatchData.list" style="width: 100%" height="600"
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
      <el-table-column prop="workContent" label="工作内容" align="center"></el-table-column>
      <el-table-column prop="medicineQua" label="施药数量（kg）" align="center"></el-table-column>
      <el-table-column prop="medicineName" label="药剂名称" align="center"></el-table-column>
      <el-table-column prop="areaFz" label="防治面积（㎡）" align="center"></el-table-column>
      <el-table-column prop="pic"  label="照片" align="center">
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
        v-if="this.$store.state.user.role === 3"
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
        <el-dialog title="现场照片" :visible.sync="PhotoDialog.visible" width="700px">
      <div style="overflow-y:scroll;height: 300px">
        <img v-bind:src="PhotoDialog.pic" style="width: 600px; ">
      </div>
    </el-dialog>

        <el-dialog title="编辑维护信息" :visible.sync="EditMaintenanceDialog.visible" width="30%">
      <el-form label-width="120px">
        
        <el-form-item label="经度">
            <el-input  v-model="EditMaintenanceDialog.form.longitude"></el-input>
        </el-form-item>
          <el-form-item label="纬度">
              <el-input v-model="EditMaintenanceDialog.form.latitude"></el-input>
          </el-form-item>
            <!-- <el-form-item label="海拔">
                <el-input v-model="EditMaintenanceDialog.form.altitude"></el-input>
            </el-form-item> -->
            <!-- <el-form-item label="设备ID">
              <el-input v-model="EditMaintenanceDialog.form.deviceId"></el-input>
            </el-form-item>
            <el-form-item label="编号">
              <el-input v-model="EditMaintenanceDialog.form.serial"></el-input>
            </el-form-item>
             
            <el-form-item label="所属区域">
              <el-input v-model="EditMaintenanceDialog.form.customtown"></el-input>
            </el-form-item>-->
            <el-form-item label="日期">
              <el-input v-model="EditMaintenanceDialog.form.submitDate"></el-input>
            </el-form-item>
            <el-form-item label="批次">
              <el-input v-model="EditMaintenanceDialog.form.batch"></el-input>
            </el-form-item>
            <el-form-item label="工作内容">
              <el-input v-model="EditMaintenanceDialog.form.workContent"></el-input>
            </el-form-item>
            <el-form-item label="药剂名称">
              <el-input v-model="EditMaintenanceDialog.form.medicineName"></el-input>
            </el-form-item>
            <el-form-item label="施药（kg）">
              <el-input v-model="EditMaintenanceDialog.form.medicineQua"></el-input>
            </el-form-item>
            <el-form-item label="防治面积（㎡）">
              <el-input v-model="EditMaintenanceDialog.form.areaFz"></el-input>
            </el-form-item>



      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="EditMaintenanceDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click.native.prevent="handleEditMaintenanceDataSubmit">确 定</el-button>
      </div>
    </el-dialog>


    <div class="block">
      <el-pagination
        background
        @current-change="handleDataCurrentPageChanged"
        :current-page.sync="DryWatchData.page"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="DryWatchData.total"
      ></el-pagination>
    </div>
  </div>


</template>

<script>
  import http from "../../../utils/http";

  export default {
    mounted() {
                this.uploadUrl =
              http.getBaseUrl() +
              "/medicineDataDetail/importExcel?token=" +
              sessionStorage["token"];
              
      this.loadDevice();
    },
    methods: {
      exportImage(){
        console.log("导出");
      let role2 = this.$store.state.user.role;
      this.role2 = role2;
              // this.loadDevice();
      console.log(role2);
      if (role2 == 1) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
      } else if (role2 == 2) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
      } else if (role2 == 3) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
        this.area = this.$store.state.user.adcode;
            }
            else if (role2 == 4) {
                          this.province = this.$store.state.user.adcode.substr(0, 2);
                          this.city = this.$store.state.user.adcode.substr(0, 4);
                          this.area = this.$store.state.user.adcode;
                          this.manager=this.$store.state.user.username;
                        }

                // let role = this.$store.state.user.role;
          console.log(role2);
            console.log(this.area);
            console.log(this.city);
              console.log(this.province);


        /**
         *        colName: this.value,
                  searchText: this.input,
                  adcode: this.area
         */
        console.log(http.getBaseUrl());
        console.log(this.value);
        if(!this.value){
          this.value = "";
        }
        if(!this.input){
          this.input = "";
        }
        if(!this.startDate){
          this.startDate = "";
        }
        if(!this.endDate){
          this.endDate = "";
        }
        if(!this.area){
          this.area = "";
        }

        console.log("====搜索条件===");
        console.log(this.selected);

         console.log(this.searchText);

        setTimeout(()=>{
                  window.location =
        http.getBaseUrl() +
        "/medicineDataDetail/exportImage?startDate=" +
        this.startDate +
        "&endDate=" +
        this.endDate +  
        "&searchText=" +
        this.searchText +
        "&colName=" +
        this.selected +
        "&adcode=" +
        this.area +
        "&username="+
        sessionStorage['username'] +
        "&token=" +
        sessionStorage["token"];
        },1000)


      },
      handleEditMaintenanceDataSubmit(){
        console.log(this.EditMaintenanceDialog.form);
              http.requestWithTokenJson(
        "/medicineDataDetail/updateData",
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
          console.log(row.id);
          console.log(row.deviceId);
          http.requestWithToken(
            "/medicineDataDetail/deleteRecord",
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
      this.EditMaintenanceDialog.visible = true;
      this.EditMaintenanceDialog.form = {
        longitude: "",
        latitude: "",
        batch:0,
        deviceId:"",
        serial:"",
        customTown:"",
        submitDate:"",
        workContent:"",
        id:"",
        woodstatus:"",
        medicineQua:"",
        areaFz:"",
        medicineName:""
      };
      this.EditMaintenanceDialog.form.id = data.id;
      this.EditMaintenanceDialog.form.longitude = data.longitude;
      this.EditMaintenanceDialog.form.deviceId = data.deviceId;
      this.EditMaintenanceDialog.form.altitude = data.altitude;
      this.EditMaintenanceDialog.form.latitude = data.latitude;
      this.EditMaintenanceDialog.form.serial = data.serial;
      this.EditMaintenanceDialog.form.customTown = data.customTown;
      this.EditMaintenanceDialog.form.submitDate = data.submitDate;
      this.EditMaintenanceDialog.form.batch = data.batch;
       this.EditMaintenanceDialog.form.workContent = data.workContent;
       this.EditMaintenanceDialog.form.areaFz = data.areaFz;
       this.EditMaintenanceDialog.form.medicineQua= data.medicineQua;
      this.EditMaintenanceDialog.form.medicineName = data.medicineName;
    },

      exportExcel(){
        console.log("导出");
      let role2 = this.$store.state.user.role;
      this.role2 = role2;
              // this.loadDevice();
      console.log(role2);
      if (role2 == 1) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
      } else if (role2 == 2) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
      } else if (role2 == 3) {
        this.province = this.$store.state.user.adcode.substr(0, 2);
        this.city = this.$store.state.user.adcode.substr(0, 4);
        this.area = this.$store.state.user.adcode;
            }
            else if (role2 == 4) {
                          this.province = this.$store.state.user.adcode.substr(0, 2);
                          this.city = this.$store.state.user.adcode.substr(0, 4);
                          this.area = this.$store.state.user.adcode;
                          this.manager=this.$store.state.user.username;
                        }

                // let role = this.$store.state.user.role;
          console.log(role2);
            console.log(this.area);
            console.log(this.city);
              console.log(this.province);


        /**
         *        colName: this.value,
                  searchText: this.input,
                  adcode: this.area
         */
        console.log(http.getBaseUrl());
        console.log(this.value);
        if(!this.value){
          this.value = "";
        }
        if(!this.input){
          this.input = "";
        }
        if(!this.startDate){
          this.startDate = "";
        }
        if(!this.endDate){
          this.endDate = "";
        }
        if(!this.area){
          this.area = "";
        }

        console.log("====搜索条件===");
        console.log(this.selected);

         console.log(this.searchText);

        setTimeout(()=>{
                  window.location =
        http.getBaseUrl() +
        "/medicineDataDetail/exportExcel?startDate=" +
        this.startDate +
        "&endDate=" +
        this.endDate +  
        "&searchText=" +
        this.searchText +
        "&colName=" +
        this.selected +
        "&adcode=" +
        this.area +
        "&username="+
        sessionStorage['username'] +
        "&token=" +
        sessionStorage["token"];
        },1000)


      },
      loadMaintenanceData(){
        alert("请手动刷新");
      },
          showPhotoDialog(id) {
            console.log(id);
      this.PhotoDialog.visible = true;
     // let BASE_URL = "http://47.103.66.70:8081";
    let BASE_URL = "http://106.15.200.245:50000";
      this.PhotoDialog.pic = BASE_URL + "/device_img?imgName=" + id;
    },
    
      handleDataCurrentPageChanged(val) {
        this.DryWatchData.page = val;
        this.loadDevice();
      },
      handleSubmit() {
        console.log(this.selected);
        console.log(this.searchText);
        console.log(sessionStorage["username"]);
        console.log(this.DryWatchData.startDate);
        console.log(this.DryWatchData.endDate);
        http.requestWithToken(
          "/medicineDataDetail/getDetail",
          "post",
          {
            optionIndex: this.selected,
            searchText: this.searchText,
            startDate: this.DryWatchData.startDate,
            endDate: this.DryWatchData.endDate,
            page:this.DryWatchData.page,
            limit:this.DryWatchData.limit
          },
          res => {
            console.log(res.data.Data);
            console.log(res.data.current);
            console.log(res.data.total);
            
            this.DryWatchData.list = res.data.data.data;
            this.DryWatchData.total = res.data.data.totalNum;
            this.DryWatchData.page = res.data.data.currentPage;
            // this.DryWatchData.optionIndex = -1;
          },
          () => {
          }
        )


        // this.loadDevice()
      },
      loadDevice() {
        http.requestWithToken(
          "/medicineDataDetail/getDetail",
          "post",
          {
            page: this.DryWatchData.page,
            limit: this.DryWatchData.limit,
            optionIndex: this.selected,
            searchText: this.searchText,
            startDate: this.DryWatchData.startDate,
            endDate: this.DryWatchData.endDate
          },
          res => {
            console.log(res);
            
            this.DryWatchData.list = res.data.data.data;
            this.DryWatchData.total = res.data.data.totalNum;
            this.DryWatchData.page = res.data.data.currentPage;
            // this.DryWatchData.optionIndex = -1;
          },
          () => {
          }
        )
      }
    },
    data() {
      return {
        uploadUrl:"",
        area:"",
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
          drug: "",
          areaFz:"",
          medicineQua:""
        }
      },
        searchText: '',
      PhotoDialog: {
        visible: false,
        pic: ""
      },
        options: [{
          value: 1,
          label: '编号'
        }, {
          value: 2,
          label: '区域'
        }, {
          value: 3,
          label: '批次'
        }, {
          value: 4,
          label: '施工人员'
        }],
                value: '',
        input:'',

        selected: '',
        DryWatchData: {
          // optionIndex: -1,
          list: [],
          page: 1,
          limit: 10,
          startDate: '',
          endDate: '',
          total: 0,
        }
      }
    },
    // name: '注干剂检测'
  }
</script>

<style lang="scss">
#tool-row {
  /* display: flex; */
  justify-content: space-between;
  margin-bottom: 5px;
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
    color: #fff;
    background-color: #1D7155;
    border-color: #1D7155;
}
#upload{
    color: #fff;
    background-color: #1D7155;
    border-color: #1D7155;
}
#download{
    color: #fff;
    background-color: #1D7155;
    border-color: #1D7155;
}
#edit{
    color: #fff;
    background-color: #1D7155;
    border-color: #1D7155;
}


// .el-button--primary {
//     background: #1D7155;
//     border-color: #1D7155;
//     color: #fff;
// }
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
</style>