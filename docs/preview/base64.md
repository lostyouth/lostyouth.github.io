---
title: base64编码
createTime: 2021/11/02 20:22:02
permalink: /article/mdy7tt7a/
---

# base64编码

base64是基于64个可打印字符来表示二进制数据的方法。它将二进制数据转换为文本格式，以便在文本环境中传输和存储。base64编码后的数据比原始数据大，因为它使用了更多的字符来表示相同的数据量。

| 序号 | 编码 | 序号 | 编码 | 序号 | 编码 | 序号 | 编码 |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| 0    | A    | 16   | Q    | 32   | g    | 48   | w    |
| 1    | B    | 17   | R    | 33   | h    | 49   | x    |
| 2    | C    | 18   | S    | 34   | i    | 50   | y    |
| 3    | D    | 19   | T    | 35   | j    | 51   | z    |
| 4    | E    | 20   | U    | 36   | k    | 52   | 0    |
| 5    | F    | 21   | V    | 37   | l    | 53   | 1    |
| 6    | G    | 22   | W    | 38   | m    | 54   | 2    |
| 7    | H    | 23   | X    | 39   | n    | 55   | 3    |
| 8    | I    | 24   | Y    | 40   | o    | 56   | 4    |
| 9    | J    | 25   | Z    | 41   | p    | 57   | 5    |
| 10   | K    | 26   | a    | 42   | q    | 58   | 6    |
| 11   | L    | 27   | b    | 43   | r    | 59   | 7    |
| 12   | M    | 28   | c    | 44   | s    | 60   | 8    |
| 13   | N    | 29   | d    | 45   | t    | 61   | 9    |
| 14   | O    | 30   | e    | 46   | u    | 62   | +    |
| 15   | P    | 31   | f    | 47   | v    | 63   | /    |

## base64编码原理

base64编码是将二进制数据转换为文本格式的过程。它将每3个字节的数据转换为4个字符的文本，每个字符对应一个base64编码字符。编码过程如下：

1. 将每3个字节的二进制数据转换为4个6位的二进制数据。
2. 将每个6位的二进制数据转换为对应的base64编码字符。
3. 如果二进制数据的字节数不是3的倍数，则在编码后的文本末尾添加一个或两个"="字符，以表示缺少的字节。

## 动手实现一个base64编解码函数

```js
function base64Encode(str) {
  const base64Chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  let byteTemp = [];
  let result = [];
  const encodeArray = new TextEncoder().encode(str);
  for (let i = 0; i < encodeArray.length; i++) {
    byteTemp = byteTemp.concat(encodeArray[i].toString(2).padStart(8, "0").split(""));
    while (byteTemp.length / 6 >= 1) {
      result.push(base64Chars[parseInt(byteTemp.splice(0, 6).join(""), 2)]);
    }
  }
  if (byteTemp.length > 0) {
    const last = (6 - byteTemp.length) / 2;
    byteTemp = byteTemp.concat(Array(6 - byteTemp.length).fill(0));
    result.push(base64Chars[parseInt(byteTemp.join(""), 2)]);
    if (last > 0) result.push(Array(last).fill("=").join(""));
  }
  return result.join("");
}

function base64Decode(str) {
  const base64Chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let byteTemp = [];
  let result = [];
  for (let i = 0; i < str.length; i++) {
    if (!base64Chars.includes(str[i])) {
      throw new Error("Invalid character in base64 string");
    }
    if (str[i] === "=") {
      byteTemp.push("00");
    } else {
      const index = base64Chars.indexOf(str[i]);
      byteTemp = byteTemp.concat(index.toString(2).padStart(6, "0").split(""));
    }
    while (byteTemp.length >= 8) {
      result.push(parseInt(byteTemp.splice(0, 8).join(""), 2));
    }
  }
  return new TextDecoder().decode(new Uint8Array(result));
}
```

通过自己实现上面的代码可发现，其实只要改变了了编码和解码的规则，就可以实现任意编码和解码，比如base32、base16等。或者是改变编码字符集，就可以实现一个自定义的对称加密算法，只不过这个算法在web中使用是不安全的。

## 在线测试

<Base64Component />

## base64应用

base64编码广泛应用于各种场景，例如：

1. 在电子邮件中传输二进制数据，如图片、音频和视频文件。
2. 在URL中传输二进制数据，如图片、音频和视频文件的URL。
3. 在Web开发中，将二进制数据转换为文本格式，以便在HTML和CSS中使用。
4. 在数据加密和解密中，将二进制数据转换为文本格式，以便在加密和解密过程中使用。

## base64编码注意事项

1. base64编码后的数据比原始数据大，因为它使用了更多的字符来表示相同的数据量。因此，在传输和存储base64编码后的数据时，需要考虑数据大小的限制。
2. base64编码后的数据不是加密的，它只是将二进制数据转换为文本格式。因此，base64编码后的数据可以被任何人解码，如果需要保护数据的安全性，应该使用加密算法对数据进行加密。
