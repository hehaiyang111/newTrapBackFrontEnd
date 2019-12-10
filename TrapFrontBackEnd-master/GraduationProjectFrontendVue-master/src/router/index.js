 /* jshint esversion: 6 */
import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Login from '@/components/Login';
import home from '@/components/Home';
import UserMgr from '@/components/pages/UserMgr';
import MonthSummary from '@/components/pages/MonthSummary';
import DeviceMap from '@/components/pages/DeviceMap';
import QRCodeMgr from '@/components/pages/QRCodeMgr';
import MaintenanceData from '@/components/pages/MaintenanceData';
import MaintenanceDataAbnormal from '@/components/pages/MaintenanceDataAbnormal';
import Statistics from "@/components/pages/Statistics";
import OtherBeetle from "@/components/pages/OtherBeetle";
import WeatherInfo from '@/components/pages/WeatherInfo';
import DeviceSummary from '@/components/pages/DeviceSummary';
import MapStatistics from '@/components/pages/MapStatistics';
import DeviceMessage from '@/components/pages/DeviceMessage';
import DeviceWanted from '@/components/pages/DeviceWanted';
import Test from '@/components/pages/Test';
import DryWatchDataDetail from '@/components/pages/drywatch/DataDetail';
import NaturalEnemiesDataDetail from '@/components/pages/naturalEnemies/DataDetail';
import DeadTreeDataDetail from '@/components/pages/deadTrees/DataDetail';
import TrackDataDetail from '@/components/pages/track/DataDetail';
import DryWatchDataSummary from '@/components/pages/drywatch/DataSummary';
import TrackDataSummary from '@/components/pages/NewTrapDataSummary';
import DryWatchMaintanceData from '@/components/pages/drywatch/DryWatchMaintanceData';
import DryWatchDeviceMessage from '@/components/pages/drywatch/DryWatchDeviceMessage';
import DryWatchDeviceWanted from '@/components/pages/drywatch/DryWatchDeviceWanted';
import NaturalEnemiesDataSummary from '@/components/pages/naturalEnemies/DataSummary';
import DeadTreesDataSummary from '@/components/pages/deadTrees/DataSummary';
import NaturalMaintanceData from '@/components/pages/naturalEnemies/NaturalMaintanceData';
import NaturalDeviceMessage from '@/components/pages/naturalEnemies/NaturalDeviceMessage';
import NaturalDeviceWanted from '@/components/pages/naturalEnemies/NaturalDeviceWanted';
import DryWatchDeviceMap from '@/components/pages/drywatch/DryWatchDeviceMap';
import NaturalDeviceMap from '@/components/pages/naturalEnemies/NaturalDeviceMap';
import DeadTreeDeviceMap from '@/components/pages/deadTrees/DeadTreeDeviceMap';
import TrackDeviceMap from '@/components/pages/track/TrackDeviceMap';
import AdminQRManager from '@/components/pages/admin/AdminQRManager';
import SummaryByReigon from '@/components/pages/drywatch/SummaryByReigon';
import TrapWorkContent from '@/components/pages/admin/TrapWorkContent';
import TrapInjectType from '@/components/pages/admin/TrapInjectType';
import InjectWoodStatus from '@/components/pages/admin/InjectWoodStatus';
import InjectWorkContent from '@/components/pages/admin/InjectWorkContent';
import EnemyType from '@/components/pages/admin/EnemyType';
import DeadTreesKill from '@/components/pages/admin/DeadTreesKill';
import AreaStatic from '@/components/pages/admin/AreaStatic';
import TimeStatic from '@/components/pages/admin/TimeStatic';
import BatchStatic from '@/components/pages/admin/BatchStatic';
import WorkerStatic from '@/components/pages/admin/WorkerStatic';
import NewMapStatic from '@/components/pages/admin/NewMapStatic';
import MedicineDataDetail from '@/components/pages/medicine/MedicineDetail';
import SummaryBy from '@/components/pages/medicine/SummaryBy';
import MedicineWatchMap from '@/components/pages/medicine/MedicineWatchMap';
import MedicineWorkContent from '@/components/pages/admin/MedicineWorkContent';
import MedicineName from '@/components/pages/admin/MedicineName';
import DeadTreeMaintanceData from '@/components/pages/deadTrees/DeadTreeMaintanceData';
import DeadTreeDeviceMessage from '@/components/pages/deadTrees/DeadTreeDeviceMessage';
import DeadTreeDeviceWanted from '@/components/pages/deadTrees/DeadTreeDeviceWanted';
import DataReport from '@/components/pages/admin/DataReport';
import DataSummary from '@/components/pages/medicine/DataSummary';
import MedicineDeviceWanted from '@/components/pages/medicine/MedicineDeviceWanted';
import MedicineMaintanceData from '@/components/pages/medicine/MedicineMaintanceData';
import MedicineDeviceMessage from '@/components/pages/medicine/MedicineDeviceMessage';
import InjectName from '@/components/pages/admin/InjectName';
import DataSummaryByRegion from '@/components/pages/naturalEnemies/DataSummaryByRegion';
import DeadTreesSummaryByregion from '@/components/pages/deadTrees/DeadTreesSummaryByregion';
import MyOpenLayers from '@/components/pages/MyOpen/MyOpenLayers';
Vue.use(Router);
Vue.config.devtools = true;

export default new Router({
  routes: [{
      path: '/login',
      name: 'Login',
      component: Login,

    },

    {
      path: '/',
      name: '欢迎来到...',
      component: home,
      //1、

      children: [{
          path: '/helloworld',
          name: 'HelloWorld',
          component: HelloWorld
        },
        {
          path: 'pages/user_mgr.html',
          name: '用户管理',
          component: UserMgr
        },

        {
          path: 'pages/device_wanted2.html',
          name: '数据明细',
          component: DeviceWanted

        },
        {
          path: 'pages/map_statistics.html',
          name: '地图数据分析',
          component: MapStatistics

        },
        {
          path: 'pages/trap/NewTrapDataSummary',
          name: '数据汇总',
          component: TrackDataSummary,
          meta: {
            keepAlive: true
          } // 需要被缓存
        },


        {
          path: 'pages/device_summary',
          name: '诱捕器情况',
          component: DeviceSummary,
          meta: {
            keepAlive: true
          } // 需要被缓存
        },
        {
          path: '/pages/device_wanted1.html',
          name: '数据修改上报',
          component: DeviceWanted,
          meta: {
            keepAlive: true
          } // 需要被缓存
        },
        {
          path: 'pages/device_message',
          name: '诱捕器信息',
          component: DeviceMessage,

        },

        {
          path: 'pages/device_maintenance.html',
          name: '设备维护信息',
          component: MaintenanceData,

        },
        {
          path: 'pages/device_map.html',
          name: '地图',
          component: DeviceMap
        },
        {
          path: 'pages/qrcode_mgr.html',
          name: '二维码管理',
          component: QRCodeMgr
        },

        {
          path: 'pages/device_maintenance_abnormal.html',
          name: '设备异常维护信息',
          component: MaintenanceDataAbnormal
        },
        {
          path: 'pages/statistics.html',
          name: '数据分析',
          component: Statistics
        },
        {
          path: 'pages/other_beetle',
          name: '其它天牛种类配置',
          component: OtherBeetle
        },
        {
          path: 'pages/other_beetleroot',
          name: '其他天牛配置',
          component: OtherBeetle
        },
        {
          path: 'pages/weather_info',
          name: '气象信息',
          component: WeatherInfo
        },

        {
          path: 'pages/month_summary',
          name: '时间动态',
          component: MonthSummary
        },
        {
          path: 'pages/Test',
          name: 'Test',
          component: Test
        },
        {
          path: 'pages/drywatch/detail',
          name: '数据明细',
          component: DryWatchDataDetail
        },
        {
          path: 'pages/naturalEnemy/detail',
          name: '数据明细',
          component: NaturalEnemiesDataDetail
        },
        {
          path: 'pages/medicine/detail',
          name: '数据明细',
          component: MedicineDataDetail
        },
        {
          path: 'pages/deadTrees/detail',
          name: '数据明细',
          component: DeadTreeDataDetail
        },
        {
          path: 'pages/track/detail',
          name: '数据明细',
          component: TrackDataDetail
        },

        {
          path: 'pages/drywatch/datasummary',
          name: '数据汇总',
          component: DryWatchDataSummary
        },

        {
          path: 'pages/medicine/datasummaryby',
          name: '数据汇总',
          component: SummaryBy
        },

        {
          path: 'pages/naturalEnemies/datasummarybyregion',
          name: '数据汇总',
          component: DataSummaryByRegion
        },
        
        {
          path: 'pages/drywatch/Maintance',
          name: '注干剂管理',
          component: DryWatchMaintanceData
        },
        {
          path: 'pages/medicine/Maintance',
          name: '药剂防治管理',
          component: MedicineMaintanceData
        },
        {
          path: 'pages/drywatch/message',
          name: '注干剂管理信息',
          component: DryWatchDeviceMessage
        },
        {
          path: 'pages/drywatch/wanted',
          name: '数据修改上报',
          component: DryWatchDeviceWanted
        },
        {
          path: 'pages/medicine/wanted',
          name: '数据修改上报',
          component: MedicineDeviceWanted
        },
        {
          path: 'pages/natural/datasummary',
          name: '数据汇总',
          component: NaturalEnemiesDataSummary
        },

        {
          path: 'pages/medicine/datasummary',
          name: '数据汇总',
          component: DataSummary
        },
        {
          path:'pages/deadtrees/datasummarybyregion',
          name:'数据汇总',
          component:DeadTreesSummaryByregion

        },
        {
          path: 'pages/natural/maintance',
          name: '天地防治管理',
          component: NaturalMaintanceData
        },
        {
          path: 'pages/medicine/message',
          name: '药剂防治管理信息',
          component: MedicineDeviceMessage
        },
        {
          path: 'pages/natural/message',
          name: '天地防治管理信息',
          component: NaturalDeviceMessage
        },
        {
          path: 'pages/natural/wanted',
          name: '数据修改上报',
          component: NaturalDeviceWanted
        },
        {
          path: 'pages/drywatch/map',
          name: '地图查看',
          component: DryWatchDeviceMap
        },
        {
          path: 'pages/natural/map',
          name: '地图查看',
          component: NaturalDeviceMap
        },
        {
          path: 'pages/medicine/map',
          name: '地图查看',
          component: MedicineWatchMap
        },
        {
          path: 'pages/deadtree/map',
          name: '地图查看',
          component: DeadTreeDeviceMap
        },
        {
          path: 'pages/track/map',
          name: '地图查看',
          component: TrackDeviceMap
        },
        {
          path: 'pages/admin/qrmanager',
          name: 'ID分配管理',
          component: AdminQRManager
        },
        {
          path: 'pages/drywatch/summaryByRegion',
          name: '数据汇总',
          component: SummaryByReigon
        },
        {
          path: 'pages/trap/workcontent',
          name: '工作内容配置',
          component: TrapWorkContent
        },
        {
          path: 'pages/medicine/workcontent',
          name: '工作内容配置',
          component: MedicineWorkContent
        },
        {
          path: 'pages/trap/injectType',
          name: '诱芯类型配置',
          component: TrapInjectType
        },
        {
          path: 'pages/inject/woodStatus',
          name: '树木状态配置',
          component: InjectWoodStatus
        },
        {
          path: 'pages/medicine/name',
          name: '药剂名称配置',
          component: MedicineName
        },
        {
          path: 'pages/inject/name',
          name: '注剂名称配置',
          component: InjectName
        },
        {
          path: 'pages/inject/workContent',
          name: '工作内容配置',
          component: InjectWorkContent
        },
        {
          path: 'pages/inject/EnemyType',
          name: '天敌类型配置',
          component: EnemyType
        },
        {
          path: 'pages/inject/DeadTreesKill',
          name: '除害方式配置',
          component: DeadTreesKill
        },
        {
          path: 'pages/trap/AreaStatic',
          name: '区域分析',
          component: AreaStatic
        },
        {
          path: 'pages/trap/TimeStatic',
          name: '月份统计',
          component: TimeStatic
        },
        {
          path: 'pages/trap/BatchStatic',
          name: '批次统计',
          component: BatchStatic
        },
        {
          path: 'pages/trap/WorkerStatic',
          name: '人效分析',
          component: WorkerStatic
        },
        {
          path: 'pages/trap/NewMapStatic',
          name: '统计分析',
          component: NewMapStatic
        },
        {
          path: 'pages/deadTrees/DeadTreesDataSummary',
          name: '数据汇总',
          component: DeadTreesDataSummary
        },
        {
          path: 'pages/deadTrees/Maintance',
          name: '数据维护',
          component: DeadTreeMaintanceData
        },
        {
          path: 'pages/deadTrees/DeadTreeDeviceMessage',
          name: '数据查看',
          component: DeadTreeDeviceMessage
        },
        {
          path: 'pages/medicine/DeadTreeDeviceMessage',
          name: '数据查看',
          component: DeadTreeDeviceMessage
        },
        {
          path: 'pages/deadTrees/DeadTreeDeviceWanted',
          name: '数据上报',
          component: DeadTreeDeviceWanted
        },
        {
          path: 'pages/admin/DataReport',
          name: '数据抄报',
          component: DataReport
        },
        {
          path: 'pages/admin/myopen',
          name: '数据抄报',
          component: MyOpenLayers
        }

      ]
    },

  ],
  linkActiveClass: "active-router",
  linkExactActiveClass: "exact-router"
});
