<template>
  <div>
    <div id="tool-row">
        <div>
          <span style="font-size: 14px">搜索条件:</span>
          <el-date-picker v-model="DryWatchData.startDate" type="date" value-format="yyyy-MM-dd"
                          placeholder="起始日期" style="width: 170px;"></el-date-picker>
          <el-date-picker v-model="DryWatchData.endDate" type="date" value-format="yyyy-MM-dd"
                          placeholder="终止日期" style="width: 170px;"></el-date-picker>
          
            <el-select v-if="this.$store.state.user.role==3" placeholder="编号/区域/批次/施工人员" v-model="selected" style="width: 220px;">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <!--<span style="font-size: 14px; margin-left: 14px">搜索内容:</span>
            <el-input style="width: 200px" placeholder="搜索内容" v-model="searchText"></el-input> -->
            <el-button  type="primary" @click="handleSubmit">搜索</el-button>
        </div>
    </div>

    <el-table border :data="DryWatchData.list" style="width: 100%" height="600" stripe :header-cell-style="{background:'#70AD47',color:'#FFFFFF'}">

      <el-table-column prop="customTown" label="区域" align="center"></el-table-column>
      <el-table-column prop="startDate" label="起始日期" align="center"></el-table-column>
      <el-table-column prop="endDate" label="截止日期" align="center"></el-table-column>
      <el-table-column prop="medicineQuaSum" label="施药数量（kg）" align="center"></el-table-column>
      <el-table-column prop="areaFzSum" label="防治面积（㎡）" align="center"></el-table-column>
      <el-table-column
        prop="manager"
        label="管理员"
        align="center"
        v-if="this.$store.state.user.role === 3"
      ></el-table-column>
    </el-table>
    <div class="block" id="tool-row">
      <div>
        <el-pagination
          background
          @current-change="handleDataCurrentPageChanged"
          :current-page.sync="DryWatchData.page"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="DryWatchData.total"
        ></el-pagination>
    </div>
    <div class="divcss5-right">
        各区域药剂总质量:{{totalMedicineQuaSum}} &nbsp;
        各区域防治总面积:{{totalAreaFzNum}} &nbsp;
    </div>
    </div>

  </div>


</template>

<script>
  import http from "../../../utils/http";

  export default {
    mounted() {
    },
    methods: {
      handleDataCurrentPageChanged(val) {
        this.DryWatchData.page = val;
        this.loadDevice();
      },
      handleSubmit() {
        console.log(this.DryWatchData);
        this.loadDevice()
      },
      loadDevice() {
        http.requestWithToken(
          "/medicineData/Summary/byCustomReigon",
          "post",
          {
            page: this.DryWatchData.page,
            limit: 10,
            optionIndex: this.selected,
            searchText: this.searchText,
            startDate: this.DryWatchData.startDate,
            endDate: this.DryWatchData.endDate
          },
          res => {
            this.DryWatchData.list = res.data.data.data;
            this.DryWatchData.total = res.data.data.totalNum;
            this.DryWatchData.page = res.data.data.currentPage;
            // this.DryWatchData.optionIndex = -1;
            this.totalMedicineQuaSum = res.data.data.data[0].totalMedicineQuaSum;
            this.totalAreaFzNum = res.data.data.data[0].totalAreaFzNum;
          },
          () => {
          }
        )
      }
    },
    data() {
      return {
        searchText: '',
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

<style>
#tool-row {
  /* display: flex; */
  justify-content: space-between;
  margin-bottom: 5px;
    display:flex;
}
#search{
    color: #fff;
    background-color: #1D7155;
    border-color: #1D7155;
}
.divcss5-right{float:right} 
</style>
