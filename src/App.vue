<template lang='pug'>
  #app
    main-header
    router-view
    main-footer
</template>

<script>
import MainHeader from '@/components/Header';
import MainFooter from '@/components/Footer';

export default {
  name: 'App',
  components: {
    MainHeader,
    MainFooter
  }
};
</script>
<style lang="scss" src='@/assets/sass/main.scss'></style>

