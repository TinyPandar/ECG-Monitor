<template>
    <div class="mainBody">
        <!--        左侧边栏-->
        <div class="leftBar">
            <LeftNavBar />
        </div>
        <!--        数据可视化部分-->
        <div class="dataView">
            <transition name="animate__animated animate__bounce router_view" enter-active-class="animate__fadeIn"
                leave-active-class="animate__fadeOut" appear>
                <router-view style="transition: all 0.1s" />
            </transition>
            <!--        右侧个人中心组件-->
            <transition name="animate__animated animate__bounce" enter-active-class="animate__bounceInRight"
                leave-active-class="animate__fadeOutRight" appear>
                <div v-if="role == 'user'" v-show="personalViewFlag" class="personalCenter">
                    <PersonalView />
                </div>
            </transition>
        </div>

        <el-dialog title="帮助" :visible.sync="showHelp" >
            <span><Help/></span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showHelp = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="请录入个人信息" :visible.sync="createInfoDialog" width="20%" :close-on-click-modal="false"
            :close-on-press-escape="false" :show-close="false">
            <el-form ref="updateData" :model="updateData" label-width="85px">
                <el-form-item label="姓名:" prop="name" :rules="{ required: true, message: '请输入姓名', trigger: 'blur' }">
                    <el-input v-model="updateData.name" placeholder="请输入姓名" style="width: 140px"></el-input>
                </el-form-item>
                <el-form-item label="地址:" prop="city" :rules="{ required: true, message: '请输入地址', trigger: 'blur' }">
                    <el-input v-model="updateData.city" placeholder="请输入地址" style="width: 140px"></el-input>
                </el-form-item>
                <el-form-item label="年龄:" prop="age" :rules="{ required: true, message: '请输入年龄', trigger: 'blur' }">
                    <el-input-number v-model="updateData.age" placeholder="请输入年龄"
                        style="width: 140px"></el-input-number>
                </el-form-item>
                <el-form-item label="性别:" prop="gender"
                    :rules="{ required: true, message: '请选择性别', trigger: 'change' }">
                    <el-select v-model="updateData.gender" placeholder="请选择性别" style="width: 140px">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="体重(kg):" prop="weight" :rules="{ required: true, message: '请输入体重', trigger: 'blur' }">
                    <el-input-number v-model="updateData.weight" placeholder="请输入体重"
                        style="width: 140px"></el-input-number>
                </el-form-item>
                <el-form-item label="身高(cm):" prop="height" :rules="{ required: true, message: '请输入身高', trigger: 'blur' }">
                    <el-input-number v-model="updateData.height" placeholder="请输入身高"
                        style="width: 140px"></el-input-number>
                </el-form-item>
                <el-form-item label="血型:" prop="blood_type"
                    :rules="{ required: true, message: '请输入血型', trigger: 'blur' }">
                    <el-input v-model="updateData.blood_type" placeholder="请输入血型" style="width: 140px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showHelp=true">帮助 <i class="el-icon-info"></i></el-button>
                <el-button type="primary" @click="handleSaveEdit">保 存</el-button>
            </div>
        </el-dialog>
        

    </div>
</template>
<script>
import axios from "axios";
import LeftNavBar from "../components/LeftNavBar";
import Help from "../components/Help";
import PersonalView from "../components/PersonalView";

export default {
    name: "Manage",
    components: { LeftNavBar, PersonalView, Help },
    data() {
        return {
            createInfoDialog: false,
            user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
            username: localStorage.getItem("username"),
            personalViewFlag: true,
            updateData: {},
            role: 'user',
            showHelp : false,
        }
    },
    methods: {
        handleSaveEdit() {
            this.request.post('info/' + this.user.id, this.updateData)
                .then((res) => {
                    this.$message.success("提交成功!")
                    this.createInfoDialog = false
                    this.$bus.$emit('creatInfoSuccess');
                })
                .catch((err) => {
                    this.$message.error("更换失败!")
                })
        }
    },
    created() {
        this.role = this.username.startsWith('doc_') ? 'doctor' : 'user'
        this.personalViewFlag = !this.username.startsWith('doc_')
    },
    mounted() {
        this.$bus.$on('personalCenterChange', (data) => {
            this.personalViewFlag = data
        })
        this.$bus.$on('createInfo', () => {
            
            this.createInfoDialog = true
        })
        this.$bus.$on('showHelp', () => {
            this.showHelp = true
        })
    }
}
</script>

<style scoped>
.mainBody {
    height: 100vh;
    background-color: #257B5E;
    display: flex;
    justify-content: center;
    align-items: center;
    display: flex;
    background-image: url("../assets/images/background.png");
    background-repeat: no-repeat; /* 防止背景图像重复 */
    background-size: cover; /* 让背景图像充满整个元素 */
    position: relative;
}

.dataView {
    width: 900px;
    height: 650px;
    background-color: #FDFFFD;
    border-bottom-right-radius: 15px;
    border-top-right-radius: 15px;
    overflow: hidden;
    position: relative;
}

.personalCenter {
    position: absolute;
    right: 0px;
    top: 0px;
}

.router_view-leave-active {
    opacity: 0;
}
</style>