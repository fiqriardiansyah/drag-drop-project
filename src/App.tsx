import React from "react"
import { useDrag, useDrop } from "react-dnd"
import { AppContext } from "./context"
import DrawZone from "./draw-zone"

export const dummyMaterial = [...new Array(6)].map((_, index) => ({ text: `Item ${index}`, price: `${(index + 1)}.000.000` }))

export const MenuTypes = {
  PROCESS: "process",
  MATERIAL: "material",
  OPERATOR: "operator"
}

export const BorderColor = {
  process: "border-orange-400",
  material: "border-blue-400",
  operator: "border-green-400",
}

export const OperatorData = {
  menuType: MenuTypes.OPERATOR,
  border: BorderColor.operator,
  text: "Operator"
}

export const ProcessData = {
  menuType: MenuTypes.PROCESS,
  border: BorderColor.process,
  text: "Process"
}

export const MenuBox = ({ className, ...props }: any) => {
  return (
    <div className={`border border-gray-300 rounded px-5 py-2 ${className} `} {...props} />
  )
}

export default function App() {
  const { setMenu, menu, boxes } = React.useContext(AppContext) as any;

  const onClickMenu = (str: string) => {
    return () => {
      setMenu(str)
    }
  }

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col gap-5 w-fit border-r border-gray-400 h-screen p-5">
        <MenuBox className={`${menu === "m" ? "bg-gray-200" : ""}`} onClick={onClickMenu("m")} title="Material">
          M
        </MenuBox>
        <MenuBox className={`${menu === "p" ? "bg-gray-200" : ""}`} onClick={onClickMenu("p")} title="Process">
          P
        </MenuBox>
        <MenuBox className={`${menu === "o" ? "bg-gray-200" : ""}`} onClick={onClickMenu("o")} title="Operator">
          O
        </MenuBox>
      </div>
      <DrawZone />
    </div>
  );
}
