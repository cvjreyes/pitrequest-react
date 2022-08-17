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

//Todas las librerias
export const getGroupProjects = async() => {
    return await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getGroupProjects", options)
}

//Las Familias
export const getComponentsTypes = async() => {
    return await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getComponentTypes", options)
}

//Las Marcas
export const getComponentsBrands = async() => {
    return await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getComponentBrands", options)
}

//Los tipos de proyecto
export const getProjectTypes = async() => {
    return await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getProjectTypes", options)
}

//Las Disciplinas
export const getComponentDisciplines = async() => {
    return await fetch("http://"+process.env.REACT_APP_SERVER+":"+process.env.REACT_APP_NODE_PORT+"/getComponentDisciplines", options)
}