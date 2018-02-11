<template lang='pug'>
  .container
    section.login-form.content-box
      h1 Login
      form(v-model='formstate', @submit.prevent='login')
        .field
          .label
            label Username
          input.control--text(v-model='user.username', type='text', name='username', v-validate='"required"', :class="{'input': true, 'is-danger': errors.has('username') }", required)
          span.help.is-danger(v-show="errors.has('username')") {{ errors.first('username') }}
        .field
          .label
            label Password
          input.control--text(v-model='user.password', name='password', type='password', v-validate='"required"', :class="{'input': true, 'is-danger': errors.has('password') }", required)
          span.help.is-danger(v-show="errors.has('password')") {{ errors.first('password') }}
        .field
          button.btn.btn--primary.btn--large.btn--block(type='submit') Sign In
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      formstate: {},
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
      login() {
        this.$store.dispatch('login', this.user)
          .then(() => {
            // this.$router.replace({path: '/admin/library'});
            window.location.href = '/admin/library';
          })
          .catch((e) => {
            this.$message({
              message: e.message || 'There has been a problem logging in',
              type: 'error'
            });
          });
      },
      logout () {
        this.$store.dispatch('logout');
      },
    }
  };

  function requiredValidator(rule, value, callback) {
    if (value === '') {
      callback(new Error(`Please enter a ${rule.field}`));
    } else {
      callback();
    }
  }
</script>
<style lang='scss'>
  .container {
    min-height: 400px;
  }
  .content-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    max-width: 100%;
    margin: 0 auto;
    padding: 40px;
    border: 4px solid color(sky);
    color: color(black);

    input {
      text-align: left;
    }

    h1 {
      text-align: center;
    }
  }
</style>
