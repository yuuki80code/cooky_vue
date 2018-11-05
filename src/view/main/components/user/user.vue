<template>
  <div class="user-avator-dropdown">
    <span style="margin-right: 10px;font-size: 16px;">{{username}}</span>
    <Dropdown @on-click="handleClick">
      <Avatar :src="userAvator"/>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import {setToken,getUserName} from '@/libs/util'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    }
  },
  computed: {
    username: function() {
      return getUserName()
    }
  },
  methods: {
    handleClick (name) {
      this.$store.commit('LOGOUT',{})
      setToken("")
      sessionStorage.clear()
      this.$router.push({
        name: 'login'
      })
    }
  }
}
</script>
