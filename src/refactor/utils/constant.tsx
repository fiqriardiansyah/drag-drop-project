import { FaPuzzlePiece } from "react-icons/fa";
import { GiPuzzle } from "react-icons/gi";

export type MenuTypesType = {
    [key: string]: {
        id: number;
        text: string;
        style: string;
        initial: string;
        color: string;
        type: "PROCESS" | "OPERATOR" | "MATERIAL" | "VARIABLE" | "MODEL"
    }
}

export const cardProcessItemInfo = {
    style: {
        className: 'capitalize rounded bg-orange-300 text-white',
        color: 'bg-orange-300',
    }
}

export const cardOperatorItemInfo = {
    style: {
        className: 'capitalize rounded bg-red-300 text-white',
        color: 'bg-red-300'
    }
}

export const cardMaterialItemInfo = {
    style: {
        className: 'capitalize rounded !bg-blue-300 text-white',
        color: '!bg-blue-300'
    }
}

export const cardVariableItemInfo = {
    style: {
        className: 'capitalize rounded !bg-purple-300 text-white',
        color: '!bg-purple-300'
    }
}

export const cardModelItemInfo = {
    style: {
        className: 'capitalize rounded !bg-green-300 text-white',
        color: '!bg-green-300'
    }
}

export const MenuTypes: MenuTypesType = {
    operator: {
        id: 2,
        text: "Operator",
        style: cardOperatorItemInfo.style.className,
        color: cardOperatorItemInfo.style.color,
        initial: "O",
        type: "OPERATOR"
    },
    process: {
        id: 1,
        text: "Process",
        style: cardProcessItemInfo.style.className,
        color: cardProcessItemInfo.style.color,
        initial: "P",
        type: "PROCESS"
    },
    material: {
        id: 3,
        text: "Material",
        style: cardMaterialItemInfo.style.className,
        color: cardMaterialItemInfo.style.color,
        initial: "M",
        type: "MATERIAL"
    },
    variable: {
        id: 4,
        text: "Variable",
        style: cardVariableItemInfo.style.className,
        color: cardVariableItemInfo.style.color,
        initial: "V",
        type: "VARIABLE"
    },
    model: {
        id: 5,
        text: "Model",
        style: cardModelItemInfo.style.className,
        color: cardModelItemInfo.style.color,
        initial: "M",
        type: "MODEL",
    }
}

export const ModelTypes = [
    {
        type: MenuTypes.process.type,
        icon: <FaPuzzlePiece />
    },
    {
        type: MenuTypes.operator.type,
        icon: <GiPuzzle />
    }
]

export const convertToStringFormat = (num?: number | null) => {
    if (num === null || num === undefined) return "-";
    const mergeNum = num?.toString().split(".").join("");
    return mergeNum.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export const convertToIntFormat = (str?: string) => {
    if (str === null || str === undefined) return 0;
    return parseInt(str.toString().split(".").join(""), 10);
}