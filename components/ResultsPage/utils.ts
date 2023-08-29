export function flattenArray(resultArr: any) {
  let newArr = []
  resultArr?.forEach((item) => {
    const values = Object.values(item)[0]
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

export function getSortedListLinks(listLinkArray, futureClientEligibleArray) {
  const sortArray = (a, b) => {
    if (a.eligible == null || b.eligible == null) {
      return 0
    }
    if (a.eligible && !b.eligible) {
      return -1
    }
    if (!a.eligible && b.eligible) {
      return 1
    }

    // This accounts for future planning results and preserves the order of links as they appear in the future eligible array
    if (!a.eligible && !b.eligible) {
      let aIndex = futureClientEligibleArray.findIndex(
        (benefit) => benefit.benefitKey === a.id
      )
      let bIndex = futureClientEligibleArray.findIndex(
        (benefit) => benefit.benefitKey === b.id
      )

      if (aIndex > -1 && bIndex > -1) {
        return aIndex - bIndex
      }
      if (aIndex > -1) {
        return -1
      }
      if (bIndex > -1) {
        return 1
      }
    }

    return 0
  }

  return listLinkArray.sort(sortArray)
}
