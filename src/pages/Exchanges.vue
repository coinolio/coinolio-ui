<template lang='pug'>
  .container
    el-row
      el-col(:span='7', v-for='(e, index) in exchanges', :key='e.id', :offset='index > 0 ? 1 : 0')
        el-card
          h4.text--centered {{e.name}}
          .bottom.clearfix
            //- span Active:
            //-   el-switch(v-model='e.enabled', active-color="#13ce66", inactive-color="#ff4949")
            button.btn.btn--primary.btn--block.btn--large Edit
    el-row
      el-col(:span='7')
        el-card
          button.btn.btn--block.btn--large.btn--affirmative(@click='addExchange') Add exchange
          el-dialog(title="Shipping address", :visible.sync="addExchangeVisible")
            el-form(:model="exchangeForm", label-width="100px")
              el-form-item(label="Exchange")
                el-select(v-model="exchangeForm.exchange", placeholder="Please select a zone")
                  el-option(v-for='e in validExchanges', :label="e.charAt(0).toUpperCase() + e.slice(1)", :value="e", :key='e')
                  //- https://github.com/ccxt/ccxt#supported-cryptocurrency-exchange-markets
              el-form-item(label="API Key")
                el-input(v-model="exchangeForm.config.apiKey", auto-complete="off")
              el-form-item(label="API Secret")
                el-input(v-model="exchangeForm.config.secret", auto-complete="off")
              el-form-item(label="API Password")
                el-input(v-model="exchangeForm.config.password", auto-complete="off")
              el-form-item(label="Enabled")
                el-switch(v-model="exchangeForm.enabled")
            span.dialog-footer(slot="footer")
              el-button(@click="addExchangeVisible = false") Cancel
              el-button(type="primary", @click="addExchangeVisible = false") Create
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'Exchanges',
  data() {
    return {
      addExchangeVisible: false,
      exchangeForm: {
        name: '',
        config: {},
        enabled: true
      }
    };
  },
  created() {
    this.$store.dispatch('fetchValidExchanges');
    this.$store.dispatch('fetchExchanges');
  },
  computed: {
    ...mapGetters(['exchanges']),
    ...mapGetters(['validExchanges'])
  },
  methods: {
    addExchange() {
      this.addExchangeVisible = true;
    }
  }
};
</script>
<style lang='scss'>
  .el-row + .el-row {
    margin-top: spacing(extra-loose);
  }

  .el-select-dropdown__item {
    margin-left: 0;
  }
</style>
