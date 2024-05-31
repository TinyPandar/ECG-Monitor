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
            <!-- <canvas id="canvas" width="480" height="160" style="background-color: whitesmoke;"></canvas> -->
        </div>
        <!--        心电分析+风险预测-->
        <div class="dataTableOfHome">

            <div class="left-column">
                心电分析
            </div>
            <div class="right-column">
                风险预测
            </div>
        </div>
        <!--        建议-->
        <div class="adviseOfHome">

            建议在这里
        </div>
        <!-- data.push(this.signal[0])
                this.signal.shift -->

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
            signal: []
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

            const randomData = () => {
                let value = this.signal[index]; // 使用索引来访问数组
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
            for (var i = 0; i < 721; i++) {
                data.push(randomData());
            }

            option = {
                title: {
                    text: 'Dynamic Data & Time Axis'
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
                        show: false
                    },
                    show: false,
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, 'mV'],
                    splitLine: {
                        show: false
                    }
                },
                series: [
                    {
                        name: 'ECG Signal',
                        type: 'line',
                        showSymbol: false,
                        data: data
                    }
                ]
            };
            setInterval(function () {
                for (var i = 0; i < 9; i++) {
                    data.shift();
                    data.push(randomData());
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

            option && myChart.setOption(option);
        }
    },
    created() {
        this.loadECG()
    }
}
</script>

<style scoped>
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
    background-color: pink;
}

.dataTableOfHome {
    display: flex;
    flex: 5;
    height: 100%;
    width: 100%;
    background-color: yellow;
}

.left-column {
    flex: 1;
    background-color: lightblue;
}

.right-column {
    flex: 1;
    background-color: lightgreen;
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