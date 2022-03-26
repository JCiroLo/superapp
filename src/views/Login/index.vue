<template lang="pug">
.container-login
  .background
    svg(viewBox="0 0 500 150" preserveAspectRatio="none")
      path.back2(d="M-79.81,-45.92 C30.22,131.95 299.98,-65.69 311.26,317.75 L0.00,150.22 L-18.87,75.62 Z")
      path.back1(d="M-79.81,-45.92 C30.22,131.95 299.98,-65.69 311.26,317.75 L0.00,150.22 L-18.87,75.62 Z")
      path.main(d="M-79.81,-45.92 C30.22,131.95 299.98,-65.69 311.26,317.75 L0.00,150.22 L-18.87,75.62 Z")
  .login-box(:class="{error: error.status}")
    .thumbnail.col-12.col-lg-6
      img(:src="require('@/assets/img/pic-login.png')" alt="")
    .login-form.col-12.col-lg-6
      h2 Iniciar sesión
      form(noValidate @submit.prevent="handleLogin")
        .form-field
          input#username(type="text" placeholder="Usuario" @input="handleInput" @click="removeError")
          i.fas.fa-user
        .form-field
          input#password(type="password" placeholder="Contraseña" @input="handleInput" @click="removeError")
          i.fas.fa-lock
        p.feedback-error {{error.message}}
        button.btn.btn-main(type='submit') 
          i.fad.fa-spinner-third.fa-spin(v-if="loading")
          span(v-else) Iniciar sesión
      
</template>

<script src="./index.js"></script>
<style lang="scss" scoped src="./styles.scss"></style>
