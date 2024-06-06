<template>
    <div class="bodyOfManage">
        <div class="leftNavbar" :style="{ width: withOfIconType }">
            <!--            头像区-->
            <div class="profileArea">
                <el-tooltip class="item" effect="dark" content="个人中心" placement="bottom">
                    <img v-if="user.adurl" :src="user.adurl" @click="personalCenterApper">
                    <img v-if="!user.adurl" src="../assets/images/touxiang.png" @click="personalCenterApper">
                </el-tooltip>
            </div>
            <!--           导航栏区-->
            <div class="barArea">
                <!--               文字导航栏-->
                <transition name="animate__animated animate__bounce" enter-active-class="animate__fadeInUp"
                    leave-active-class="animate__zoomOut" appear>
                    <div style="width: 100%;position: absolute">
                        <router-link v-show="flagOfShow" :to="{ name: 'Home' }" active-class="active">实时信息</router-link>
                        <router-link v-show="flagOfShow" :to="{ name: 'RecordDisplay' }"
                            active-class="active">个人档案</router-link>
                        <router-link v-show="flagOfShow" :to="{ name: 'Check' }" active-class="active">历史记录</router-link>
                        <router-link v-show="!flagOfShow" :to="{ name: 'Check' }" active-class="active">检查</router-link>
                    </div>
                </transition>

            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "LeftNavBar",
    data() {
        return {
            withOfIconType: '100px',
            flagOfShow: false,
            flagOfPersonalCenter: true,
            user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
        }
    },
    created() {
        const username = localStorage.getItem("username"); // 从 localStorage 获取 username
        this.flagOfShow = !username.includes('doc_'); // 检查 username 是否包含 "doc_"
    },
    methods: {
        personalCenterApper() {
            // this.flagOfPersonalCenter = !this.flagOfPersonalCenter
            this.$bus.$emit("personalCenterChange", this.flagOfPersonalCenter)
        }
    },

    mounted() {
        this.$bus.$on('updataAdurl', () => {
            this.user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
        })
    },
    beforeDestroy() {
        //    解绑事件
        this.$bus.$off('updataAdurl')
    }

}
</script>

<style scoped>
.active {
    background-color: rgba(37, 123, 94, 0.2);
    color: #257B5E;
}

.active2 {
    color: #257B5E;
}

a {
    position: relative;
    text-decoration: none;
    display: block;
    height: 50px;
    text-align: center;
    line-height: 50px;
    color: #3C3F41;
}

a::before {
    display: block;
    content: "";
    width: 3px;
    height: 50px;
    position: absolute;
    border-radius: 10px;
}

a:hover::before {
    background-color: #69717A;
}

.bodyOfManage {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.leftNavbar {
    transition: 0.5s linear;
    overflow: hidden;
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
    height: 650px;
    width: 100px;
    background-color: #F5F7F9;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.profileArea {

    width: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

}

.profileArea:hover img {
    cursor: pointer;
}

.barArea {
    font-size: 16px;
    display: flex;
    justify-content: center;
    /* align-items: center; */
    width: 100%;
    flex: 6;
    font-weight: bold;
    position: relative;
}

.profileArea img {
    border-radius: 10px;
    width: 50px;
    height: 50px;
}

.changeArea {
    flex: 2;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.changeArea li {
    font-size: 18px;
}

.changeArea li:hover {
    color: #257B5E;
    cursor: pointer;
}
</style>