export function flattenArray(resultArr: any) {
  let newArr = []
  resultArr?.forEach((item) => {
    const values = Object.values(item)[0]
    const innerValues = Object.values(values)
    newArr = newArr.concat(innerValues)
  })

  return newArr
}
