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

export function removeDuplicateResults(FutureResultsArray, ResultsArray?) {
  //remove duplicate results within futureResultsArray
  for (let i = FutureResultsArray.length - 1; i >= 0; i--) {
    if (i > 0) {
      if (
        Object.values(Object.values(Object.values(FutureResultsArray)[i])[0])
          .length != 1
      ) {
        if (
          Object.values(Object.values(FutureResultsArray[i])[0])[0].entitlement
            .result ==
            Object.values(Object.values(FutureResultsArray[i - 1])[0])[0]
              .entitlement.result &&
          Object.values(Object.values(FutureResultsArray[i])[0])[1].entitlement
            .result ==
            Object.values(Object.values(FutureResultsArray[i - 1])[0])[1]
              .entitlement.result
        ) {
          FutureResultsArray.pop()
        }
      }
    }
  }
  //if results array is passed remove duplicate results from futureArray based on resultsArray
  if (ResultsArray) {
    //Loop for futureResultsArray [65{}, 75{}, 80{}]
    for (let i = 0; i < FutureResultsArray.length; i++) {
      let isDuplicate = true
      //Loop for benefits at the futureResultsArray[i] [oas, gis], [alw]
      for (
        let j = 0;
        j < Object.values(Object.values(FutureResultsArray[i])[0]).length;
        j++
      ) {
        const activeObject = ResultsArray.find(
          (obj) =>
            obj.benefitKey ===
            Object.values(Object.values(FutureResultsArray[i])[0])[j].benefitKey
        )
        if (activeObject) {
          if (
            activeObject.entitlement.result !==
            Object.values(Object.values(FutureResultsArray[i])[0])[j]
              .entitlement.result
          ) {
            isDuplicate = false
          }
        }
      }
      if (isDuplicate) {
        FutureResultsArray.pop()
      }
    }
  }
  //if FutureResultsArray.length == 0, return null to display nothing
  return FutureResultsArray.length > 0 ? FutureResultsArray : null
}
