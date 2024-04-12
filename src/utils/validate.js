export const validateID = (rule, value, callback) => {
  let _IDRe18 = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  let _IDre15 = /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/
  // 校验身份证：
  if (value) {
    if (_IDRe18.test(value) || _IDre15.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的身份证号码'))
    }
  } else {
    callback()
  }
}
