import { useMemo, useState } from "react"
import _ from "lodash";
import { powerSet, compareArr, isArrEqual } from "./utils/index";
import { Button } from "antd";
import './app.css'

const backEndData = [
  { name: '颜色', id: 0, arr: [{ skuName: 'purple', id: 100 }, { skuName: 'red', id: 101 }] },
  { name: '套餐', id: 1, arr: [{ skuName: 'one', id: 102 }, { skuName: 'two', id: 103 }, { skuName: 'three', id: 104 }] },
  { name: '内存', id: 2, arr: [{ skuName: '64', id: 105 }, { skuName: '128', id: 106 }] },
  { name: '保修', id: 3, arr: [{ skuName: '一年', id: 107 }, { skuName: '两年', id: 108 }, { skuName: '三年', id: 109 }] }
]

const data = [
  ['purple', 'one', '64', '一年'],
  ['red', 'two', '128', '两年'],
  ['purple', 'one', '128', '一年'],
  ['purple', 'three', '64', '一年']
]

function App() {
  const [selectedArr, setSelectedArr] = useState([])
  const [specificationArrs, setSpecificationArrs] = useState(backEndData)

  // 得到所有库存的幂集
  const formatData = useMemo(() => {
    let powerSetData = []
    const dumplicateData = []
    data.forEach(item => {
      powerSetData = powerSetData.concat(powerSet(item))
    })
    powerSetData.forEach(item1 => {
      let flag = true
      dumplicateData.forEach(item2 => {
        if (compareArr(item1, item2)) {
          flag = false
        }
      })
      if (flag) {
        dumplicateData.push(item1)
      }
    })
    specificationArrs.forEach(item => {
      dumplicateData.push(item.arr.map(item2 => item2.skuName))
    })
    return dumplicateData
  }, data)

  function select(sku) {
    const { skuName } = sku
    const cloneSelectedArr = [...selectedArr]
    const cloneSpecificationArrs = _.cloneDeep(specificationArrs)

    function setSkuObjectType(skuName, type) {
      cloneSpecificationArrs.forEach(item1 => {
        item1.arr.forEach(item2 => {
          if (item2.skuName === skuName) {
            item2.type = type
          }
        })
      })
    }

    // 分成两步做
    // 先更新selectedArr和每个sku的type为default还是primary
    if (cloneSelectedArr.includes(skuName)) {
      const index = cloneSelectedArr.findIndex(item => item === skuName)
      cloneSelectedArr.splice(index, 1)
      setSkuObjectType(skuName, '')
    } else {
      const selectedSpecificationArrsItem = cloneSpecificationArrs.find(item => {
        let flag = false
        item.arr.forEach(item2 => {
          if (item2.skuName === skuName) {
            flag = true
          }
        })
        return flag
      })

      const sameLayerSku = cloneSelectedArr.find(value => {
        let flag = false
        selectedSpecificationArrsItem.arr.forEach(obj => {
          if (obj.skuName === value) {
            flag = true
          }
        })
        return flag
      })

      if (sameLayerSku) {
        setSkuObjectType(sameLayerSku, '')
        const index = cloneSelectedArr.findIndex(value => value === sameLayerSku)
        cloneSelectedArr.splice(index, 1)
      }
      cloneSelectedArr.push(skuName)
      setSkuObjectType(skuName, 'primary')
    }

    // 第二步，遍历每一个sku，判断sku的disbable状态
    cloneSpecificationArrs.forEach(item1 => {
      item1.arr.forEach(item2 => {
        if (cloneSelectedArr.length === 0) {
          item2.disabled = false
          return
        }
        if (cloneSelectedArr.includes(item2.skuName)) {
          item2.disabled = false
        } else {
          const copyCloneSelectedArr = [...cloneSelectedArr]

          const index = cloneSelectedArr.findIndex(value => {
            return item1.arr.map(item3 => item3.skuName).includes(value)
          })



          if (index !== -1) {
            copyCloneSelectedArr.splice(index, 1, item2.skuName)
          } else {
            copyCloneSelectedArr.push(item2.skuName)
          }

          if (isArrEqual(formatData, copyCloneSelectedArr)) {
            item2.disabled = false
          } else {
            item2.disabled = true
          }
        }
      })
    })

    setSelectedArr(cloneSelectedArr)
    setSpecificationArrs(cloneSpecificationArrs)
  }


  return (
    <div>
      {
        specificationArrs.map(item => (
          <div key={item.id}>
            {item.name}
            {
              item.arr.map(item2 => {
                return (
                  <Button
                    onClick={() => select(item2)}
                    type={item2.type ? item2.type : 'defalut'}
                    disabled={item2.disabled}
                    key={item2.id}
                  >
                    {item2.skuName}
                  </Button>
                )
              })
            }
          </div>
        ))
      }
    </div>
  )
}

export default App;
