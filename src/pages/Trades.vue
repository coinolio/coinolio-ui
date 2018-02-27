<template lang='pug'>
  .container
    h1 Trades
    el-table(:data='trades' height='250' style='width: 100%')
      el-table-column(fixed prop='tran_id' label='ID')
      el-table-column(prop='datetime' label='Date')
      el-table-column(prop='symbolBuy' label='Buy')
      el-table-column(prop='symbolSell' label='Sell')
      el-table-column(prop='side' label='Side')
      el-table-column(prop='price' label='Price')
      el-table-column(prop='amount' label='Amount')
      el-table-column(prop='exchange' label='Exchange')
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'Trades',
  created() {
    this.$store.dispatch('fetchTrades');
  },
  computed: {
    ...mapGetters(['trades'])
  },
  data() {
    return {
    };
  }
};
</script>
<style>
</style>
