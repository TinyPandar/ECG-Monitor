<template>
    <div class="mainBody">
<!--        左侧边栏-->
        <div class="leftBar">
            <LeftNavBar/>
        </div>
<!--        数据可视化部分-->
        <div class="dataView">
            <transition
                    name="animate__animated animate__bounce router_view"
                    enter-active-class="animate__fadeIn"
                    leave-active-class="animate__fadeOut"
                    appear
            >
            <router-view style="transition: all 0.1s" />
            </transition>
            <!--        右侧个人中心组件-->
            <transition
                    name="animate__animated animate__bounce"
                    enter-active-class="animate__bounceInRight"
                    leave-active-class="animate__fadeOutRight"
                    appear
            >
            <div v-show="personalViewFlag" class="personalCenter">
                <PersonalView />
            </div>
            </transition>
        </div>
        <el-dialog
            title="请录入个人信息"
            :visible.sync="createInfoDialog"
            width="30%">
            <el-form ref="updateData" :model="updateData" label-width="80px">
                        <div>
                            姓名:
                            <el-input v-model="updateData.name" placeholder="请输入姓名" style="width: 140px"></el-input>
                        </div>
                        <div>
                            地址:
                            <el-input v-model="updateData.city" placeholder="请输入地址"  style="width: 140px"></el-input>
                        </div>
                        <div>
                            年龄:
                            <el-input v-model="updateData.age" placeholder="请输入年龄"  style="width: 140px"></el-input>
                        </div>
                        <div>
                            性别:
                            <el-input v-model="updateData.gender" placeholder="请输入性别"  style="width: 140px"></el-input>
                        </div>
                        <div>
                            体重:
                            <el-input v-model="updateData.weight" placeholder="请输入体重"  style="width: 140px"></el-input>
                        </div>
                        <div>
                            身高:
                            <el-input v-model="updateData.height" placeholder="请输入身高"  style="width: 140px"></el-input>
                        </div>
                        <div>
                            血型:
                            <el-input v-model="updateData.blood_type" placeholder="请输入血型"  style="width: 140px"></el-input>
                        </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
            <el-button @click="createInfoDialog = false">取 消</el-button>
            <el-button type="primary" @click="handleSaveEdit">保 存</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import axios from "axios";
    import LeftNavBar from "../components/LeftNavBar";
    import PersonalView from "../components/PersonalView";

    export default {
        name: "Manage",
        components:{LeftNavBar,PersonalView},
        data(){
            return{
                personalViewFlag:true,
                createInfoDialog:false,
                user: localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):{},
                updateData:{},
            }
          },
        methods:{
            handleSaveEdit(){
                this.request.post('info/'+this.user.id, this.updateData)
                .then((res)=>{
                    this.$message.success("提交成功!")
                    this.createInfoDialog = false
                    this.$bus.$emit('creatInfoSuccess');
                })
                .catch((err)=>{
                    this.$message.error("更换失败!")
                })
            }
        },
        mounted() {
            this.$bus.$on('personalCenterChange',(data)=>{
                this.personalViewFlag=data
            })
            this.$bus.$on('createInfo',()=>{
                this.createInfoDialog=true
            })
        }
    }
</script>

<style scoped>
.mainBody{
    height: 100vh;
    background-color: #257B5E;
    display: flex;
    justify-content: center;
    align-items: center;
    display: flex;
    background-image: url("../assets/images/background.png");
    background-size: 100%;
    position: relative;
}
    .dataView{
        width: 900px;
        height: 650px;
        background-color:#FDFFFD ;
        border-bottom-right-radius: 15px;
        border-top-right-radius: 15px;
        overflow: hidden;
        position: relative;
    }
    .personalCenter{
        position: absolute;
        right: 0px;
        top: 0px;
    }
    .router_view-leave-active {
        opacity: 0;
    }
</style>