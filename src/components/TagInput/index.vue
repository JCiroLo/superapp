<template lang="pug">
.tags-input
  .tags
    .tag(v-for="(tag, index) in tags" :key="index")
      span {{tag}}
      i.fal.fa-times.fa-fw(@click="removeElement(index)")
    form(noValidate @submit.prevent="addElement")
      input(:type="type" :placeholder="placeholder" v-model="inputContent")
  
</template>

<script src="./index.js"></script>
<style lang="scss" scoped src="./styles.scss"></style>
