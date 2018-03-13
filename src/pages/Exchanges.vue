<template lang='pug'>
  .container
    h1.h2 Exchanges
    el-row
      el-col(:xs='12', :sm='6', :md='4', v-for='(e, index) in exchanges', :key='e.id', :offset='index > 0 ? 1 : 0')
        el-card(:class='{disabled: !e.enabled}')
          h4.text--centered {{e.name}}
          p.text--centered
            el-tag(v-if='!e.enabled', type='danger') Disabled
            el-tag(v-else, type='success') Enabled
          .bottom.clearfix
            //- span Active:
            //-   el-switch(v-model='e.enabled', active-color="#13ce66", inactive-color="#ff4949")
            button.btn.btn--primary.btn--block.btn--large(@click='editExchange(e.id)') Edit
    el-row
      el-col
        el-card
          button.btn.btn--block.btn--large.btn--affirmative(@click='addExchange') Add exchange
          el-dialog(title="Exchange", :visible.sync="addExchangeVisible")
            el-form(:model="exchangeForm", label-width="100px")
              el-form-item(label="Exchange")
                el-select(v-model="exchangeForm.name", placeholder="Please select an exchange")
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
              el-form-item(v-if='editMode')
                button.btn.btn--destructive(@click.prevent='deleteExchange') Delete
            span.dialog-footer(slot="footer")
              el-button(@click="clearExchange") Cancel
              el-button(type="primary", @click="submitExchange")
                span(v-if='!editMode') Create
                span(v-if='editMode') Save

</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'Exchanges',
  data() {
    return {
      addExchangeVisible: false,
      editMode: false,
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
      this.editMode = false;
      this.addExchangeVisible = true;
    },
    clearExchange() {
      this.editMode = false;
      this.exchangeForm = {
        name: '',
        config: {},
        enabled: true
      };
      this.addExchangeVisible = false;
    },
    editExchange(id) {
      this.editMode = true;
      const target = this.exchanges.find((e) => {
        return e.id === id;
      });
      this.exchangeForm = {
        id: target.id,
        name: target.name.toLowerCase(),
        config: target.config,
        enabled: target.enabled
      };
      this.addExchangeVisible = true;
    },
    submitExchange() {
      if (this.editMode) {
        this.$store.dispatch('editExchange', this.exchangeForm);
      } else {
        this.$store.dispatch('addExchange', this.exchangeForm);
      }
      this.clearExchange();
    },
    deleteExchange() {
      this.$confirm('This will permanently delete the exchange (existing trades and snapshots will remain). Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('removeExchange', this.exchangeForm.id);
          this.$message({
            type: 'success',
            message: 'Delete completed'
          });
        });
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

  .el-card.disabled {
    opacity: 0.7;
  }
</style>
