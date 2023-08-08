export function flattenArray(resultArr: any) {
  let newArr = []
  resultArr?.forEach((item) => {
    const values = Object.values(item)[0]
    console.log('values', values)
    const innerValues = Object.values(values)
    newArr = newArr.concat(innerValues)
  })

  return newArr
}

export function getFirstOccurences(array: any) {
  const keys = new Set()
  return array.filter((item) => {
    if (!keys.has(item.benefitKey)) {
      keys.add(item.benefitKey)
      return true
    }
    return false
  })
}

export function omitCommonBenefitKeys(array1, array2) {
  return array1.filter((item1) => {
    return !array2.some((item2) => item2.benefitKey === item1.benefitKey)
  })
}
