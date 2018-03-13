<template lang='pug'>
  .container
    h1.h2 Plugins
    el-row
      el-col(:xs='12', :sm='6', :md='4', v-for='(e, index) in plugins', :key='e.id', :offset='index > 0 ? 1 : 0')
        el-card(:class='{disabled: !e.enabled}')
          h4.text--centered {{e.name}}
          p.text--centered
            el-tag(v-if='!e.enabled', type='danger') Disabled
            el-tag(v-else, type='success') Enabled
          .bottom.clearfix
            //- span Active:
            //-   el-switch(v-model='e.enabled', active-color="#13ce66", inactive-color="#ff4949")
            button.btn.btn--primary.btn--block.btn--large(@click='editPlugin(e.id)') Edit
    el-row
      el-col
        el-card
          button.btn.btn--block.btn--large.btn--affirmative(@click='addPlugin') Add plugin
          el-dialog(title="Plugin", :visible.sync="addPluginVisible")
            el-form(:model="pluginForm", label-width="100px")
              el-form-item(label="Plugin")
                el-select(v-model="pluginForm.name", placeholder="Please select a plugin")
                  el-option(v-for='e in validPlugins', :label="e", :value="e", :key='e', :disabled='usedPlugins.includes(e)')
              template(v-if='pluginForm.name === "Telegram"')
                el-form-item(label="Token")
                  el-input(v-model="pluginForm.config.token", auto-complete="off")
                el-form-item(label="Secret")
                  el-input(v-model="pluginForm.config.secret", auto-complete="off")
              el-form-item(label="Enabled")
                el-switch(v-model="pluginForm.enabled")
              el-form-item(v-if='editMode')
                button.btn.btn--destructive(@click.prevent='deletePlugin') Delete
            span.dialog-footer(slot="footer")
              el-button(@click="clearPlugin") Cancel
              el-button(type="primary", @click="submitPlugin")
                span(v-if='!editMode') Create
                span(v-if='editMode') Save

</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: 'Plugins',
  data() {
    return {
      addPluginVisible: false,
      editMode: false,
      pluginForm: {
        name: '',
        config: {},
        enabled: true
      },
      validPlugins: ['Telegram']
    };
  },
  created() {
    this.$store.dispatch('fetchPlugins');
  },
  computed: {
    ...mapGetters(['plugins']),
    usedPlugins() {
      return this.plugins.map((p) => {
        return p.name;
      });
    }
  },
  methods: {
    addPlugin() {
      this.editMode = false;
      this.addPluginVisible = true;
    },
    clearPlugin() {
      this.editMode = false;
      this.pluginForm = {
        name: '',
        config: {},
        enabled: true
      };
      this.addPluginVisible = false;
    },
    editPlugin(id) {
      this.editMode = true;
      const target = this.plugins.find((e) => {
        return e.id === id;
      });
      this.pluginForm = {
        id: target.id,
        name: target.name,
        config: target.config,
        enabled: target.enabled
      };
      this.addPluginVisible = true;
    },
    submitPlugin() {
      if (this.editMode) {
        this.$store.dispatch('editPlugin', this.pluginForm);
      } else {
        this.$store.dispatch('addPlugin', this.pluginForm);
      }
      this.clearPlugin();
    },
    deletePlugin() {
      this.$confirm('This will permanently delete the plugin (existing trades and snapshots will remain). Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('removePlugin', this.pluginForm.id);
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
