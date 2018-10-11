<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="账户登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import {mapActions} from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'login'
    ]),
    handleSubmit ({ username, password }) {
      this.login({username,password}).then(res => {
        this.$router.push({
          name: 'home'
        })
      }).catch(error => {

      })
    }
  }
}
</script>

<style>

</style>
