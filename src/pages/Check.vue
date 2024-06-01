<template>
    <div class="mainBodyOfHome">
        <el-carousel :interval="4000" type="card" height="400px">
            <el-carousel-item v-for="item in 6" :key="item">
                <div>
                    <el-card :body-style="{ padding: '0px' }">
                        <img src="../assets/images/BBB.png" class="image">
                        <div style="padding: 14px;">
                            <span>疑似1级风险</span>
                            <el-descriptions title="用户信息">
                                <el-descriptions-item label="年龄">34</el-descriptions-item>
                                <el-descriptions-item label="性别">女</el-descriptions-item>
                                <el-descriptions-item label="体重">60kg</el-descriptions-item>
                                <el-descriptions-item label="身高">170</el-descriptions-item>
                                <el-descriptions-item label="备注">
                                    <el-tag size="small">无病史</el-tag>
                                </el-descriptions-item>
                                <!-- <el-descriptions-item label="联系地址">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item> -->
                            </el-descriptions>
                            <div class="bottom clearfix">
                                <time class="time">{{ currentDate }}</time>
                                <el-button type="text" class="button">回复</el-button>
                            </div>
                        </div>
                    </el-card>

                </div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>


<script>

export default {
    name: "Home",

    data() {
        return {
            signal: []
        }
    },

    methods: {

        loadECG() {
            this.request.get("/static/sig/418.csv")
                .then(res => {
                    this.signal = this.parseCSV(res.data)
                    console.log(this.signal[1])
                    this.drawECG()
                })
        }

    },

    created() {
        this.loadECG()
    }

}
</script>

<style scoped>
.mainBodyOfHome {
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

.time {
    font-size: 13px;
    color: #999;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
}

.button {
    padding: 0;
    float: right;
}

.image {
    width: 100%;
    display: block;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}
</style>