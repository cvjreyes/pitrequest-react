//Para archivos json
const options = {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
}

//Todas las librerias
export const getLibrary = async() => {
    return await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getLibrary", options)
}

//Las Familias
export const getComponentsTypes = async() => {
    return await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getComponentTypes", options)
}

//Las Marcas
export const getComponentsBrands = async() => {
    return await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getComponentBrands", options)
}

//Las Disciplinas
export const getComponentDisciplines = async() => {
    return await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getComponentDisciplines", options)
}