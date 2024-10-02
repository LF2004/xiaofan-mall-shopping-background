<template>
  <div class="login-box">
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="80px"
        class="demo-ruleForm"
    >
      <h2>小帆购物商品后台</h2>
      <el-form-item label="账号" prop="uName">
        <el-input v-model="ruleForm.uName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" prop="uPwd">
        <el-input
            v-model="ruleForm.uPwd"
            type="password"
            autocomplete="off"
            @keyup.enter="Userlogin(ruleFormRef)"
        />
      </el-form-item>
      <el-form-item>
        <el-button class="loginBtn" type="primary" @click="Userlogin(ruleFormRef)"
        >登录</el-button
        >
        <el-button class="loginBtn" @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { defineComponent,reactive,ref,toRefs } from 'vue'
import { useRouter } from "vue-router";
import { LoginData } from '../type/login'
import { login } from '../services/login'
import type { FormInstance, FormRules } from 'element-plus'
import {ElMessage} from "element-plus";
export default defineComponent({
  setup() {
    const data = reactive(new LoginData())
    const rules = {
        uName: [
          { required: true, message: '请输入你的账号', trigger: 'blur' },
          { min: 3, max: 10, message: '账号长度为3~10之间', trigger: 'blur' },
        ],
        uPwd: [
          { required: true, message: '请输入你的密码', trigger: 'blur' },
          { min: 3, max: 10, message: '密码长度为3~10之间', trigger: 'blur' },
        ],
    }

    // 登录
    const ruleFormRef = ref<FormInstance>()
    const router = useRouter();

    const Userlogin = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.validate(async (valid) => {
        if (valid) {

          const res = await login(data.ruleForm);
          // @ts-ignore
          if(res.code === 200) {
            // @ts-ignore
            localStorage.setItem('token', res.result.token);
            // @ts-ignore
            localStorage.setItem('userInfo',JSON.stringify(res.result.userInfo));
            router.push('/home');
          }
        } else {
          ElMessage({ type: 'warning', message: '请按需要填入!' })
          return false
        }
      })
    }
    // 重置表单
    const resetForm = ()=>{
      data.ruleForm.uName = ''
      data.ruleForm.uPwd = ''
    }
    return {...toRefs(data),rules,ruleFormRef,Userlogin,resetForm}
  }
})
</script>

<style lang="scss" scoped>
.login-box {
  width: 100%;
  height: 100%;
  padding: 1px;
  text-align: center;
  background: transparent url("@/assets/image/233548kBBay.jpg") 50% no-repeat;
  background-size: 1920px;

  .demo-ruleForm{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 500px;
    padding: 40px;
    border-radius: 15px;
    backdrop-filter: blur(20px);
  }
  .loginBtn{
    width: 48%;
  }
  h2{
    margin-left: 40px;
    margin-bottom: 20px;
    color: #ffffff;
    text-shadow: 2px 2px 5px #000;
  }
}
</style>
