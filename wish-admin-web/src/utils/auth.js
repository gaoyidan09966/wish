export function getUserInfo() {
  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    // JWT 格式是 header.payload.signature
    // 我们解析中间的 payload (索引为 1)
    const payload = token.split('.')[1]
    // atob 是浏览器自带的 Base64 解码
    const decoded = JSON.parse(atob(payload))
    return decoded
  } catch (err) {
    console.error('Token 解析失败:', err)
    return null
  }
}