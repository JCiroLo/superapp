<template lang="pug">
.list-input
  .list-input-element(v-for="(element, index) in list" :key="index")
    span(v-if="ordered") {{index + 1}}. {{element}}
    li(v-else) {{element}}
    button.btn.btn-icon(type="button")
      i.fal.fa-times.fa-fw(@click="removeElement(index)")
  form.list-form(noValidate @submit.prevent="addElement")
    input(:type="type" :placeholder="placeholder" v-model="inputContent")
    button.btn.btn-main
      i.far.fa-plus
</template>

<script src="./index.js"></script>
<style lang="scss" scoped src="./styles.scss"></style>
