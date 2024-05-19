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

export const checkAge = (rule, value, callback) => {
  if (value && value.length > 0) {
    if (value[0] && value[1]) {
      if (!Number.isInteger(+value[0]) || !Number.isInteger(+value[1])) {
        return callback(new Error('请输入整数'))
      } else if (value[0] > value[1]) {
        return callback(new Error('起始年龄应不大于终止年龄'))
      } else {
        callback()
      }
    } else {
      if (value[0] && !Number.isInteger(+value[0])) {
        return callback(new Error('请输入整数'))
      } else if (value[1] && !Number.isInteger(+value[1])) {
        return callback(new Error('请输入整数'))
      } else if (value[1] === 0) {
        return callback(new Error('请输入大于 0 的整数'))
      } else {
        callback()
      }
    }
  } else {
    callback()
  }
}
export const validatePassword = (rule, value, callback) => {
  // const passwordRE = '^(?![a-zA-Z]+$)(?!d+$)(?![^da-zA-Zs]+$).{6,12}$' //由字母、数字、特殊字符，任意2种组成，6-12位
  const passwordRE = /^[\da-zA-Z]{6,12}$/
  if (value) {
    if (passwordRE.test(value)) {
      callback()
    } else {
      callback(new Error('由字母或数字组成，6-12位'))
    }
  } else {
    callback()
  }
}
export const validateEmail = (rule, value, callback) => {
  const emailRE = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*.[a-zA-Z0-9]{2,6}$/
  if (value) {
    if (emailRE.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的邮箱'))
    }
  } else {
    callback()
  }
}
