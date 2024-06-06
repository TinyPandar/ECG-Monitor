<template>
    <div class="mainBodyOfHome">
        <el-carousel :autoplay="!editDialogVisible" :interval="4000" type="card" height="620px">
            <el-carousel-item v-for="item in signal" :key="item.id">
                <el-card :body-style="{ padding: '0px' }">
                    <el-skeleton-item v-show="!item.imageLoaded" variant="image" style="width: 480px; height: 240px;" />
                    <img v-show="item.imageLoaded" :src="item.url" class="image" @load="item.imageLoaded = true">
                    <div style="padding: 14px;">
                        <span>{{ item.label }}</span>
                        <el-descriptions title="用户信息">
                            <el-descriptions-item label="年龄">{{ item.info.age }}</el-descriptions-item>
                            <el-descriptions-item label="性别">{{ item.info.gender }}</el-descriptions-item>
                            <el-descriptions-item label="体重">{{ item.info.weight }}</el-descriptions-item>
                            <el-descriptions-item label="身高">{{ item.info.height }}</el-descriptions-item>
                            <el-descriptions-item label="备注">
                                {{ item.comment }}
                            </el-descriptions-item>
                        </el-descriptions>
                        <div class="bottom clearfix">
                            <el-button type="text" class="button" v-if="role === 'doctor'"
                                @click="editDialogVisible = true; onEditID = item.abnormal_id">回复</el-button>
                        </div>
                        <el-table :data="item.archive" style="width: 100%" :height="200">
                            <el-table-column prop="date" label="日期"></el-table-column>
                            <el-table-column prop="disease" label="疾病"></el-table-column>
                            <el-table-column prop="medicine" label="药物"></el-table-column>
                        </el-table>
                    </div>

                </el-card>
            </el-carousel-item>
        </el-carousel>
        <el-dialog title="编辑信息" :visible.sync="editDialogVisible" width="30%">
            <el-form ref="editForm" :model="editForm" label-width="80px">
                <el-form-item label="输入文本">
                    <el-input v-model="editForm.comment"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sendReview">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<script>

export default {
    name: "Home",

    data() {
        return {
            imageLoaded: false,
            signal: [],
            editForm: {},
            editDialogVisible: false,
            onEditID: -1,
            user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
            username : localStorage.getItem("username"),
        }
    },

    methods: {
        loadReview() {
            let url = '';
            if (this.role === 'doctor') {
                url = '/abnormal_signals';
            } else {
                url = `/abnormal_signals/${this.user.id}`; // assuming you have userId in your data
            }
            this.request.get(url)
                .then((response) => {
                    const promises = response.data.map(item =>
                        this.request.get(`/info/${item.user_id}`)
                            .then(infoResponse =>
                                this.request.get(`/archives/${item.user_id}`)
                                    .then(archiveResponse => {
                                        const archives = archiveResponse.data.map(archive => ({
                                            ...archive,
                                            date: new Date(archive.date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
                                        }));
                                        return { ...item, info: infoResponse.data, archive: archives, imageLoaded: false };
                                    })
                            )
                    );
                    return Promise.all(promises);
                })
                .then((results) => {
                    this.signal = results;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        sendReview(index) {
            this.request.put("/abnormal_signals/" + this.onEditID + "/comments", { "comment": this.editForm.comment })
                .then((response) => {
                    this.editDialogVisible = false;
                    const index = this.signal.findIndex((it) => it.abnormal_id === this.onEditID);
                    if (index !== -1) {
                        this.signal[index].comment = this.editForm.comment;
                    }
                    this.editForm.comment = ""
                    // this.loadReview()
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    },

    created() {
        this.role = this.username.startsWith('doc_') ? 'doctor' : 'user'
        this.loadReview()
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