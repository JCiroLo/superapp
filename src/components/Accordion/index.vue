<template lang="pug">
.custom-accordion(:class="{collapsed: state}")
  .accordion-toggler(@click="toggleState")
    slot(name="accordion-toggler")
    .accordion-icon
      i.fas.fa-chevron-down.fa-fw
  .accordion-content
    slot(name="accordion-content")
</template>

<script src="./index.js"></script>
<style lang="scss" scoped src="./styles.scss"></style>
