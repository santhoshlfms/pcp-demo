
let appData = {};

export const useAppData = () => {

  const setAppData = (field) =>{

      appData = {...appData, field};
    }

    return [
      appData,
      setAppData
    ]
        
  
}