<template>
  <div class="lobby-background">
    <div class="lobby-background__bubble lobby-background__bubble--1" />
    <div class="lobby-background__bubble lobby-background__bubble--2" />
    <div class="lobby-background__bubble lobby-background__bubble--3" />
    <div class="lobby-background__bubble lobby-background__bubble--4" />
    <div class="lobby-background__bubble lobby-background__bubble--5" />
    <div class="lobby-background__bubble lobby-background__bubble--6" />
    <div class="lobby-background__bubble lobby-background__bubble--7" />
    <div class="lobby-background__bubble lobby-background__bubble--8" />
    <div class="lobby-background__bubble lobby-background__bubble--9" />
  </div>
</template>

<style lang="scss" scoped>
.lobby-background {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: #202230;
  z-index: 3;
  background-image: repeating-linear-gradient(
      #313449 0 1px,
      transparent 1px 100%
    ),
    repeating-linear-gradient(90deg, #313449 0 1px, transparent 1px 100%);
  background-size: 71px 71px;

  &__bubble {
    height: 25px;
    width: 25px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
    z-index: 3;

    &--1 {
      background-color: #e921a5;
      height: 10rem;
      width: 10rem;
      top: 6%;
      left: 7%;
    }

    &--2 {
      background-color: #aaf6fa;
      width: 140.8px;
      height: 140.8px;
      left: 17%;
      top: 19%;
    }
    &--3 {
      background-color: #636363;
      width: 110.4px;
      height: 110.4px;
      left: 25%;
      top: 43%;
    }
    &--4 {
      background-color: #eb6182;
      width: 174.4px;
      height: 174.4px;
      left: 29%;
      top: 76%;
    }
    &--5 {
      background-color: #5fe28b;
      width: 120px;
      height: 120px;
      left: 25%;
      top: 3%;
    }
    &--6 {
      background-color: #f56969;
      width: 153.6px;
      height: 153.6px;
      left: 11%;
      top: 39%;
    }
    &--7 {
      background-color: #e6ff4f;
      width: 177.6px;
      height: 177.6px;
      left: -50%;
      top: 63%;
    }
    &--8 {
      background-color: #1fb91c;
      width: 137.6px;
      height: 137.6px;
      left: 2%;
      top: 38%;
    }
  }
}
</style>
