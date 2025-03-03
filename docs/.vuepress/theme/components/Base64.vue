<template>
  <div class="com-container">
    <textarea v-model="message" placeholder="请输入"></textarea>
    <div class="btns">
      <button @click="handleEncode">Base64编码</button>
      <button @click="handleDecode">Base64解码</button>
    </div>
    <div class="output">输出：{{ output }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const message = ref('')
const output = ref('')

const handleEncode = () => {
  output.value = base64Encode(message.value)
}
const handleDecode = () => {
  try {
    output.value = base64Decode(message.value)
  } catch (error) {
    output.value = 'Invalid character in base64 string'
  }
}

function base64Encode(str: string) {
  const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let byteTemp: string[] = []
  let result: string[] = []
  const encodeArray = new TextEncoder().encode(str)
  for (let i = 0; i < encodeArray.length; i++) {
    byteTemp = byteTemp.concat(encodeArray[i].toString(2).padStart(8, '0').split(''))
    while (byteTemp.length / 6 >= 1) {
      result.push(base64Chars[parseInt(byteTemp.splice(0, 6).join(''), 2)])
    }
  }
  if (byteTemp.length > 0) {
    const last = (6 - byteTemp.length) / 2
    byteTemp = byteTemp.concat(Array(6 - byteTemp.length).fill(0))
    result.push(base64Chars[parseInt(byteTemp.join(''), 2)])
    if (last > 0) result.push(Array(last).fill('=').join(''))
  }
  return result.join('')
}

function base64Decode(str: string) {
  const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  let byteTemp: string[] = []
  let result: number[] = []
  for (let i = 0; i < str.length; i++) {
    if (!base64Chars.includes(str[i])) {
      throw new Error('Invalid character in base64 string')
    }
    if (str[i] === '=') {
      byteTemp.push('00')
    } else {
      const index = base64Chars.indexOf(str[i])
      byteTemp = byteTemp.concat(index.toString(2).padStart(6, '0').split(''))
    }
    while (byteTemp.length >= 8) {
      result.push(parseInt(byteTemp.splice(0, 8).join(''), 2))
    }
  }
  return new TextDecoder().decode(new Uint8Array(result))
}
</script>

<style lang="scss" scoped>
.com-container {
  padding: 10px;
  border: 1px solid #cccccc55;
  textarea {
    width: 100%;
    height: 150px;
    border: 1px solid #cccccc55;
    resize: none;
    padding: 10px;
  }
  .btns {
    margin: 0;
    button {
      margin-right: 10px;
      border: 1px solid #cccccc55;
      padding: 0 10px;
    }
  }
  .output {
    margin-top: 10px;
    white-space: pre-wrap;
  }
}
</style>
