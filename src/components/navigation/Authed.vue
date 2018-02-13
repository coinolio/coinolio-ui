<template lang='pug'>
  .top-navigation
    .top-navigation__branding
      router-link.navigation__item(to='/')
        .header_logo
          img(src='@/assets/img/logo.svg')
    .navigation
      .top-navigation__item.navigation__item
        router-link(to='/') Dashboard
      .top-navigation__item.navigation__item
        router-link(to='/trades') Trades

      .top-navigation__item.navigation__item.top-navigation__item--right
        a(href='#') {{user.username || 'Account'}}
        ul.navigation
          li.navigation__item
            router-link(to='/account') Account
          li.navigation__item
            router-link(to='/exchanges') Exchanges
          li.navigation__item
            router-link(to='/plugins') Plugins
          li.navigation__item
            router-link(to='/events') Events
          li.navigation__item
            router-link(to='/logout') Logout
</template>
<script>
export default {
  data() {
    return {
      user: this.$store.state.auth.authUser
    };
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
  .header_logo {
    height: rem(50px);

    img {
      height: 100%;
    }
  }
</style>

