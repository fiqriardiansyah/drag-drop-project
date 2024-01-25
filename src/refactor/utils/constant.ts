export type MenuTypesType = {
    [key: string]: {
        id: number;
        text: string;
        style: string;
        initial: string;
        color: string;
        type: "PROCESS" | "OPERATOR" | "MATERIAL"
    }
}

export const cardProcessItemInfo = {
    style: {
        className: 'capitalize rounded !bg-orange-300 text-white',
        color: '!bg-orange-300',
    }
}

export const cardOperatorItemInfo = {
    style: {
        className: 'capitalize rounded !bg-red-300 text-white',
        color: '!bg-red-300'
    }
}

export const cardMaterialItemInfo = {
    style: {
        className: 'capitalize rounded !bg-blue-300 text-white',
        color: '!bg-blue-300'
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
    }
}

export const convertToStringFormat = (num?: number | null) => {
    if (num === null || num === undefined) return "-";
    const mergeNum = num?.toString().split(".").join("");
    return mergeNum.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export const convertToIntFormat = (str?: string) => {
    if (str === null || str === undefined) return 0;
    return parseInt(str.toString().split(".").join(""), 10);
}