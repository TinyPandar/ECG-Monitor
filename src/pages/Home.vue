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
                <el-card :body-style="{ padding: '0px' }" class="box-card">
                    <el-skeleton-item v-show="picUrl == ''" variant="image" style="width: 428px; height: 214px;" />
                    <img v-show="picUrl != ''" :src="picUrl" class="image" style="width: 100%; height: auto;">
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
                    <div v-if="grade in grades">
                        <h3 style="margin: 0;">{{ grades[grade].label }}</h3>
                        <i>{{ grades[grade].characteristics }}</i>
                        <el-divider content-position="left">建议</el-divider>
                        <ul>
                            <li v-for="(advice, index) in grades[grade].advice" :key="index">
                                {{ advice }}
                            </li>
                        </ul>
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
            currentDate: new Date(),
            grade: 0, // the current grade
            grades: {
                0: {
                    label: '暂无信号',
                    characteristics: '请耐心等待几秒',
                    advice: ['',
                        '',
                        ''],
                },
                'Grade 0': {
                    label: '健康心电图',
                    characteristics: '正常心率60-100次/分钟，P波、QRS波、T波正常，PR间期0.12-0.20秒，ST段水平。',
                    advice: ['即使您的心电图显示完全健康，仍然建议保持良好的生活习惯和定期检查，以确保持续健康。',
                        '保持均衡饮食和适量运动。定期进行年度体检和心电图检查。',
                        '注意身体异常信号，及时就医。'],
                },
                'Grade 1': {
                    label: '普通心电图',
                    characteristics: '心电图正常或只有轻微异常，一般不会对您的健康造成重大影响。',
                    advice: ['注意观察：如果您感觉不适，请注意观察自己的身体状况。如果症状持续或加重，尽快就医。',
                        '定期检查：即使心电图显示只有轻微异常，定期检查仍然是保持健康的好方法。根据医生的建议，安排后续的体检或心电图检查。',
                        '保持健康生活方式：尽量保持健康的生活方式，包括均衡饮食、适量运动和充足的休息。'],
                },
                'Grade 2': {
                    label: '预警心电图',
                    characteristics: '心电图显示有异常，但目前尚未对您的健康构成严重威胁，但可能会恶化。',
                    advice: ['尽快就医：尽快前往最近的医院或心内科门诊进行详细检查和治疗，不要拖延。',
                        '避免剧烈活动：在前往医院之前，避免剧烈运动或其他可能加重病情的活动。',
                        '告知医生：到达医院后，向医生提供远程心电图的异常信息，帮助医生快速了解您的情况。'],
                },
                'Grade 3': {
                    label: '危急心电图',
                    characteristics: '心电图显示可能导致严重健康问题或生命危险的情况。',
                    advice: ['立即就医：如果您接收到此类提示，请立即拨打急救电话（如120）并寻求紧急医疗服务。不要自行前往医院，应等待急救车到达。',
                        '保持冷静：在等待急救车到来的过程中，尽量保持平静，减少活动量。',
                        '通知家人或朋友：尽快告知身边的人，以便他们能够在急救人员到达前提供帮助。'],
                },
            },
            username: localStorage.getItem("username"),
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
            if (!this.username.startsWith('doc_')) {
                if (this.username.startsWith('bad_')) {
                    this.request.get("/static/sig/602.csv")
                        .then(res => {
                            this.signal = this.parseCSV(res.data)
                            console.log(this.signal[1])
                            this.drawECG()
                        })
                } else {

                    fetch('106MLII.csv')
                        .then(response => response.text())
                        .then(data => {
                            this.signal = this.parseCSV(data);
                            this.drawECG();
                        })
                        .catch(error => console.error('Error:', error));
                }
            }
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
                    min: -1,
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
                // console.log(submitData);
                this.request.post('/predict', { 'signal': submitData })
                    .then(res => {
                        this.picUrl = res.data.url
                        this.grade = res.data.label
                    })
                this.currentDate = new Date()
            }
            predict()
            setInterval(function () {
                predict()
            }, 2000);

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