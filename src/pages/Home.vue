<template>
    <div class="mainBodyOfHome">
        <!--    数据展示-->
        <div class="dataDisplayOfHome">
            <!--          标题  -->
            <div class="headOfDataDisplay">
                <span
                    style="flex: 2;font-size: 12px;font-weight: bold;color: #4E5C72;justify-content: end;display: flex">
                    以下数据实时更新
                </span>
            </div>

        </div>
        <!--        实时心电图-->
        <div class="visualizationOfHome" id="visualizationOfHome">

        </div>
        <!--        心电分析+风险预测-->
        <div class="dataTableOfHome">

            <div class="left-column">
                <el-card :body-style="{ padding: '0px'}" class="box-card" >
                    <img :src="picUrl" class="image" style="width: 100%; height: auto;">
                    <div style="padding: 14px;">
                        <span>心电分析</span>
                        <div class="bottom clearfix">
                            <time class="time">{{ currentDate }}</time>
                        </div>
                    </div>
                </el-card>
            </div>
            <div class="right-column">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>风险预测</span>
                    </div>
                    <div class="text item">
                        {{ grade }}
                    </div>
                    <div v-for="o in 4" :key="o" class="text item">
                        {{'建议' + o}}
                    </div>
                </el-card>
            </div>
        </div>

    </div>
</template>

<script>
import * as echarts from 'echarts/core';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LineChart,
    CanvasRenderer,
    UniversalTransition
]);
export default {
    name: "Home",
    data() {
        return {
            signal: [],
            grade: 0,
            picUrl: "",
            currentDate: new Date()
        }
    },
    methods: {
        parseCSV(csv) {
            const rows = csv.split('\n');
            const data = rows.map(row => {
                const [index, value] = row.split(',');
                return parseFloat(value);
            });
            return data;
        },
        loadECG() {
            this.request.get("/static/sig/418.csv")
                .then(res => {
                    this.signal = this.parseCSV(res.data)
                    console.log(this.signal[1])
                    this.drawECG()
                })
        },
        drawECG() {
            var chartDom = document.getElementById('visualizationOfHome');
            const myChart = echarts.init(chartDom, null, { renderer: 'canvas' });
            var option;
            let count = 0;
            let index = 0; // 添加一个索引
            let value = 0
            const randomData = () => {
                value = this.signal[index]; // 使用索引来访问数组
                index++; // 增加索引
                count++;
                return {
                    name: count,
                    value: [
                        count,
                        value
                    ]
                };
            }
            let data = [];
            let submitData = []
            for (var i = 0; i < 721; i++) {
                data.push(randomData())
                submitData.push(value)
            }

            option = {
                title: {
                    text: '实时心电图'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false
                    }
                },
                xAxis: {
                    type: 'value',
                    splitLine: {
                        show: true, // Set show to true to display the grid lines
                        lineStyle: {
                            type: 'solid', // Set the line style to solid
                            color: 'red' // Set the line color to red
                        }
                    },
                    show: false,
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, 'mV'],
                    splitLine: {
                        show: true, // Set show to true to display the grid lines
                        lineStyle: {
                            type: 'solid', // Set the line style to solid
                            color: 'red' // Set the line color to red
                        }
                    },
                    min: -1.5,
                    max: 1.5
                },
                series: [
                    {
                        name: 'ECG Signal',
                        type: 'line',
                        showSymbol: false,
                        lineStyle: {
                            color: 'black'
                        },
                        data: data
                    }
                ]
            }
            setInterval(function () {
                for (var i = 0; i < 9; i++) {
                    data.shift();
                    data.push(randomData());
                    submitData.shift()
                    submitData.push(value)
                }
                let minValue = Math.min(...data.map(item => item.value[0]));
                let maxValue = Math.max(...data.map(item => item.value[0]));

                myChart.setOption({
                    xAxis: {
                        type: 'value',
                        min: minValue,
                        max: maxValue,
                    },
                    series: [
                        {
                            data: data
                        }
                    ]
                });
            }, 25);

            const predict = () => {
                console.log(submitData);
                this.request.post('/predict', { 'signal': submitData })
                    .then(res => {
                        this.picUrl = res.data.url
                        this.grade = res.data.label
                    })
                this.currentDate = new Date()
            }

            setInterval(function () {
                predict()
            }, 10000);

            option && myChart.setOption(option);
        },

    },
    created() {
        this.loadECG()
    }
}
</script>

<style scoped>
.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}

.box-card {
    height: 287px;
    margin: 10px;
}

.mainBodyOfHome {
    display: flex;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(circle farthest-side at 10% 90%, #FFE8EA, #EDF3FF 70%, #EDF2FB);
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.dataDisplayOfHome {
    flex: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 50px;
}

.visualizationOfHome {
    flex: 5;
    height: 100%;
    width: 100%;
    background-color: white;
}

.dataTableOfHome {
    display: flex;
    flex: 5;
    height: 100%;
    width: 100%;
    background-color: white;
}

.left-column {
    flex: 1;
    background-color: white;
}

.right-column {
    flex: 1;
    background-color: white;
}

.adviseOfHome {
    flex: 2;
    height: 100%;
    width: 100%;
    background-color: skyblue;
}

.headOfDataDisplay {
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
}

.detailedData {
    flex: 5;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
}

.demoOfDivInDetailedData {
    flex: 1;
    width: 100%;
    height: 80%;
    border-radius: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    overflow: hidden;
}
</style>