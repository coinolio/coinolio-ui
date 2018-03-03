<template lang='pug'>
  .container
    h1 Trades
    el-table(:data='trades', border, height='500', style='width: 100%')
      el-table-column(fixed prop='tran_id', label='ID')
      el-table-column(prop='datetime', label='Date', sortable)
      el-table-column(prop='symbolBuy', label='Buy', :filters='assetBuys', :filter-method='filterHandler')
      el-table-column(prop='symbolSell', label='Sell', :filters='assetSells', :filter-method='filterHandler')
      el-table-column(prop='side', label='Side', :filters='sideFilters', :filter-method='filterHandler')
      el-table-column(prop='price', label='Price', sortable)
      el-table-column(prop='amount', label='Amount', sortable)
      el-table-column(prop='exchange' label='Exchange', :filters='exchangeFilters', :filter-method='filterHandler')
</template>

<script>
import {mapGetters} from 'vuex';
import unique from 'lodash.uniqby';

export default {
  name: 'Trades',
  created() {
    this.$store.dispatch('fetchTrades');
  },
  computed: {
    ...mapGetters(['trades']),
    ...mapGetters(['exchanges']),
    exchangeFilters() {
      return this.exchanges.map((e) => {
        return {text: e.name, value: e.name.toLowerCase()};
      });
    },
    assetBuys() {
      return unique(this.trades.map((t) => {
        return {text: t.symbolBuy, value: t.symbolBuy};
      }), 'text');
    },
    assetSells() {
      return unique(this.trades.map((t) => {
        return {text: t.symbolSell, value: t.symbolSell};
      }), 'text');
    }
  },
  data() {
    return {
      sideFilters: [
        {
          text: 'Sell',
          value: 'sell'
        },
        {
          text: 'Buy',
          value: 'buy'
        }
      ]
    };
  },
  methods: {
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    }
  }
};
</script>
<style>
</style>
