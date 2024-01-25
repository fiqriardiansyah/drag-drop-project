import { BorderColor, dummyMaterial } from "./App"
import MaterialItem from "./material-item"

const MaterialList = () => {
    return (
        <div className="w-full h-full flex flex-col gap-5">
            <h1>MATERIAL</h1>
            {dummyMaterial.map((material) => (
                <MaterialItem key={material.text} item={material} border={BorderColor.material}>
                    {material.text} <span className="ml-5">{material.price}</span>
                </MaterialItem>
            ))}
        </div>
    )
}

export default MaterialList