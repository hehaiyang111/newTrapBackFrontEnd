<template>
<div>
    <div id="tool-row">
        <div>
            <el-date-picker v-model="startDate" type="date" value-format="yyyy-MM-dd" placeholder="起始日期" style="width: 170px;"></el-date-picker>
            <el-date-picker v-model="endDate" type="date" value-format="yyyy-MM-dd" placeholder="终止日期" style="width: 170px;"></el-date-picker>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input v-model="input" placeholder="请输入内容" style="width: 200px"></el-input>
            <el-button id="search" type="primary" @click="query()">查询</el-button>
        </div>
        <div style=" display: flex;">
              <el-button id="download" type="primary" @click="exportExcel">导出</el-button>
              <el-button  type="primary" @click="exportImage" style="height: fit-content;">导出图像</el-button>
              <!--<el-button type="primary" @click="someExportExcel">批量导出</el-button>-->
              <!--<el-button type="primary" @click="importExcel(scope.$index)">导入</el-button>-->
              <el-upload ref="upload"
              :action="uploadUrl"
              :on-success="loadMaintenanceData">
                <el-button id="upload" type="primary" style="margin-left:20px">导入</el-button>
              </el-upload>
        </div>
    </div>


            <el-table class="tableGreen" 
                      border 
                      :data="QRData.list" 
                      style="width: 100%" 
                      height="600"        
                      stripe 
                      :header-cell-style="{background:'#70AD47',color:'#FFFFFF'}">
              <el-table-column prop="checked" label="地图查看" align="center">
                <template slot-scope="scope">
                  <el-button
              @click="showMap(scope.row.linename)"
              size="mini"
            >显示</el-button>
                </template>
                <!-- <template>
                <el-radio v-model="radio" label="1">备选项</el-radio>
                </template> -->
              </el-table-column>
            <el-table-column prop="linename" label="线路名称" align="center"></el-table-column>
            <el-table-column prop="timeconsume" label="耗时(秒)" align="center"></el-table-column>
            <el-table-column prop="starttime" label="开始时间" align="center"></el-table-column>
            <el-table-column prop="endtime" label="结束时间" align="center"></el-table-column>
            <el-table-column prop="startpoint" label="起点(经纬度)" align="center"></el-table-column>
            <el-table-column prop="endpoint" label="终点(经纬度)" align="center"></el-table-column>
            <el-table-column prop="pic1" label="照片1" align="center">
                                <template slot-scope="scope">
            <el-button
              @click="showPhotoDialog(scope.row.pic1)"
              v-if="scope.row.pic1 != null && scope.row.pic1 !=''"
              size="mini"
            >显示</el-button>
          </template>

            </el-table-column>
            <el-table-column prop="pic2" label="照片2" align="center">
            <template slot-scope="scope">
            <el-button
              @click="showPhotoDialog(scope.row.pic2)"
              v-if="scope.row.pic2 != null && scope.row.pic2 !=''"
              size="mini"
            >显示</el-button>
          </template>
          
            </el-table-column>
            <el-table-column prop="pic3" label="照片3" align="center">
              <template slot-scope="scope">
            <el-button
              @click="showPhotoDialog(scope.row.pic3)"
              v-if="scope.row.pic3 != null && scope.row.pic3 !=''"
              size="mini"
            >显示</el-button>
          </template>
            </el-table-column>
            <el-table-column prop="pic4" label="照片4" align="center">
                <template slot-scope="scope">
            <el-button
              @click="showPhotoDialog(scope.row.pic4)"
              v-if="scope.row.pic4 != null && scope.row.pic4 !=''"
              size="mini"
            >显示</el-button>
          </template>

            </el-table-column>
            <el-table-column prop="pic5" label="照片5" align="center">
                              <template slot-scope="scope">
            <el-button
              @click="showPhotoDialog(scope.row.pic5)"
              v-if="scope.row.pic5 != null && scope.row.pic5 !=''"
              size="mini"
            >显示</el-button>
          </template>

            </el-table-column>
            <el-table-column prop="worker" label="施工人员" align="center"></el-table-column>
            <el-table-column prop="workingContent" label="工作内容" align="center"></el-table-column>
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
                id="edit"
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
            <div class="block">
            <el-pagination
                background
                @current-change="handleQRDataCurrentPageChanged"
                :current-page.sync="QRData.page"
                :page-size="10"
                layout="total, prev, pager, next"
                :total="QRData.total"
            ></el-pagination>
            </div>
                                    <el-dialog title="现场照片" :visible.sync="PhotoDialog.visible" width="700px">
      <div style="overflow-y:scroll;height: 300px">
        <img v-bind:src="PhotoDialog.pic" style="width: 600px; ">
      </div>
    </el-dialog>

                <el-dialog title="编辑维护信息" :visible.sync="EditMaintenanceDialog.visible" width="30%">
      <el-form label-width="120px">
        <el-form-item label="线路名称">
          <el-input v-model="EditMaintenanceDialog.form.linename"></el-input>
        </el-form-item>

        <el-form-item label="开始点">
          <el-input v-model="EditMaintenanceDialog.form.startpoint"></el-input>
        </el-form-item>
        <el-form-item label="结束点">
          <el-input v-model="EditMaintenanceDialog.form.endpoint"></el-input>
        </el-form-item>
        <!-- <el-form-item label="工人">
          <el-input v-model="EditMaintenanceDialog.form.worker"></el-input>
        </el-form-item> -->
        <el-form-item label="工作内容">
          <el-input v-model="EditMaintenanceDialog.form.workingContent"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="EditMaintenanceDialog.form.remarks"></el-input>
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
              "/track/importExcel?token=" +
              sessionStorage["token"];

     console.log("init");
      let role = this.$store.state.user.role;
      this.role = role;
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
      exportImage(){

                let role = this.$store.state.user.role;
          console.log(role);
            console.log(this.area);
            console.log(this.city);
              console.log(this.province);
        console.log(http.getBaseUrl());

        setTimeout(()=>{
                  window.location =
        http.getBaseUrl() +
        "/track/exportImage?startDate=" +
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
      showMap(lineName){
        this.$router.push({
          path:'/pages/track/map',
          query:{
            lineName:lineName
          }
        })
      },
      handleEditMaintenanceDataSubmit(){
        console.log(this.EditMaintenanceDialog.form);
                       http.requestWithTokenJson(
        "/track/updateRec",
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
            "/app/deleteTrackById",
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

        linename:"",
        startpoint:"",
        id:"",
        endpoint:"",
        worker:"",
        workingContent:"",
        remarks:"",
      };
      
      this.EditMaintenanceDialog.form.id = data.id;
      this.EditMaintenanceDialog.form.linename = data.linename;
      this.EditMaintenanceDialog.form.startpoint = data.startpoint;
      this.EditMaintenanceDialog.form.endpoint = data.endpoint;
      this.EditMaintenanceDialog.form.worker = data.worker;
      this.EditMaintenanceDialog.form.workingContent = data.workingContent;
      this.EditMaintenanceDialog.form.remarks = data.remarks;

      


    },

      loadMaintenanceData(){
        alert("请手动刷新");
      },
      exportExcel(){

                let role = this.$store.state.user.role;
          console.log(role);
            console.log(this.area);
            console.log(this.city);
              console.log(this.province);
        console.log(http.getBaseUrl());

        setTimeout(()=>{
                  window.location =
        http.getBaseUrl() +
        "/track/exportExcel?startDate=" +
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
    // let BASE_URL = "http://106.15.90.78:50000";
    let BASE_URL = "http://106.15.200.245:50000";
      this.PhotoDialog.pic = BASE_URL + "/device_img2?imgName=" + id;
    },

            handleQRDataCurrentPageChanged(val) {
        this.QRData.page = val;
        console.log("valChange" + val);
        this.loadDevice();
      },
      handleQRDataCurrentPageChanged() {
        console.log("hello");
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
                "/track/searchDetail",
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
                this.QRData.list = res.data.data.data;
                this.QRData.total = res.data.total;

                },
                () => {}
            );

          // }
      },
        loadDevice() {
          console.log(this.role);
          console.log(sessionStorage['username']);
          if(this.role == 3){
            http.requestWithToken(
                "/track/areaDetail",
                "post",
                { page: this.QRData.page, limit: 10, username: sessionStorage['username'],
                                  startDate: this.startDate,
                  endDate: this.endDate,
                  colName: this.value,
                  searchText: this.input,
                  adcode: this.area
                  },
                res => {
                this.QRData.list = res.data.Data;
                this.QRData.total = res.data.total;

                },
                () => {}
            );
          }else if(this.role == 4){
              http.requestWithToken(
                "/track/searchDetail",
                "post",
                { page: this.QRData.page, limit: 10, username: sessionStorage['username'],
                                  startDate: this.startDate,
                  endDate: this.endDate,
                  colName: this.value,
                  searchText: this.input,
                  adcode: this.area
                  },
                res => {
                this.QRData.list = res.data.data.data;
                this.QRData.total = res.data.data.totalNum;

                },
                () => {}
            );
          }else if(this.role == 2){
            
            http.requestWithToken(
                "/track/searchDetail",
                "post",
                { page: this.QRData.page, limit: 10, username: sessionStorage['username'],
                                  startDate: this.startDate,
                  endDate: this.endDate,
                  colName: this.value,
                  searchText: this.input,
                  adcode: this.city
                  },
                res => {
                this.QRData.list = res.data.Data;
                this.QRData.total = res.data.total;

                },
                () => {}
            );

            //     http.requestWithToken(
            //     "/track/selectAll",
            //     "post",
            //     { page: this.QRData.page, limit: 10, username: sessionStorage['username'],adcode: this.city},
            //     res => {
            //     this.QRData.list = res.data.Data;
            //     this.QRData.total = res.data.total;

            //     },
            //     () => {}
            // );

          }else if(this.role==1){
            http.requestWithToken(
                "/track/searchDetail",
                "post",
                { page: this.QRData.page, limit: 10, username: sessionStorage['username'],
                                  startDate: this.startDate,
                  endDate: this.endDate,
                  colName: this.value,
                  searchText: this.input,
                  adcode: this.province
                  },
                res => {
                this.QRData.list = res.data.Data;
                this.QRData.total = res.data.total;

                },
                () => {}
            );            
          }
        },
    },
    data(){
        return{
          radio:true,
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
          value: 'LineName',
          label: '线路名称'
        }, 
         {
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
    name:'TrackDataDetail'
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
#tool-row {
  /* display: flex; */
  justify-content: space-between;
  margin-bottom: 5px;
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
    height: fit-content;
}
#edit{
    background: #1D7155;
    border-color: #1D7155;
    color: #fff;
}
</style>