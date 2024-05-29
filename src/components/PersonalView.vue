<template>
    <div class="viewOfPersonalData">
<!--      头像和消息通知区域-->
        <div class="informationArea">
<!--            头像区-->
            <div class="headAreaOfUser">
                <div style="height:50px;width: 50px;border-radius: 10px;overflow: hidden">
                    <el-upload
                            :action="avatarPostUrl"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            class="avatar-uploader"
                            name="picture"
                    >
                        <img :src="userData.picture" style="width: 100%" class="avatar">
                    </el-upload>
                </div>
            </div>
<!--            图标区-->
            <div class="IconArea">
                <i style="display: block;width: 30px;height: 30px;border-radius: 15px;background-color:#FFFFFF;text-align: center;
                line-height: 30px" class="el-icon-remove-outline" @click="displayNone"></i>
            </div>
        </div>


        <div class="mainBodyOfPersonalCenter">

            <transition-group name="list-complete" tag="p" appear>


                <!--        个人信息区域-->
            <div v-show="flagOfPersonalData" class="personalDataArea" :key="2">
                <!--                表头区-->
                <div class="headOfPersonData">
                    <span style="flex: 2">我的名片</span>
                    <span  style="flex: 1">
                        <el-button v-show="flagOfChangeUserData" type="primary" round style="margin-right: 20px;background-color: rgba(255,255,255,0.1);color: #589D95;font-weight: bold;border: 1px solid #257B5E;height: 25px" @click="updateInfo">保存</el-button>
                    </span>
                </div>
                <!--                    个人信息区主题-->
                <div class="mainBodyOfPersonalData">
                    <!--                    默认信息展示-->
                    <div v-show="!flagOfChangeUserData" class="defaultInformation" @click="flagOfChangeUserData=!flagOfChangeUserData">
                        <div>
                            姓名:
                            <span>{{userData.name}}</span>
                        </div>
                        <div>
                            地址:
                            <span>{{userData.city}}</span>
                        </div>
                        <div>
                            年龄:
                            <span>{{userData.age}}</span>
                        </div>

                        <div>
                            性别:
                            <span>{{userData.gender}}</span>
                        </div>

                        <div>
                            体重:
                            <span>{{userData.weight}}</span>
                        </div>
                        <div>
                            身高:
                            <span>{{userData.height}}</span>
                        </div>
                        <div>
                            血型:
                            <span>{{userData.blood_type}}</span>
                        </div>
                    </div>

                    

                    <!--                    修改信息-->
                    <div v-show="flagOfChangeUserData" class="changeDataOfUser">
                        <div>
                            姓名:
                            <el-input v-model="userData.name" placeholder="请输入姓名" style="width: 140px"></el-input>
                        </div>
                        <div>
                            地址:
                            <el-input v-model="userData.city" placeholder="请输入地址"  style="width: 140px"></el-input>
                        </div>
                        <div>
                            年龄:
                            <el-input v-model="userData.age" placeholder="请输入年龄"  style="width: 140px"></el-input>
                        </div>
                        <div>
                            性别:
                            <el-input v-model="userData.gender" placeholder="请输入性别"  style="width: 140px"></el-input>
                        </div>
                        <div>
                            体重:
                            <el-input v-model="userData.weight" placeholder="请输入体重"  style="width: 140px"></el-input>
                        </div>
                        <div>
                            身高:
                            <el-input v-model="userData.height" placeholder="请输入身高"  style="width: 140px"></el-input>
                        </div>
                        <div>
                            血型:
                            <el-input v-model="userData.blood_type" placeholder="请输入血型"  style="width: 140px"></el-input>
                        </div>
                    </div>
                </div>
            </div>
            </transition-group>
        </div>
        
    </div>
    
</template>

<script>
    import 'animate.css'
    import axios, {Axios as request} from "axios";
    export default {
        name: "PersonalView",
        data(){
            return{
                numberOfRequest:0,
                flagOfPersonalCenter:false,
                flagOfWeather:true,
                flagOfPersonalData:true,
                flagOfdealtArea:true,
                flagOfnotice:true,
                weatherObj:{},
                localTionObj:{},
                sentence:"",
                user: localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):{},
                flagOfChangeUserData:false,
                dialogVisible: true,
                userData:{},
                avatarPostUrl:""
            }
        },
        methods:{
            displayNone(){
                this.$bus.$emit('personalCenterChange',this.flagOfPersonalCenter)
            },
            closePersonalDataArea(){
                this.flagOfPersonalData = !this.flagOfPersonalData
            },
            closedealtArea(){
                this.flagOfdealtArea = !this.flagOfdealtArea
            },
            closenoticeArea(){
                this.flagOfnotice = !this.flagOfnotice
            },
            handleAvatarSuccess(res){
                this.userData.picture = res.picture_url
                this.request.put("info/"+this.user.id, this.userData).then(res=>{
                    if(res.status==="201"){
                        this.$message.success("更换成功!")
                    }
                })
            },
            loadInfo(){
                this.request.get("info/"+this.user.id)
                .then(res=>{
                    // 如果正常获取直接赋值
                    if(res.status == "200"){
                        this.userData = res.data
                        this.user.adurl = this.userData.picture
                        localStorage.setItem("user",JSON.stringify(this.user))
                    }
                })
                // 错误码500显示没创建info表，激活creatInfo事件
                .catch((err)=>{
                    this.$bus.$emit('createInfo')
                })
            },
            updateInfo(){
                this.flagOfChangeUserData=!this.flagOfChangeUserData
                this.request.put("info/"+this.user.id, this.userData)
                .then(res=>{
                    if(res.status == "200"){
                        this.$message.success("修改成功！")
                    }
                })
            },
        },
        created() {
            this.$bus.$on('creatInfoSuccess',()=>{
                this.loadInfo()
            })
            this.avatarPostUrl = "http://192.227.138.209:3939/info/"+this.user.id+"/picture"
            this.loadInfo()
        }

    }
</script>

<style scoped>
    .viewOfPersonalData{
        width: 300px;
        height: 650px;
        background-color: #F5F7F9;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        right: 0px;
    }
    .informationArea{
        width: 80%;
        flex: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: 30px;
    }
    .mainBodyOfPersonalCenter{
        flex: 14;
        width: 100%;
        overflow-y: auto;
        position: relative;
    }
    .mainBodyOfPersonalCenter div{
        border-radius: 15px;
        margin-top: 20px;
    }
    .personalDataArea{
        width: 80%;
        height: 500px;
        background-color: white;
        margin-left: 30px;
        position: relative;
        display: flex;
        align-items: center;
        flex-direction: column;
        background-image: radial-gradient(circle farthest-side at 10% 90%, #FFE8EA, #EDF3FF 70%, #EDF2FB);
    }
.personalDataArea div{
    margin-top: 0px;
}

    .dealtArea{
        width: 80%;
        height: 200px;
        background-color: pink;
        margin-left: 30px;
        position: relative;
    }
    .noticeArea{
        width: 80%;
        height: 200px;
        margin-left: 30px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow-y: auto;
        background-image: radial-gradient(circle farthest-side at 10% 90%, #FCEAED, #EDF3FF 70%, #EDF2FB);
    }
    .noticeArea div{
        margin-top: 0px;
    }
    .headAreaOfUser{
        flex: 5;
        height: 100%;
        display: flex;
        align-items: center;
    }
   
    .IconArea{
        flex: 2;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        font-size: 16px;
    }
    .IconArea i:hover{
        color: #257B5E;
        cursor: pointer;
    }
    .liList li{
    text-align: center;
    }
    .liList li:hover{
        color: #257B5E;
        background-color: rgba(37,123,94,0.1);
    }
.mainBodyOfPersonalCenter div {
    transition: all 0.5s;
}
.list-complete-move {
    transition: all 1s;
}
.list-complete-enter, .list-complete-leave-to
    /* .list-complete-leave-active for below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
}
.list-complete-leave-active {
    position: absolute;
}

    .mainBodyOfPersonalCenter div:hover{
        transform: scale(1.01,1.01);
    }
    .close:hover{
        cursor: pointer;
        color: #2b542c;
    }
    .headOfPersonData{
        height: 100%;
        width: 100%;
        flex: 1;
        display: flex;
        align-items: center;
        padding: 0 15px;
        font-weight: bold;
        font-size: 16px;
    }
    .mainBodyOfPersonalData{
        flex: 6;
        width: 100%;
    }
    .defaultInformation,.changeDataOfUser{
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        width: 100%;
    }

.defaultInformation:hover{
    cursor: pointer;
    background-color: rgba(231,234,237,0.7);
    transform: scale(0,0);
    width: 99%;
    border-radius: 10px;
}
.defaultInformation div,.changeDataOfUser div{
    flex: 1;
    height: 100%;
    font-size: 13px;
    font-weight: bold;
    color: #464646;
    width: 100%;
    padding: 0 15px;
}
/deep/ .el-upload{
    width: 100%;
    height: 100%;
}
.avatar {
    width: 50px;
    height: 50px;
    display: block;
}
</style>