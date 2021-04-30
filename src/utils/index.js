export function powerSet(arr) {
  return arr.reduce((a, v) => {
    return a.concat(
      a.map(r => {
        return [v].concat(r)
      })
    )
  }, [[]]).slice(1)
}

// 两个数组里面的元素是否完全相同
export function compareArr(arr1, arr2) {
  if (arr1.length !== arr2.length) return false
  let flag = true
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) flag = false
  }
  return flag
}

// 找到第一个参数数组里面的包含第二个参数数组的元素
/* arr1 = [['purple', 'one', 128], ['purple', 'one', 64]]
arr2 = ['purple', 'one', 128] */
export function isArrEqual(arr1, arr2) {
  let flag1 = false
  arr1.forEach(arr1Value => {
    let flag2 = true
    arr2.forEach(arr2Value => {
      if (!arr1Value.includes(arr2Value)) {
        flag2 = false
      }
    })
    if (flag2 && arr1Value.length === arr2.length) {
      flag1 = true
    }
  })
  return flag1
}