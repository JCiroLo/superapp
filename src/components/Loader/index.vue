<template lang="pug">
transition(name="fade")
  .loader(v-if="show")
    .loader-body 
      // .loader-dot(v-for="dot in 3" :key="dot")
      .loader-trail
      .loader-line
</template>

<script src="./index.js"></script>
<style lang="scss" scoped src="./styles.scss"></style>
