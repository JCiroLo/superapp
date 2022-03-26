<template lang="pug">
transition(name="fade")
  .loader(v-if="show")
    .loader-body 
      .loader-trail
      .loader-line
</template>

<script src="./index.js"></script>
<style lang="scss" scoped src="./styles.scss"></style>
