<template>
<div>
  <div id="line">
      <el-date-picker v-model="startDate" type="date" value-format="yyyy-MM-dd" placeholder="起始日期" 
      style="width:150px;margin-right:1px;"
      ></el-date-picker>
      <el-date-picker v-model="endDate" type="date" value-format="yyyy-MM-dd" placeholder="终止日期"
      style="width:150px;margin-right:1px;"></el-date-picker>
      <el-select @change="selectChange" v-model="value" placeholder="请选择"
      style="width:150px;margin-right:1px;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="input" placeholder="请输入内容" style="width: 170px;margin-right:1px;"></el-input>
      <el-button type="primary" @click="query()" >查询</el-button>
      <el-button type="primary" @click="exportExcel" >导出</el-button>
  </div>
  

        <el-table class="tableGreen" border :data="QRData.list" style="width: 100%" height="600" stripe :header-cell-style="{background:'#70AD47',color:'#FFFFFF'}">
        <el-table-column prop="recordByCol" :label="MycolName" align="center"></el-table-column>
        <el-table-column prop="startDate" label="开始日期" align="center"></el-table-column>
        <el-table-column prop="endDate" label="结束日期" align="center"></el-table-column>
        <el-table-column prop="deviceNum" label="诱捕器数量" align="center"></el-table-column>
        <el-table-column prop="beetleNum" label="松墨天牛数量" align="center"></el-table-column>
        <el-table-column prop="otherNum" label="其它天牛数量" align="center"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center"></el-table-column>

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

</div>


</template>

<script>
import http from "../../utils/http";
export default {
    mounted(){
      this.value = "CustomSerial";
      this.MycolName = "编号";
      
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
      selectChange(){
        console.log(this.value);
        if(this.value == "CustomSerial"){
          this.MycolName = "编号";
        }else if(this.value == "CustomTown"){
          this.MycolName = "区域"
        }else if(this.value == "batch"){
          this.MycolName = "批次"
        }else if(this.value == "username"){
          this.MycolName = "施工人员"
        }
        
      },
        exportExcel(){
        console.log(this.QRData.list);
        let role = this.$store.state.user.role;
          console.log(role);
            console.log(this.area);
            console.log(this.city);
              console.log(this.province);
                      setTimeout(()=>{
                  window.location =
        http.getBaseUrl() +
        "/newTrap/export?startDate=" +
        this.startDate +
        "&endDate=" +
        this.endDate +
        "&searchText=" +
        this.input +
        "&colName=" +
        this.value +
        "&manager="+
        sessionStorage['username'] +
        "&token=" +
        sessionStorage["token"];
        },1000)

        },

      handleQRDataCurrentPageChanged(val) {
        this.QRData.page = val;
        console.log(this.QRData.page);

        console.log("valChange" + val);
        this.loadDevice();
      },
      query(){
        if(!this.input){
          alert("请输入查询内容！");
        }else{
        console.log("query");
        console.log(this.startDate);
        console.log(this.endDate);
        console.log(this.input);
        console.log(this.value);
        let role = this.$store.state.user.role;
        console.log(this.manager);

            http.requestWithToken(
                "/newTrap/managerSummary",
                "post",
                {
                  manager: sessionStorage['username'],
                  startDate: this.startDate,
                  endDate: this.endDate,
                  colName: this.value,
                  searchText: this.input,
                page: this.QRData.page,
                limit: 10
                },
                res => {
                    console.log("成");
                  console.log(res.data.data);
                this.QRData.list = res.data.data.data;
                this.QRData.total = res.data.data.totalPage;
                console.log( this.QRData.list);

                },
                () => {}
            );
        }
      },
      handleQRDataCurrentPageChanged() {
        console.log("hello");
        this.loadDevice();
      },

        loadDevice() {

        },
    },
    data(){
        return{
            MycolName:'',
            currentPage:'',
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
          value: 'CustomSerial',
          label: '编号'
        }, {
          value: 'CustomTown',
          label: '区域'
        }, {
          value: 'batch',
          label: '批次'
        }, {
          value: 'username',
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
  .tableGreen{
    .el-table__row{
      background-color: #D5E4CF !important;
    }
    .el-table__row--striped{
      background-color: #ECF0EA !important;
    }
  }
#line {
  /* display: flex; */
  justify-content: space-between;
  margin-bottom: 5px;
}

// /* 下拉框的框线 */
// .el-select .el-input.is-focus .el-input__inner {
//     border-color: #70AD47;
// }
// /* 输入框的框线 */
// .el-input.is-active .el-input__inner, .el-input__inner:focus {
//     border-color: #70AD47;
//     outline: 0;
// }
</style>