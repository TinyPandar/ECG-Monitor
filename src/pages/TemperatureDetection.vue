<template>
  <div>
    <el-card class="box-card">
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column fixed="left" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="primary" icon="el-icon-edit" size="small"
              circle></el-button>
          </template>
        </el-table-column>
        <el-table-column fixed prop="date" label="日期" width="120">
        </el-table-column>
        <el-table-column prop="disease" label="病情" width="125">
        </el-table-column>
        <el-table-column prop="medicine" label="用药" width="70">
        </el-table-column>
        <el-table-column prop="hospital" label="就诊医院" width="150">
        </el-table-column>
        <el-table-column prop="doctor" label="医生" width="300">
        </el-table-column>

      </el-table>
      <!-- 新增按钮 -->
      <el-button type="primary" @click="handleAdd">新增</el-button>
    </el-card>



    <!-- 编辑对话框 -->
    <el-dialog title="编辑信息" :visible.sync="editDialogVisible" width="30%">
      <el-form ref="editForm" :model="editForm" label-width="80px">
        <el-form-item label="日期">
          <el-date-picker v-model="editForm.date" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="病情">
          <el-input v-model="editForm.disease"></el-input>
        </el-form-item>
        <el-form-item label="用药">
          <el-input v-model="editForm.medicine"></el-input>
        </el-form-item>
        <el-form-item label="就诊医院">
          <el-input v-model="editForm.hospital"></el-input>
        </el-form-item>
        <el-form-item label="医生">
          <el-input v-model="editForm.doctor"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSaveEdit">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tableData: [],
      editDialogVisible: false,
      editForm: {
        date: '',
        disease: '',
        medicine: '',
        hospital: '',
        doctor: ''
      },
      editIndex: -1,
      mode: 'create',
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    }
  },

  methods: {
    loadRec() {
      this.request.get("archives/" + this.user.id)
        .then(res => {
          if (res.status == "200") {
            this.tableData = res.data
            this.tableData.forEach((rec) => {
              rec.date = this.chineseDate(rec.date)
            })
          }
        })
    },
    handleAdd() {
      this.editForm = {
        date: '',
        disease: '',
        medicine: '',
        hospital: '',
        doctor: ''
      };
      this.mode = 'create';
      this.editDialogVisible = true;
    },
    handleEdit(row) {
      this.editIndex = row.archive_id
      this.editForm = {
        date: this.parseChineseDate(row.date),
        disease: row.disease,
        medicine: row.medicine,
        hospital: row.hospital,
        doctor: row.doctor
      }
      this.mode = 'modify';
      this.editDialogVisible = true;
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    },
    formatChineseDate(dateString) {
      const year = dateString.slice(0, 4);
      const month = parseInt(dateString.slice(4, 6), 10);
      const day = parseInt(dateString.slice(6, 8), 10);
      return `${year}年${month}月${day}日`;
    },
    chineseDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}年${month}月${day}日`;
    },
    parseChineseDate(chineseDate) {
      const regex = /(\d{4})年(\d{1,2})月(\d{1,2})日/;
      const match = chineseDate.match(regex);
      if (!match) {
        throw new Error('Invalid Chinese date format');
      }

      const [, year, month, day] = match;
      const standardDate = new Date(`${year}-${month}-${day}`);
      return standardDate;
    },
    handleSaveEdit() {
      this.editForm.date = this.formatDate(this.editForm.date)
      console.log(this.editForm);

      if (this.mode == 'create') {
        this.request.post("archives/" + this.user.id, this.editForm)
          .then(res => {
            // 如果正常获取直接赋值
            if (res.status == "201") {
              this.$message.success("提交成功!")
              this.loadRec()
              this.editDialogVisible = false;
            }
          })
      } else if (this.mode == 'modify') {
        this.request.put("archives/" + this.editIndex, this.editForm)
          .then(res => {
            // 如果正常获取直接赋值
            if (res.status == "204") {
              this.$message.success("修改成功!")
              this.loadRec()
              this.editDialogVisible = false;
            }
          })
      }
    },
  },
  created() {
    this.loadRec()
  }
}

</script>

<style>
.box-card {
  height: 100%;
  padding: 10px;
}

add-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>